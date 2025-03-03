import {ApiEndpoints} from '../types/api.ts';

export const createApiEndpoints = (baseUrl: string): ApiEndpoints => ({
	auth: {
		login: `${baseUrl}api/users/login`,
		register: `${baseUrl}api/users/register`,
	},
	devices: {
		register: `${baseUrl}api/users/devices`,
		getDeviceToken: `${baseUrl}/api/users/devices/:id`,
		delete: `${baseUrl}/api/devices/:id`,
	},
	user: {
		profile: `${baseUrl}/api/user/profile/:userId`,
		updateProfile: `${baseUrl}/api/user/profile`,
		settings: `${baseUrl}/api/user/settings`,
	},
	notifications: {
		getAll: `${baseUrl}/api/notifications`,
		markAsRead: `${baseUrl}/api/notifications/:id/read`,
		settings: `${baseUrl}/api/notifications/settings`,
	},
});
