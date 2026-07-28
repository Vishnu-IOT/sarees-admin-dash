import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Inventory.css";

function statusClass(status) {
  return `inventory__status inventory__status--${(status || "").toLowerCase()}`;
}

const TABS = [
  { key: "ALL", label: "All Products" },
  { key: "SAREE", label: "Saree Products" },
  { key: "JEWEL", label: "Jewel Products" },
];

function Inventory() {
  const navigate = useNavigate();
  const { products, pageProducts, productsCollection, productsLoading, removeProduct, fetchProducts } = useData();

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchProducts(currentPage, limit, productsCollection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleTabChange = (collection) => {
    setCurrentPage(1);
    fetchProducts(1, limit, collection);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
    fetchProducts(page, limit, productsCollection);
  };

  const activeCount = products?.filter((p) => p.status === "active").length;
  const featuredCount = products?.filter((p) => p.isFeatured).length;
  const categoryCount = new Set(products?.map((p) => p.categoryId)).size;

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    try {
      await removeProduct(product.id);
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't delete this product. Please try again.");
    }
  };

  return (
    <div className="inventory">
      <div className="inventory__header">
        <div>
          <h1 className="inventory__title">Inventory Assets</h1>
          <p className="inventory__subtitle">
            Real-time tracking of luxury sarees and artisanal jewelry stocks.
          </p>
        </div>
        <div className="inventory__header-actions">
          <button className="inventory__btn inventory__btn--outline">↓ Export CSV</button>
          <button
            className="inventory__btn inventory__btn--primary"
            onClick={() => navigate("/inventory/new")}
          >
            + Add New Product
          </button>
        </div>
      </div>

      <div className="inventory__tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`inventory__tab ${productsCollection === tab.key ? "inventory__tab--active" : ""}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="inventory__stats">
        <div className="inventory__stat-card">
          <span className="inventory__stat-icon">📋</span>
          <div>
            <p className="inventory__stat-label">Total Products</p>
            <p className="inventory__stat-value">{products?.length}</p>
          </div>
        </div>
        <div className="inventory__stat-card">
          <span className="inventory__stat-icon">✅</span>
          <div>
            <p className="inventory__stat-label">Active Products</p>
            <p className="inventory__stat-value">{activeCount}</p>
          </div>
        </div>
        <div className="inventory__stat-card">
          <span className="inventory__stat-icon">⭐</span>
          <div>
            <p className="inventory__stat-label">Featured</p>
            <p className="inventory__stat-value">{featuredCount}</p>
          </div>
        </div>
        <div className="inventory__stat-card">
          <span className="inventory__stat-icon">🏷️</span>
          <div>
            <p className="inventory__stat-label">Categories in Use</p>
            <p className="inventory__stat-value">{categoryCount}</p>
          </div>
        </div>
      </div>

      <div className="inventory__panel">
        <div className="inventory__panel-header">
          <button className="inventory__filters-btn">▽ Filters</button>
          <span className="inventory__panel-count">
            {productsLoading ? "Loading products..." : `Showing ${products?.length} products`}
          </span>
        </div>

        <div className="inventory__table-scroll">
          <table className="inventory__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Sub-Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!productsLoading && products?.length === 0 && (
                <tr>
                  <td colSpan={7} className="inventory__empty">
                    No products yet. Click "Add New Product" to create one.
                  </td>
                </tr>
              )}
              {products?.map((product) => (
                <tr key={product.id}>
                  <td>
                    <p className="inventory__name">
                      {product.name}
                      {product.isFeatured && <span className="inventory__flag">★ Featured</span>}
                      {product.isNewArrival && <span className="inventory__flag inventory__flag--new">New</span>}
                    </p>
                    <p className="inventory__sku">{product.desc || "—"}</p>
                  </td>
                  <td>
                    <span className="inventory__tag">{product.category?.category || product.category?.name || "Uncategorized"}</span>
                  </td>
                  <td>{product.subcategory?.name || "—"}</td>
                  <td>
                    ₹{Number(product.price || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    {product.offerPrice && (
                      <span className="inventory__offer-price">
                        ₹{Number(product.offerPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </td>
                  <td>{product.discount ? `${product.discount}%` : "—"}</td>
                  <td>
                    <span className={statusClass(product.status)}>{product.status}</span>
                  </td>
                  <td>
                    <div className="inventory__actions">
                      <button
                        className="inventory__icon-btn"
                        aria-label="View Details"
                        title="View Details"
                        onClick={() => navigate(`/inventory/view/${product.id}`)}
                      >
                        👁️
                      </button>
                      <button
                        className="inventory__icon-btn"
                        aria-label="Edit"
                        title="Edit Product"
                        onClick={() => navigate(`/inventory/edit/${product.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        className="inventory__icon-btn"
                        aria-label="Delete"
                        title="Delete Product"
                        onClick={() => handleDelete(product)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {pageProducts.totalPages > 1 && (
        <div className="inventory__pagination">
          <button
            className="inventory__page-btn"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            🠔
          </button>

          {(() => {
            const pages = [];

            // First page
            pages.push(1);

            // Left dots
            if (currentPage > 3) {
              pages.push("...");
            }

            // Previous page
            if (currentPage > 2) {
              pages.push(currentPage - 1);
            }

            // Current page
            if (currentPage !== 1 && currentPage !== pageProducts.totalPages) {
              pages.push(currentPage);
            }

            // Next page
            if (currentPage < pageProducts.totalPages - 1) {
              pages.push(currentPage + 1);
            }

            // Right dots
            if (currentPage < pageProducts.totalPages - 2) {
              pages.push("...");
            }

            // Last page
            if (pageProducts.totalPages > 1) {
              pages.push(pageProducts.totalPages);
            }

            return [...new Set(pages)].map((page, index) =>
              page === "..." ? (
                <span key={`dots-${index}`} className="inventory__dots">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`inventory__page-btn ${currentPage === page ? "inventory__page-btn--active" : ""
                    }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            );
          })()}

          <button
            className="inventory__page-btn"
            disabled={currentPage === pageProducts.totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            ➝
          </button>
        </div>
      )}
    </div>
  );
}

export default Inventory;
