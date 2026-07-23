import axiosClient from "./axiosClient";

export const getUsers = () => axiosClient.get("/users").then((res) => res.data);

export const getUserById = (id) => axiosClient.get(`/users/${id}`).then((res) => res.data);

export const createUser = (payload) =>
  axiosClient.post("/users", payload).then((res) => res.data);

export const updateUser = (id, payload) =>
  axiosClient.put(`/users/${id}`, payload).then((res) => res.data);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`).then((res) => res.data);
