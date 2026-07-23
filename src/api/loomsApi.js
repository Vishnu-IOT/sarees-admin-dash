import axiosClient from "./axiosClient";

export const getLooms = () => axiosClient.get("/looms").then((res) => res.data);

export const getLoomById = (id) => axiosClient.get(`/looms/${id}`).then((res) => res.data);

export const createLoom = (payload) =>
  axiosClient.post("/looms", payload).then((res) => res.data);

export const updateLoom = (id, payload) =>
  axiosClient.put(`/looms/${id}`, payload).then((res) => res.data);

export const deleteLoom = (id) => axiosClient.delete(`/looms/${id}`).then((res) => res.data);
