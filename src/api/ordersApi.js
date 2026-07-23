import axiosClient from "./axiosClient";

// GET https://sarees-backend-9wq0.onrender.com/orders/get-orders
export const getOrders = () =>
  axiosClient.get("/orders/get-orders").then((res) => res.data.orders || res.data.data || res.data);

// POST https://sarees-backend-9wq0.onrender.com/orders/create-orders
export const createOrder = (payload) =>
  axiosClient.post("/orders/create-orders", payload).then((res) => res.data);

// POST https://sarees-backend-9wq0.onrender.com/orders/order-status/:id/status
export const updateOrderStatus = (id, status) =>
  axiosClient.post(`/orders/order-status/${id}/status`, { status }).then((res) => res.data);
