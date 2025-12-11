import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const API_BASE_URL_CONSTANT = API_BASE_URL;

export const genericApi = {
    getTables: async () => {
        const response = await axios.get(`${API_BASE_URL}/meta/tables`);
        return response.data;
    },

    getMetadata: async (table: string) => {
        const response = await axios.get(`${API_BASE_URL}/meta/table/${table}`);
        return response.data;
    },

    list: async (table: string, page: number = 1, limit: number = 10, filters: any = {}) => {
        const params: any = { page, per_page: limit };
        Object.keys(filters).forEach(key => {
            if (filters[key]) params[`filter[${key}]`] = filters[key];
        });

        const response = await axios.get(`${API_BASE_URL}/api/${table}`, { params });
        return response.data;
    },

    create: async (table: string, data: any) => {
        const response = await axios.post(`${API_BASE_URL}/api/${table}`, data);
        return response.data;
    },

    update: async (table: string, id: number, data: any) => {
        const response = await axios.put(`${API_BASE_URL}/api/${table}/${id}`, data);
        return response.data;
    },

    delete: async (table: string, id: number) => {
        const response = await axios.delete(`${API_BASE_URL}/api/${table}/${id}`);
        return response.data;
    },

    getTableConfig: async (table: string) => {
        const response = await axios.get(`${API_BASE_URL}/api/table_configurations/${table}`);
        return response.data;
    }
};
