export const ENDPOINTS = {
  // auth: {
  //   login: () => `/auth/login`,
  //   me: () => `/auth/me`,
  // },

  centres: {
    list: () => "/api/centres",
    create: () => "/api/centres",
    update: () => `/api/centres`,
    delete: (id: number) => `/api/centres/${id}`,
  },

  institutions: {
    list: () => "/api/institutions",
    create: () => "/api/institutions",
    get: (id: number) => `/api/institutions/${id}`,
    delete: (id: number) => `/api/institutions/${id}`,
  },

  extraitsDeces: {
    list: () => "/api/extraits-deces",
    create: () => "/api/extraits-deces",
    update: () => `/api/extraits-deces`,
    get: (id: number) => `/api/extraits-deces/${id}`,
    getByRegistre: (registre: string) => `/api/extraits-deces/recuperer-par-registre?registre=${encodeURIComponent(registre)}`,
    delete: (id: number) => `/api/extraits-deces/${id}`,
  },

  extraitsMariages: {
    list: () => "/api/extraits-mariages",
    create: () => "/api/extraits-mariages",
    update: () => `/api/extraits-mariages`,
    get: (id: number) => `/api/extraits-mariages/${id}`,
    getByRegistre: (registre: string) => `/api/extraits-mariages/recuperer-par-registre?registre=${encodeURIComponent(registre)}`,
    delete: (id: number) => `/api/extraits-mariages/${id}`,
  },
};
