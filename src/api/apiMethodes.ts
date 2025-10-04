import {ApiError} from "./types.ts";

const BASE_URL = import.meta.env.VITE_BASE_URL as string;

let accessToken: string | null = localStorage.getItem("eExtraitToken");

export const setAccessToken = (t: string) => {
  accessToken = t;
  localStorage.setItem("eExtraitToken", t);
};

export const clearAccessToken = () => {
  accessToken = null;
  localStorage.removeItem("eExtraitToken");
};

async function request<T>(
    path: string,
    isBlob: boolean = false,
    options: RequestInit = {}
): Promise<T | ApiError> {
  try {
    const headers: HeadersInit = {
      "Content-Type": isBlob ? "application/octet-stream" : "application/json",
      ...(options.headers || {}),
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
    };

    const res = await fetch(`${BASE_URL}${path}`, {...options, headers});

    if (res.status === 401) {
      return {message: "Unauthorized", status: 401};
    }

    if ("statut" in res && res.status === 401) {
      clearAccessToken();
      window.location.href = "/login";
    }

    if (!res.ok) {
      let text = await res.text();
      if (!text) {
        text = res.statusText || "Erreur inconnue";
      }

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
    if (err.name === "TypeError") {
      return {message: "Impossible de contacter le serveur", status: 0};
    }
    return {message: err.message || "Erreur réseau", status: 0};
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
