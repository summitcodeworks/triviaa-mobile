import ApiLogger from './apiLogger';

const TAG = 'apiClient';

// const BASE_URL = 'http://192.168.0.21:3000';
const BASE_URL = 'https://triviaa-backend.onrender.com';

interface ApiResponse<T = any> {
	data?: T;
	error?: string;
	status: number;
}

class ApiClient {
	static async makeRequest<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
		url = BASE_URL + url;
		console.log('API request: ' + url);
		return ApiLogger.logApiCall(url, options, async () => {
			const response = await fetch(url, options);
			const status = response.status;
			console.log(TAG, 'API response status: ' + url + ' ' + status);
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`HTTP error! Status: ${status}. Details: ${errorText}`);
			}

			const data = await response.json();
			return { data, status };
		});
	}

	static get<T>(url: string, headers: Record<string, string> = {}) {
		return this.makeRequest<T>(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...headers,
			},
		});
	}

	static post<T>(url: string, body: any, headers: Record<string, string> = {}) {
		return this.makeRequest<T>(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...headers,
			},
			body: JSON.stringify(body),
		});
	}

	static put<T>(url: string, body: any, headers: Record<string, string> = {}) {
		return this.makeRequest<T>(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...headers,
			},
			body: JSON.stringify(body),
		});
	}

	static delete<T>(url: string, headers: Record<string, string> = {}) {
		return this.makeRequest<T>(url, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...headers,
			},
		});
	}
}

export default ApiClient;
