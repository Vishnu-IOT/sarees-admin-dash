import axiosClient from "./axiosClient";

// GET https://sarees-backend-9wq0.onrender.com/products/get-products
// -> { success, products: [...], currentPage, totalPages, total }
export const getProducts = () =>
  axiosClient.get("/products/get-products").then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/products/create-product  (multipart/form-data, field "image")
export const createProduct = (formData) =>
  axiosClient
    .post("/products/create-product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/products/update-product/:id
export const updateProduct = (id, payload) =>
  axiosClient.post(`/products/update-product/${id}`, payload).then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/products/delete-product/:id
export const deleteProduct = (id) =>
  axiosClient.post(`/products/delete-product/${id}`).then((res) => res.data);
