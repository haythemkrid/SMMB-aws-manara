const json = async (url: string, options?: RequestInit) => { const response = await fetch(url, options); const value = await response.json(); if (!response.ok) throw new Error(`${response.status}: ${JSON.stringify(value)}`); return value; };
async function main(): Promise<void> {
	const login = await json('http://localhost:4000/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'client1', password: 'password123' }) });
	const request = await json('http://localhost:4001/requests', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ location: 'Building A / Room 12', requester: login.user.username, phoneNumber: '+213 555 000 000', urgencyLevel: 'high', interventionNature: ['Electrical'], problemDescription: 'The lights are flickering.' }) });
	await json(`http://localhost:4001/requests/${request.id}/status`, { method: 'PATCH', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'accepted' }) });
	const notifications = await json('http://localhost:4002/notifications');
	if (notifications.length < 2) throw new Error('Expected notifications for creation and acceptance');
	console.log(`Smoke test passed: ${request.id} created and accepted with ${notifications.length} notifications.`);
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });