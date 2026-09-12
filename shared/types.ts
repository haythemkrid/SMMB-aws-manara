export type Role = 'client' | 'director' | 'manager' | 'worker';
export type RequestStatus = 'pending' | 'accepted' | 'refused' | 'assigned' | 'in-progress' | 'completed' | 'confirmed';

export interface User { id: string; username: string; password: string; role: Role; fullName: string; email: string; isActive: boolean; }
export interface MaintenanceRequest { id: string; status: RequestStatus; createdAt: string; location: string; requester: string; phoneNumber: string; urgencyLevel: 'low' | 'medium' | 'high'; interventionNature: string[]; problemDescription: string; assignedWorker?: string; rejectionReason?: string; workPerformed?: string; }
export interface StatusNotification { id: string; requestId: string; status: RequestStatus; recipient: string; createdAt: string; }