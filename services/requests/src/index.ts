import { randomUUID } from 'node:crypto';
import { body, json, startServer } from '../../../shared/http.js';
import { MaintenanceRequest, RequestStatus } from '../../../shared/types.js';
const requests: MaintenanceRequest[] = [];
const transitions: Record<RequestStatus, RequestStatus[]> = { pending: ['accepted', 'refused'], accepted: ['assigned'], refused: [], assigned: ['in-progress'], 'in-progress': ['completed'], completed: ['confirmed'], confirmed: [] };
const notificationsUrl = process.env.NOTIFICATIONS_URL ?? 'http://localhost:4002';
async function notify(request: MaintenanceRequest): Promise<void> { await fetch(`${notificationsUrl}/notifications/status-change`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ requestId: request.id, status: request.status, recipient: request.requester }) }); }
startServer(async (req, res, url) => {
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { service: 'requests', status: 'ok' });
  const routePath = url.pathname === '/' ? '/requests' : url.pathname.startsWith('/requests/') ? url.pathname : `/requests${url.pathname}`;
  if (req.method === 'GET' && routePath === '/requests') return json(res, 200, requests);
  if (req.method === 'POST' && routePath === '/requests') { const input = await body<Omit<MaintenanceRequest, 'id' | 'status' | 'createdAt'>>(req); const request: MaintenanceRequest = { ...input, id: randomUUID(), status: 'pending', createdAt: new Date().toISOString() }; requests.push(request); await notify(request); return json(res, 201, request); }
  const match = routePath.match(/^\/requests\/([^/]+)\/status$/);
  if (req.method === 'PATCH' && match) { const request = requests.find((candidate) => candidate.id === match[1]); if (!request) return json(res, 404, { error: 'Request not found' }); const input = await body<{ status: RequestStatus; assignedWorker?: string; rejectionReason?: string; workPerformed?: string }>(req); if (!transitions[request.status].includes(input.status)) return json(res, 409, { error: `Cannot move from ${request.status} to ${input.status}` }); request.status = input.status; Object.assign(request, { assignedWorker: input.assignedWorker, rejectionReason: input.rejectionReason, workPerformed: input.workPerformed }); await notify(request); return json(res, 200, request); }
  return json(res, 404, { error: 'Route not found' });
}, Number(process.env.PORT ?? 4001), 'requests', '/api/requests');