import axiosClient from "./axiosClient";

// GET https://sarees-backend-9wq0.onrender.com/category/get-sub-category -> { success, data: [...] }
export const getSubCategories = () =>
  axiosClient.get("/category/get-sub-subcategories").then((res) => res.data.data || []);

export const getSubCategories = () =>
  axiosClient.get(`/category/get-sub-subcategories/${collection}`).then((res) => res.data.data || []);


// POST https://sarees-backend-9wq0.onrender.com/category/create-sub-category
// Expected payload: { subcategory: "Kanchipuram", categoryId: 2 }
export const createSubCategory = (payload) =>
  axiosClient.post("/category/create-subcategory", payload).then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/category/update-sub-category/:id
export const updateSubCategory = (id, payload) =>
  axiosClient.post(`/category/update-subcategory/${id}`, payload).then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/category/delete-sub-category/:id
export const deleteSubCategory = (id) =>
  axiosClient.post(`/category/deletesub-category/${id}`).then((res) => res.data);
