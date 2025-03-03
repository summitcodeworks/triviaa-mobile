interface RequestLogData {
	url: string;
	method: string;
	headers?: Record<string, string>;
	body?: any;
}

interface ResponseLogData {
	status: number;
	headers: Headers;
	body?: any;
}

export default class ApiLogger {
	private static async logRequest(data: RequestLogData) {
		const logMessage = `
🌐 API Request:
URL: ${data.method} ${data.url}
Headers: ${JSON.stringify(data.headers, null, 2)}
Body: ${JSON.stringify(data.body, null, 2)}
        `.trim();

		console.log('\x1b[34m%s\x1b[0m', logMessage);
	}

	private static async logResponse(data: ResponseLogData) {
		// Safely handle undefined headers
		const headerObj = data.headers
			? Array.from(data.headers.entries()).reduce((acc, [key, value]) => {
				acc[key] = value;
				return acc;
			}, {} as Record<string, string>)
			: {};

		const logMessage = `
✨ API Response:
Status: ${data.status}
Headers: ${JSON.stringify(headerObj, null, 2)}
Body: ${JSON.stringify(data.body, null, 2)}
    `.trim();

		const color = data.status < 400 ? '\x1b[32m' : '\x1b[31m';
		console.log(color + '%s\x1b[0m', logMessage);
	}

	static async logApiCall<T>(
		url: string,
		options: RequestInit,
		handler: () => Promise<T>
	): Promise<T> {
		const startTime = Date.now();

		await this.logRequest({
			url,
			method: options.method || 'GET',
			headers: options.headers as Record<string, string>,
			body: options.body ? JSON.parse(options.body as string) : undefined,
		});

		try {
			const response = await handler();
			const endTime = Date.now();

			await this.logResponse({
				status: (response as Response).status,
				headers: (response as Response).headers,
				body: response,
			});

			console.log(`⏱️ Request took ${endTime - startTime}ms`);
			return response;
		} catch (error) {
			await this.logResponse({
				status: error.status || 500,
				headers: error.headers || new Headers(),
				body: {
					error: error.message,
					stack: error.stack
				}
			});
			throw error;
		}
	}
}
