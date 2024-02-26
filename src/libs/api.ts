import md5 from 'md5';
import axios from 'axios';

const BASE_URL = 'https://api.valantis.store:41000/';
const PASSWORD = 'Valantis';

interface Params {
	[key: string]: any;
}

const apiClient = axios.create({
	baseURL: BASE_URL,
	timeout: 60000,
	headers: {
		'Content-Type': 'application/json',
	},
});

const generateAuthHeader = () => {
	const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
	return md5(`${PASSWORD}_${timestamp}`);
};

export const fetchData = async (action: string, params: Params = {}) => {
	try {
		const response = await apiClient.post(
			'/',
			{
				action,
				params,
			},
			{
				headers: { 'X-Auth': generateAuthHeader() },
			},
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('API error:', error.response ? error.response.data : error.message);
		} else {
			console.error('Unexpected error:', error);
		}
		throw error;
	}
};
