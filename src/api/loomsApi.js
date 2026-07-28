import axiosClient from "./axiosClient";

// Loom Products (Direct-from-loom product listings)
export const getLooms = () =>
  axiosClient.get("/products/get-looms").then((res) => res.data.products || res.data || []);

export const getLoomById = (id) =>
  axiosClient.get("/products/get-products").then((res) => {
    const products = res.data.products || [];
    return products.find((p) => String(p.id) === String(id)) || null;
  });

// ✅ Tag an existing product as a loom product.
// NOTE: this calls the dedicated backend endpoint (see productController.AddToLoom),
// which only flips the `loom` flag and never touches price/variants/images.
// It requires the two routes below to be registered in backend/routes/productRoutes.js:
//   router.post("/add-to-loom/:productId", AddToLoom);
//   router.post("/remove-from-loom/:productId", RemoveFromLoom);
export const addToLoom = (productId) =>
  axiosClient.post(`/products/add-to-loom/${productId}`).then((res) => res.data);

// ✅ Untag a product from loom (does NOT delete the product).
export const removeFromLoom = (productId) =>
  axiosClient.post(`/products/remove-from-loom/${productId}`).then((res) => res.data);

// Permanently deletes the product entirely. Kept for admins who explicitly
// want to remove a loom listing altogether (used from Inventory, not from
// the quick "Remove from Loom" action).
export const deleteLoom = (id) =>
  axiosClient.post(`/products/delete-product/${id}`).then((res) => res.data);
