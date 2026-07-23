import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as categoriesApi from "../api/categoriesApi";
import * as subcategoriesApi from "../api/subcategoriesApi";
import * as productsApi from "../api/productsApi";
import * as ordersApi from "../api/ordersApi";
import * as loomsApi from "../api/loomsApi";
import * as usersApi from "../api/usersApi";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  // ---- Live API-backed resources ----
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [looms, setLooms] = useState([]);
  const [users, setUsers] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [loomsLoading, setLoomsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Categories fetch error:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    try {
      const data = await subcategoriesApi.getSubCategories();
      setSubcategories(data);
    } catch (err) {
      console.error("Subcategories fetch error:", err);
      setSubcategories([]);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await productsApi.getProducts();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Products fetch error:", err);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchLooms = useCallback(async () => {
    setLoomsLoading(true);
    try {
      const data = await loomsApi.getLooms();
      setLooms(data || []);
    } catch (err) {
      console.error("Failed to fetch looms", err);
    } finally {
      setLoomsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const data = await usersApi.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
    fetchOrders();
    fetchLooms();
    fetchUsers();
  }, [fetchCategories, fetchSubcategories, fetchProducts, fetchOrders, fetchLooms, fetchUsers]);

  // ---------- Categories ----------
  const addCategory = useCallback(
    async (payload) => {
      const res = await categoriesApi.createCategory(payload);
      await fetchCategories();
      return res;
    },
    [fetchCategories]
  );

  const removeCategory = useCallback(
    async (id) => {
      await categoriesApi.deleteCategory(id);
      await fetchCategories();
      await fetchSubcategories();
    },
    [fetchCategories, fetchSubcategories]
  );

  // ---------- Sub-categories ----------
  const addSubCategory = useCallback(
    async (payload) => {
      const res = await subcategoriesApi.createSubCategory(payload);
      await fetchSubcategories();
      return res;
    },
    [fetchSubcategories]
  );

  const editSubCategory = useCallback(
    async (id, payload) => {
      const res = await subcategoriesApi.updateSubCategory(id, payload);
      await fetchSubcategories();
      return res;
    },
    [fetchSubcategories]
  );

  const removeSubCategory = useCallback(
    async (id) => {
      await subcategoriesApi.deleteSubCategory(id);
      await fetchSubcategories();
    },
    [fetchSubcategories]
  );

  // ---------- Products ----------
  const addProduct = useCallback(
    async (formData) => {
      const res = await productsApi.createProduct(formData);
      await fetchProducts();
      await fetchLooms();
      return res;
    },
    [fetchProducts, fetchLooms]
  );

  const editProduct = useCallback(
    async (id, payload) => {
      const res = await productsApi.updateProduct(id, payload);
      await fetchProducts();
      await fetchLooms();
      return res;
    },
    [fetchProducts, fetchLooms]
  );

  const removeProduct = useCallback(
    async (id) => {
      await productsApi.deleteProduct(id);
      await fetchProducts();
      await fetchLooms();
    },
    [fetchProducts, fetchLooms]
  );

  // ---------- Orders ----------
  const changeOrderStatus = useCallback(
    async (id, status) => {
      const res = await ordersApi.updateOrderStatus(id, status);
      await fetchOrders();
      return res;
    },
    [fetchOrders]
  );

  // ---------- Looms (Handloom Product Listings) ----------
  const removeLoom = useCallback(
    async (id) => {
      await loomsApi.deleteLoom(id);
      await fetchLooms();
      await fetchProducts();
    },
    [fetchLooms, fetchProducts]
  );

  // ---------- Users (Admin Dashboard Users) ----------
  const addUser = useCallback(
    async (userData) => {
      const res = await usersApi.createUser(userData);
      await fetchUsers();
      return res;
    },
    [fetchUsers]
  );

  const editUser = useCallback(
    async (id, updates) => {
      const res = await usersApi.updateUser(id, updates);
      await fetchUsers();
      return res;
    },
    [fetchUsers]
  );

  const removeUser = useCallback(
    async (id) => {
      await usersApi.deleteUser(id);
      await fetchUsers();
    },
    [fetchUsers]
  );

  const value = {
    categories,
    categoriesLoading,
    addCategory,
    removeCategory,
    fetchCategories,

    subcategories,
    addSubCategory,
    editSubCategory,
    removeSubCategory,

    products,
    productsLoading,
    addProduct,
    editProduct,
    removeProduct,

    orders,
    ordersLoading,
    changeOrderStatus,
    fetchOrders,

    looms,
    loomsLoading,
    removeLoom,
    fetchLooms,

    users,
    usersLoading,
    addUser,
    editUser,
    removeUser,
    fetchUsers,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("useData must be used within a DataProvider");
  }
  return ctx;
}
