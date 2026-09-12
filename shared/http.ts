import { createServer, IncomingMessage, ServerResponse } from 'node:http';

export function json(res: ServerResponse, status: number, value: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS', 'access-control-allow-headers': 'content-type,authorization' });
  res.end(JSON.stringify(value));
}
export async function body<T>(req: IncomingMessage): Promise<T> { let raw = ''; for await (const chunk of req) raw += chunk; return raw ? JSON.parse(raw) as T : {} as T; }
export function startServer(handler: (req: IncomingMessage, res: ServerResponse, url: URL) => Promise<void>, port: number, service: string, pathPrefix = ''): void {
  createServer(async (req, res) => { const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`); if (pathPrefix && url.pathname.startsWith(pathPrefix)) url.pathname = url.pathname.slice(pathPrefix.length) || '/'; if (req.method === 'OPTIONS') return json(res, 204, {}); try { await handler(req, res, url); } catch (error) { console.error(`[${service}]`, error); json(res, 500, { error: 'Internal server error' }); } }).listen(port, () => console.log(`${service} listening on http://localhost:${port}`));
}