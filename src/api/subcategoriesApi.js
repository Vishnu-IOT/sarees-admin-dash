import axiosClient from "./axiosClient";

// GET /category/get-subcategories -> { success, data: [...] }
export const getSubCategories = () =>
  axiosClient.get("/category/get-subcategories").then((res) => res.data.data || []);

// GET /category/get-subcategories/:collection
export const getSubCategoriesByCollection = (collection) =>
  axiosClient.get(`/category/get-subcategories/${collection}`).then((res) => res.data.data || []);

// POST /category/create-subcategory -> payload: { name, categoryId, image, status }
export const createSubCategory = (payload) =>
  axiosClient.post("/category/create-subcategory", payload).then((res) => res.data);

// PUT /category/update-subcategory/:id
export const updateSubCategory = (id, payload) =>
  axiosClient.post(`/category/update-subcategory/${id}`, payload).then((res) => res.data);

// DELETE /category/delete-subcategory/:id
export const deleteSubCategory = (id) =>
  axiosClient.get(`/category/delete-subcategory/${id}`).then((res) => res.data);
