import axiosClient from "./axiosClient";

const API_BASE = "/service-request";

// GET all service requests
export const getServiceRequests = (params = {}) =>
  axiosClient
    .get(`${API_BASE}/get-request`, { params })
    .then((res) => res.data);

// GET service request by ID
export const getServiceRequestById = (id) =>
  axiosClient
    .get(`${API_BASE}/reqeust-by-id/${id}`)
    .then((res) => res.data.data || res.data);

// GET requests for a specific order
export const getRequestsByOrderId = (orderId, params = {}) =>
  axiosClient
    .get(`${API_BASE}/orders-request/${orderId}`, { params })
    .then((res) => res.data);

// POST create new service request
export const createServiceRequest = (payload) =>
  axiosClient
    .post(`${API_BASE}/create-submit-request`, payload)
    .then((res) => res.data);

// PUT update service request status
export const updateServiceRequestStatus = (id, updateData) =>
  axiosClient
    .put(`${API_BASE}/update-request/${id}`, updateData)
    .then((res) => res.data);

// DELETE service request
export const deleteServiceRequest = (id) =>
  axiosClient
    .delete(`${API_BASE}/delete-request/${id}`)
    .then((res) => res.data);
