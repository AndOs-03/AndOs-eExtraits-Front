import {ApiError} from "./types.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

let accessToken: string | null = localStorage.getItem("token");

export const setAccessToken = (t: string) => {
  accessToken = t;
  localStorage.setItem("token", t);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("token");
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T | ApiError> {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    const res = await fetch(`${BASE_URL}${path}`, {...options, headers});

    if (res.status === 401) {
      return {message: "Unauthorized", status: 401};
    }

    if (!res.ok) {
      const text = await res.text();
      return {
        message: text || res.statusText,
        status: res.status
      };
    }

    try {
      const data = await res.json();
      return data as T;
    } catch {
      return {} as T;
    }
  } catch (err: any) {
    return {message: err.message || "Network error"};
  }
}

export const apiCentres = {
  get: async <T>(path: string): Promise<T | ApiError> => {
    return await request<T>(path);
  },

  post: async <T>(path: string, body?: any): Promise<T | ApiError> => {
    return await request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async <T>(path: string, body?: any): Promise<T | ApiError> => {
    return await request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },


  delete: async <T>(path: string): Promise<T | ApiError> => {
    return await request<T>(path, {method: "DELETE"});
  },
};
