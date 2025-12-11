import { DataProvider, HttpError } from "@refinedev/core";
import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const customError: HttpError = {
            ...error,
            message: error.response?.data?.message || "Something went wrong",
            statusCode: error.response?.status || 500,
        };
        return Promise.reject(customError);
    }
);

export const dataProvider = (apiUrl: string): DataProvider => ({
    getList: async ({ resource, pagination, filters, sort }) => {
        const url = `${apiUrl}/api/${resource}`;

        const current = pagination?.current || 1;
        const pageSize = pagination?.pageSize || 10;

        const queryFilters: any = {};
        if (filters) {
            filters.map((filter: any) => {
                if ("field" in filter) {
                    if (filter.operator === "eq") {
                        queryFilters[`filter[${filter.field}]`] = filter.value;
                    } else if (filter.operator === "contains" && filter.field === "_search") {
                        // Handle search query
                        queryFilters['_search'] = filter.value;
                    }
                }
            });
        }

        // Handle sorting
        let sortParams: any = {};
        if (sort && sort.length > 0) {
            sortParams = {
                sortBy: sort[0].field,
                sortOrder: sort[0].order.toUpperCase(), // 'asc' -> 'ASC', 'desc' -> 'DESC'
            };
        }

        const { data } = await axiosInstance.get(url, {
            params: {
                page: current,
                per_page: pageSize,
                ...queryFilters,
                ...sortParams,
            },
        });

        return {
            data: data.data || data.items, // Support both formats
            total: data.total,
        };
    },

    getOne: async ({ resource, id }) => {
        const url = `${apiUrl}/api/${resource}/${id}`;
        const { data } = await axiosInstance.get(url);

        return {
            data: data.data,
        };
    },

    create: async ({ resource, variables }) => {
        const url = `${apiUrl}/api/${resource}`;
        const { data } = await axiosInstance.post(url, variables);

        return {
            data: data.data,
        };
    },

    update: async ({ resource, id, variables }) => {
        const url = `${apiUrl}/api/${resource}/${id}`;
        const { data } = await axiosInstance.put(url, variables);

        return {
            data: data.data,
        };
    },

    deleteOne: async ({ resource, id }) => {
        const url = `${apiUrl}/api/${resource}/${id}`;
        await axiosInstance.delete(url);

        return {
            data: { id } as any,
        };
    },

    getApiUrl: () => apiUrl,

    getMany: async () => { throw new Error("getMany not implemented"); },
    createMany: async () => { throw new Error("createMany not implemented"); },
    deleteMany: async () => { throw new Error("deleteMany not implemented"); },
    updateMany: async () => { throw new Error("updateMany not implemented"); },
    custom: async () => { throw new Error("custom not implemented"); },
});
