import React from "react";
import { useData } from "../../context/DataContext";
import "./Customers.css";

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function Customers() {
  const { customers, customersLoading, customersMeta, fetchCustomers } = useData();

  const totalOrdersAcrossCustomers = customers.reduce(
    (sum, c) => sum + Number(c.orderCount || 0),
    0
  );
  const repeatCustomers = customers.filter((c) => Number(c.orderCount || 0) > 1).length;

  const goToPage = (page) => {
    fetchCustomers(page, 10);
  };

  return (
    <div className="customers">
      <div className="customers__header">
        <div>
          <h1 className="customers__title">Customer Management</h1>
          <p className="customers__subtitle">Everyone who has signed up on the storefront, with their order history at a glance.</p>
        </div>
      </div>

      <div className="customers__stats">
        <div className="customers__stat-card">
          <span className="customers__stat-label">Total Customers</span>
          <span className="customers__stat-value">{customersMeta.totalCustomers}</span>
        </div>
        <div className="customers__stat-card">
          <span className="customers__stat-label">Repeat Customers</span>
          <span className="customers__stat-value customers__stat-value--success">{repeatCustomers}</span>
        </div>
        <div className="customers__stat-card">
          <span className="customers__stat-label">Orders (this page)</span>
          <span className="customers__stat-value">{totalOrdersAcrossCustomers}</span>
        </div>
      </div>

      <div className="customers__panel">
        <div className="customers__panel-header">
          <h2 className="customers__panel-title">Customer Directory</h2>
        </div>

        {customersLoading && <p style={{ padding: "20px" }}>Loading customers...</p>}

        <div className="customers__table-scroll">
          <table className="customers__table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Location</th>
                <th>Orders</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {!customersLoading && customers.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "24px", color: "#888" }}>
                    No customers found.
                  </td>
                </tr>
              )}
              {customers.map((customer) => {
                // The backend query runs with `raw: true`, so the joined
                // Customer profile comes back as flattened "customers.x" keys
                // rather than a nested customer.customers object.
                const name = customer["customers.name"] || customer.name || "—";
                const phone = customer["customers.phone"] || "—";
                const email = customer["customers.email"] || customer.email || "—";
                const address = customer["customers.address"] || "—";
                return (
                  <tr key={customer.id}>
                    <td>
                      <div className="customers__name-cell">
                        <span className="customers__avatar">{name.charAt(0).toUpperCase()}</span>
                        <div>
                          <p className="customers__name">{name}</p>
                          <p className="customers__uid">ID: #{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{phone}</td>
                    <td className="customers__email">{email}</td>
                    <td>{address}</td>
                    <td>
                      <span className="customers__status customers__status--active">
                        <span className="customers__status-dot" /> {customer.orderCount || 0} order
                        {Number(customer.orderCount) === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td>{formatDate(customer.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {customersMeta.totalPages > 1 && (
          <div className="customers__pagination">
            <span>
              Page {customersMeta.currentPage} of {customersMeta.totalPages}
            </span>
            <div className="customers__pagination-controls">
              <button
                className="customers__page-btn"
                disabled={customersMeta.currentPage === 1}
                onClick={() => goToPage(customersMeta.currentPage - 1)}
              >
                🠔
              </button>
              <button
                className="customers__page-btn"
                disabled={customersMeta.currentPage === customersMeta.totalPages}
                onClick={() => goToPage(customersMeta.currentPage + 1)}
              >
                ➝
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
