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
    getByRegistre: (registre: string) => `/api/extraits-deces?registre=${encodeURIComponent(registre)}`,
    delete: (id: number) => `/api/extraits-deces/${id}`,
  },
};
