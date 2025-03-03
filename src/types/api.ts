export interface ApiEndpoints {
	auth: {
		login: string;
		register: string;
	};
	devices: {
		register: string;
		getDeviceToken: string;
		delete: string;
	};
	user: {
		profile: string;
		updateProfile: string;
		settings: string;
	};
	notifications: {
		getAll: string;
		markAsRead: string;
		settings: string;
	};
}
