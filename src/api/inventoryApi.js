import axiosClient from "./axiosClient";

export const getInventory = () => axiosClient.get(`${process.env.REACT_API_URL}get-products`).then((res) => console.log(res.data));

export const getInventoryItemById = (id) =>
  axiosClient.get(`/inventory/${id}`).then((res) => res.data);

export const createInventoryItem = (payload) =>
  axiosClient.post("/inventory", payload).then((res) => res.data);

export const updateInventoryItem = (id, payload) =>
  axiosClient.put(`/inventory/${id}`, payload).then((res) => res.data);

export const deleteInventoryItem = (id) =>
  axiosClient.delete(`/inventory/${id}`).then((res) => res.data);
