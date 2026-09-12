import { createHmac, randomUUID } from 'node:crypto';
import { body, json, startServer } from '../../../shared/http.js';
import { Role, User } from '../../../shared/types.js';

const users: User[] = [
  { id: 'u-manager', username: 'manager', password: 'password123', role: 'manager', fullName: 'Meriem Manager', email: 'manager@smmb.local', isActive: true },
  { id: 'u-director', username: 'director', password: 'password123', role: 'director', fullName: 'Dalia Director', email: 'director@smmb.local', isActive: true },
  ...Array.from({ length: 5 }, (_, i) => ({ id: `u-client-${i + 1}`, username: `client${i + 1}`, password: 'password123', role: 'client' as Role, fullName: `Client ${i + 1}`, email: `client${i + 1}@smmb.local`, isActive: true })),
  ...Array.from({ length: 3 }, (_, i) => ({ id: `u-worker-${i + 1}`, username: `worker${i + 1}`, password: 'password123', role: 'worker' as Role, fullName: `Worker ${i + 1}`, email: `worker${i + 1}@smmb.local`, isActive: true })),
];
const secret = process.env.JWT_SECRET ?? 'local-development-secret';
function token(user: User): string { const payload = Buffer.from(JSON.stringify({ sub: user.id, username: user.username, role: user.role })).toString('base64url'); return `${payload}.${createHmac('sha256', secret).update(payload).digest('base64url')}`; }

startServer(async (req, res, url) => {
  if (req.method === 'GET' && url.pathname === '/health') return json(res, 200, { service: 'auth', status: 'ok' });
  if (req.method === 'POST' && url.pathname === '/login') { const input = await body<{ username?: string; password?: string }>(req); const user = users.find((candidate) => candidate.username === input.username && candidate.password === input.password && candidate.isActive); if (!user) return json(res, 401, { error: 'Invalid username or password' }); const { password: _, ...safeUser } = user; return json(res, 200, { token: token(user), user: safeUser }); }
  if (req.method === 'GET' && url.pathname === '/users') { const role = url.searchParams.get('role'); return json(res, 200, users.filter((user) => user.isActive && (!role || user.role === role)).map(({ password: _, ...user }) => user)); }
  if (req.method === 'POST' && url.pathname === '/users') { const input = await body<Omit<User, 'id' | 'isActive'>>(req); const user: User = { ...input, id: randomUUID(), isActive: true }; users.push(user); const { password: _, ...safeUser } = user; return json(res, 201, safeUser); }
  return json(res, 404, { error: 'Route not found' });
}, Number(process.env.PORT ?? 4000), 'auth', '/api/auth');