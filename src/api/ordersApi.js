import axiosClient from "./axiosClient";

// GET /orders/get-orders?page=&limit=&status=&search=&sort=
export const getOrders = (params = {}) =>
  axiosClient
    .get("/orders/get-orders", { params })
    .then((res) => res.data);

// GET /orders/get-order/:orderId
export const getOrderById = (orderId) =>
  axiosClient.get(`/orders/get-order/${orderId}`).then((res) => res.data.data || res.data);

// POST /orders/create-order
export const createOrder = (payload) =>
  axiosClient.post("/orders/create-order", payload).then((res) => res.data);

// POST /orders/update-order-status/:id
export const updateOrderStatus = (id, status) =>
  axiosClient.post(`/orders/update-order-status/${id}`, { status }).then((res) => res.data);
