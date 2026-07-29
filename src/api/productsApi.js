import axiosClient from "./axiosClient";

// GET /products/get-products
export const getProducts = (page, limit) =>
  axiosClient.get(`/products/get-products?page=${page}&limit=${limit}`).then((res) => res.data);

// GET /products/get-sarees
export const getSarees = (page, limit) =>
  axiosClient.get(`/products/get-sarees?page=${page}&limit=${limit}`).then((res) => res.data);

// GET /products/get-jewels
export const getJewels = (page, limit) =>
  axiosClient.get(`/products/get-jewels?page=${page}&limit=${limit}`).then((res) => res.data);

// ✅ Single helper the Inventory page uses to switch between
// All Products / Sarees / Jewels without duplicating fetch logic.
export const getProductsByCollection = (collection, page = 1, limit = 8) => {
  if (collection === "SAREE") return getSarees(page, limit);
  if (collection === "JEWEL") return getJewels(page, limit);
  return getProducts(page, limit);
};

// GET /products/get-looms
export const getLoomProducts = () =>
  axiosClient.get("/products/get-looms").then((res) => res.data);

// POST /products/create-product (multipart/form-data)
export const createProduct = (formData) =>
  axiosClient
    .post("/products/create-product", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

// POST /products/update-product/:id
export const updateProduct = (id, payload) => {
  const config =
    payload instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
  return axiosClient
    .post(`/products/update-product/${id}`, payload, config)
    .then((res) => res.data);
};

// POST /products/delete-product/:id
export const deleteProduct = (id) =>
  axiosClient.post(`/products/delete-product/${id}`).then((res) => res.data);
