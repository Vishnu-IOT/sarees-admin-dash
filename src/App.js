import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Inventory from "./pages/Inventory/Inventory";
import AddInventory from "./pages/AddInventory/AddInventory";
import ProductDetail from "./pages/Inventory/ProductDetail";
import Categories from "./pages/Categories/Categories";
import AddCategory from "./pages/Categories/AddCategory";
import AddSubcategory from "./pages/Categories/AddSubcategory";
import Orders from "./pages/Orders/Orders";
import OrderDetail from "./pages/Orders/OrderDetail";
import Looms from "./pages/Looms/Looms";
import Users from "./pages/Users/Users";
import AddUser from "./pages/Users/AddUser";
import "./App.css";
import Customers from "./pages/Customers/Customers";

function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search orders, SKU, or users..." userName="Warehouse Admin" />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout
                  searchPlaceholder="Search inventory, SKUs, or categories..."
                  userName="Admin Console"
                  userRole="Administrator"
                />
              </ProtectedRoute>
            }
          >
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/new" element={<AddInventory />} />
            <Route path="/inventory/edit/:id" element={<AddInventory />} />
            <Route path="/inventory/view/:id" element={<ProductDetail />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Quick search inventory..." userName="Warehouse Manager" />
              </ProtectedRoute>
            }
          >
            <Route path="/categories" element={<Categories />} />
            <Route path="/categories/new" element={<AddCategory />} />
            <Route path="/categories/categories/edit/:id" element={<AddCategory />} />
            <Route path="/categories/subcategories/new" element={<AddSubcategory />} />
            <Route path="/categories/subcategories/edit/:id" element={<AddSubcategory />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search orders, IDs, or products..." userName="Admin Console" />
              </ProtectedRoute>
            }
          >
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search looms by ID or location..." userName="Admin Console" />
              </ProtectedRoute>
            }
          >
            <Route path="/looms" element={<Looms />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search users or roles..." userName="Admin Panel" />
              </ProtectedRoute>
            }
          >
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<AddUser />} />
            <Route path="/users/edit/:id" element={<AddUser />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search Customers..." userName="Admin Panel" />
              </ProtectedRoute>
            }
          >
            <Route path="/customers" element={<Customers />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
