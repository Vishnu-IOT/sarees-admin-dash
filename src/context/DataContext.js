import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import * as categoriesApi from "../api/categoriesApi";
import * as subcategoriesApi from "../api/subcategoriesApi";
import * as productsApi from "../api/productsApi";
import * as ordersApi from "../api/ordersApi";
import { MOCK_LOOMS, MOCK_USERS } from "../data/mockData";

const DataContext = createContext(null);

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export function DataProvider({ children }) {
  // ---- Live API-backed resources ----
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // ---- No backend endpoint provided for these yet - kept local/mock ----
  const [looms, setLooms] = useState(MOCK_LOOMS);
  const [users, setUsers] = useState(MOCK_USERS);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchSubcategories = useCallback(async () => {
    try {
      const data = await subcategoriesApi.getSubCategories();
      setSubcategories(data);
    } catch {
      // leave whatever we already had
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const data = await productsApi.getProducts();
      setProducts(data.products || []);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.getOrders();
      setOrders(Array.isArray(data) ? data : data.orders || data.data || []);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchProducts();
    fetchOrders();
  }, [fetchCategories, fetchSubcategories, fetchProducts, fetchOrders]);

  // ---------- Categories (create + delete only - no update route on backend) ----------
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
      return res;
    },
    [fetchProducts]
  );

  const editProduct = useCallback(
    async (id, payload) => {
      const res = await productsApi.updateProduct(id, payload);
      await fetchProducts();
      return res;
    },
    [fetchProducts]
  );

  const removeProduct = useCallback(
    async (id) => {
      await productsApi.deleteProduct(id);
      await fetchProducts();
    },
    [fetchProducts]
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

  // ---------- Looms (local only, no backend route yet) ----------
  const addLoom = useCallback((loom) => {
    const newLoom = { ...loom, id: loom.id || makeId("LM") };
    setLooms((prev) => [newLoom, ...prev]);
    return newLoom;
  }, []);

  const editLoom = useCallback((id, updates) => {
    setLooms((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  }, []);

  const removeLoom = useCallback((id) => {
    setLooms((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const toggleLoomStatus = useCallback((id) => {
    setLooms((prev) => prev.map((l) => (l.id === id ? { ...l, status: !l.status } : l)));
  }, []);

  // ---------- Users (local only, no backend route yet) ----------
  const addUser = useCallback((user) => {
    const newUser = { ...user, id: user.id || makeId("UID") };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  }, []);

  const editUser = useCallback((id, updates) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  }, []);

  const removeUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

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
    addLoom,
    editLoom,
    removeLoom,
    toggleLoomStatus,

    users,
    addUser,
    editUser,
    removeUser,
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
