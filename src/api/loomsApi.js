import axiosClient from "./axiosClient";

// Loom Products (Direct-from-loom product listings)
export const getLooms = () =>
  axiosClient.get("/products/get-looms").then((res) => res.data.products || res.data || []);

export const getLoomById = (id) =>
  axiosClient.get("/products/get-products").then((res) => {
    const products = res.data.products || [];
    return products.find((p) => String(p.id) === String(id)) || null;
  });

export const deleteLoom = (id) =>
  axiosClient.post(`/products/delete-product/${id}`).then((res) => res.data);
