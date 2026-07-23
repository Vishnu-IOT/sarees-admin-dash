import axiosClient from "./axiosClient";

// GET /category/get-categories -> { success, data: [...] }
export const getCategories = () =>
  axiosClient.get("/category/get-categories").then((res) => res.data.data || []);

// GET /category/get-categories/:collection -> { success, data: [...] }
export const getCategoriesByCollection = (collection) =>
  axiosClient.get(`/category/get-categories/${collection}`).then((res) => res.data.data || []);

// POST /category/create-category -> { name, collection }
export const createCategory = (payload) =>
  axiosClient.post("/category/create-category", payload).then((res) => res.data);

// DELETE /category/delete-category/:id
export const deleteCategory = (id) =>
  axiosClient.delete(`/category/delete-category/${id}`).then((res) => res.data);
