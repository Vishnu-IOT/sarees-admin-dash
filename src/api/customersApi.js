import axiosClient from "./axiosClient";

// GET /users/get-customer?role=Customer&page=&limit=
// Backend already joins each customer with their Orders and returns `orderCount`.
export const getCustomers = (page = 1, limit = 10) =>
  axiosClient
    .get("/users/get-customer", { params: { role: "Customer", page, limit } })
    .then((res) => res.data);
