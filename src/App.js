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
import ServiceRequests from "./pages/ServiceRequests/ServiceRequests";
import ServiceRequestDetail from "./pages/ServiceRequests/ServiceRequestDetail";
import "./App.css";
import Customers from "./pages/Customers/Customers";

function App() {
  
  let admin_data = {};
  try {
    admin_data = JSON.parse(localStorage.getItem("admin_data")) || {};
  } catch (e) {
    admin_data = {};
  }

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search orders, SKU, or users..." userName={admin_data.name || "Admin"} userRole="Administrator" />
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
                  userName={admin_data.name || "Admin"}
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
                <Layout searchPlaceholder="Quick search inventory..." userName={admin_data.name || "Admin"} userRole="Administrator" />
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
                <Layout searchPlaceholder="Search orders, IDs, or products..." userName={admin_data.name || "Admin"} userRole="Administrator" />
              </ProtectedRoute>
            }
          >
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search looms by ID or location..." userName={admin_data.name || "Admin"} userRole="Administrator" />
              </ProtectedRoute>
            }
          >
            <Route path="/looms" element={<Looms />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search users or roles..." userName={admin_data.name || "Admin"} userRole="Administrator" />
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
                <Layout searchPlaceholder="Search Customers..." userName={admin_data.name || "Admin"} userRole="Administrator" />
              </ProtectedRoute>
            }
          >
            <Route path="/customers" element={<Customers />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <Layout searchPlaceholder="Search Service Request..." userName={admin_data.name || "Admin"} userRole="Administrator" />
              </ProtectedRoute>
            }
          >
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/service-requests/:id" element={<ServiceRequestDetail />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
