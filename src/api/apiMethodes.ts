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

async function request<T>(path: string, isBlob: boolean = false, options: RequestInit = {}): Promise<T | ApiError> {
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
      if (isBlob) {
        const blobData = await res.blob();
        return blobData as unknown as T;
      } else {
        const jsonData = await res.json();
        return jsonData as T;
      }
    } catch {
      return {} as T;
    }
  } catch (err: any) {
    return {message: err.message || "Network error"};
  }
}

export const apiMethodes = {

  get: async <T>(path: string): Promise<T | ApiError> => {
    return await request<T>(path);
  },

  getFile: async <T>(path: string): Promise<T | ApiError> => {
    return await request<T>(path, true);
  },

  post: async <T>(path: string, body?: any): Promise<T | ApiError> => {
    return await request<T>(path, false, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put: async <T>(path: string, body?: any): Promise<T | ApiError> => {
    return await request<T>(path, false, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },


  delete: async <T>(path: string): Promise<T | ApiError> => {
    return await request<T>(path, false, {method: "DELETE"});
  },
};
