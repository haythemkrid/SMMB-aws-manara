import { randomUUID } from 'node:crypto';
import { body, json, startServer } from '../../../shared/http.js';
import { RequestStatus, StatusNotification } from '../../../shared/types.js';
const notifications: StatusNotification[] = [];
startServer(async (req, res, url) => {
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { service: 'notifications', status: 'ok' });
  const routePath = url.pathname === '/' ? '/notifications' : url.pathname.startsWith('/notifications/') ? url.pathname : `/notifications${url.pathname}`;
  if (req.method === 'GET' && routePath === '/notifications') return json(res, 200, notifications);
  if (req.method === 'POST' && routePath === '/notifications/status-change') { const input = await body<{ requestId: string; status: RequestStatus; recipient: string }>(req); const notification: StatusNotification = { ...input, id: randomUUID(), createdAt: new Date().toISOString() }; notifications.push(notification); return json(res, 201, notification); }
  return json(res, 404, { error: 'Route not found' });
}, Number(process.env.PORT ?? 4002), 'notifications', '/api/notifications');