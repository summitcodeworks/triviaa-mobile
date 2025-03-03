import {createApiEndpoints} from './api.ts';

const ENV = {
	dev: {
		BASE_URL: 'http://192.168.0.21:3000/',
	},
	prod: {
		BASE_URL: 'http://192.168.0.21:3000/',
	},
} as const;

const getEnvVars = (env = process.env.NODE_ENV || 'development') => {
	const envConfig = env === 'development' ? ENV.dev : ENV.prod;
	return {
		...envConfig,
		api: createApiEndpoints(envConfig.BASE_URL),
	};
};

export default getEnvVars();
