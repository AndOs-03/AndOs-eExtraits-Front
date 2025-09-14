export const ENDPOINTS = {
  // auth: {
  //   login: () => `/auth/login`,
  //   me: () => `/auth/me`,
  // },

  centres: {
    list: () => "/api/centres",
    create: () => "/api/centres",
    get: (id: number) => `/api/centres/${id}`,  // GET pour un centre précis
    update: () => `/api/centres`, // PUT pour modifier
    delete: (id: number) => `/api/centres/${id}`,
  },

  institutions: {
    list: () => "/api/institutions",
    create: () => "/api/institutions",
    get: (id: number) => `/api/institutions/${id}`,
    delete: (id: number) => `/api/institutions/${id}`,
  },
};
