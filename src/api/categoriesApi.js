import axiosClient from "./axiosClient";

// GET https://sarees-backend-9wq0.onrender.com/category/get-category -> { success, data: [...] }
export const getCategories = () =>
  axiosClient.get("/category/get-categories").then((res) => res.data.data || []);

// GET https://sarees-backend-9wq0.onrender.com/category/get-category -> { success, data: [...] }
export const getCategories = () =>
  axiosClient.get("/category/get-categories/:collection").then((res) => res.data.data || []);

// POST https://sarees-backend-9wq0.onrender.com/category/create-category
export const createCategory = (payload) =>
  axiosClient.post("/category/create-category", payload).then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/category/delete-category/:id
export const deleteCategory = (id) =>
  axiosClient.post(`/category/delete-category/${id}`).then((res) => res.data);
