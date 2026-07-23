import axiosClient from "./axiosClient";

// GET /users
export const getUsers = () =>
  axiosClient.get("/users").then((res) => res.data.data || []);

// GET /users/:id
export const getUserById = (id) =>
  axiosClient.get(`/users/${id}`).then((res) => res.data.data || res.data);

// POST /users
export const createUser = (payload) =>
  axiosClient.post("/users", payload).then((res) => res.data);

// PUT /users/:id
export const updateUser = (id, payload) =>
  axiosClient.put(`/users/${id}`, payload).then((res) => res.data);

// DELETE /users/:id
export const deleteUser = (id) =>
  axiosClient.delete(`/users/${id}`).then((res) => res.data);
