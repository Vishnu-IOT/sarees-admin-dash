import axiosClient from "./axiosClient";

// POST https://sarees-backend-9wq0.onrender.com/new/login  { email, password }
export const login = (email, password) =>
  axiosClient.post("/new/login", { email, password }).then((res) => res.data);
