import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import * as productsApi from "../../api/productsApi";
import "./ProductDetail.css";

function ProductDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, removeProduct } = useData();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const found = products.find((p) => String(p.id) === String(id));
    if (found) {
      setProduct(found);
      setSelectedImage(found.image_url || (found.attributes && found.attributes[0]?.image_url) || "");
      setLoading(false);
    } else {
      // Fetch from API if not in context
      productsApi
        .getProducts()
        .then((res) => {
          const list = res.products || [];
          const item = list.find((p) => String(p.id) === String(id));
          if (item) {
            setProduct(item);
            setSelectedImage(item.image_url || (item.attributes && item.attributes[0]?.image_url) || "");
          }
        })
        .catch((err) => console.error("Error loading product detail:", err))
        .finally(() => setLoading(false));
    }
  }, [id, products]);

  const handleDelete = async () => {
    if (!product) return;
    if (!window.confirm(`Delete product "${product.name}"? This can't be undone.`)) return;
    try {
      await removeProduct(product.id);
      navigate("/inventory");
    } catch (err) {
      window.alert("Failed to delete product.");
    }
  };

  if (loading) {
    return <div className="product-detail__loading">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="product-detail__not-found">
        <h2>Product Not Found</h2>
        <p>Product #{id} could not be located in inventory.</p>
        <button className="product-detail__btn product-detail__btn--outline" onClick={() => navigate("/inventory")}>
          ← Back to Inventory
        </button>
      </div>
    );
  }

  const variants = product.attributes || [];
  const primaryImage = product.image_url || (variants[0] && variants[0].image_url) || "";
  const allImages = [
    ...(primaryImage ? [primaryImage] : []),
    ...variants.map((v) => v.image_url).filter((img) => img && img !== primaryImage),
  ];

  return (
    <div className="product-detail">
      <div className="product-detail__breadcrumb">
        <button className="product-detail__breadcrumb-link" onClick={() => navigate("/inventory")}>
          Inventory
        </button>
        <span> &gt; </span>
        <span className="product-detail__breadcrumb-current">Product #{product.id}</span>
      </div>

      <div className="product-detail__header">
        <div>
          <div className="product-detail__title-row">
            <h1 className="product-detail__title">{product.name}</h1>
            <span className={`product-detail__status product-detail__status--${(product.status || "active").toLowerCase()}`}>
              {product.status || "Active"}
            </span>
            <span className="product-detail__collection-badge">{product.collection || "SAREE"}</span>
          </div>
          <div className="product-detail__flags">
            {product.isFeatured && <span className="product-detail__flag product-detail__flag--featured">★ Featured</span>}
            {product.isNewArrival && <span className="product-detail__flag product-detail__flag--new">New Arrival</span>}
            {product.loom && <span className="product-detail__flag product-detail__flag--loom"> Direct from Loom</span>}
          </div>
        </div>

        <div className="product-detail__header-actions">
          <button className="product-detail__btn product-detail__btn--outline" onClick={() => navigate("/inventory")}>
            ← Back
          </button>
          <button
            className="product-detail__btn product-detail__btn--primary"
            onClick={() => navigate(`/inventory/edit/${product.id}`)}
          >
            ✏️ Edit Product
          </button>
          <button className="product-detail__btn product-detail__btn--danger" onClick={handleDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="product-detail__grid">
        {/* Left Column: Visuals & Gallery */}
        <div className="product-detail__col-gallery">
          <div className="product-detail__card product-detail__gallery-card">
            <div className="product-detail__main-image-wrap">
              {selectedImage || primaryImage ? (
                <img
                  src={selectedImage || primaryImage}
                  alt={product.name}
                  className="product-detail__main-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="product-detail__no-image">🖼️ No Cover Image Uploaded</div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="product-detail__thumbnails">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`product-detail__thumb-btn ${selectedImage === img ? "product-detail__thumb-btn--active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Variant ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="product-detail__card" style={{ marginTop: "20px" }}>
            <h3 className="product-detail__card-title">Pricing Breakdown</h3>
            <div className="product-detail__price-row">
              <span className="product-detail__price-label">Regular Price</span>
              <span className="product-detail__price-val">₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
            </div>
            {product.offerPrice && (
              <div className="product-detail__price-row">
                <span className="product-detail__price-label">Offer / Sale Price</span>
                <span className="product-detail__price-val product-detail__price-val--offer">
                  ₹{Number(product.offerPrice).toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {product.discount > 0 && (
              <div className="product-detail__price-row">
                <span className="product-detail__price-label">Discount Percentage</span>
                <span className="product-detail__badge-discount">{product.discount}% OFF</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Info & Variants */}
        <div className="product-detail__col-info">
          <div className="product-detail__card">
            <h2 className="product-detail__card-title">Product Description</h2>
            <div className="product-detail__desc">{product.desc || "No description provided."}</div>
          </div>

          <div className="product-detail__card" style={{ marginTop: "20px" }}>
            <h2 className="product-detail__card-title">Classification & Metadata</h2>
            <div className="product-detail__meta-grid">
              <div>
                <span className="product-detail__meta-label">Category</span>
                <p className="product-detail__meta-val">{product.category?.name || product.category?.category || "Uncategorized"}</p>
              </div>
              <div>
                <span className="product-detail__meta-label">Sub-Category</span>
                <p className="product-detail__meta-val">{product.subcategory?.name || "—"}</p>
              </div>
              <div>
                <span className="product-detail__meta-label">Collection</span>
                <p className="product-detail__meta-val">{product.collection || "SAREE"}</p>
              </div>
              <div>
                <span className="product-detail__meta-label">URL Slug</span>
                <p className="product-detail__meta-val">{product.slug || `product-${product.id}`}</p>
              </div>
            </div>
          </div>

          <div className="product-detail__card" style={{ marginTop: "20px" }}>
            <h2 className="product-detail__card-title">Product Variants & Specifications ({variants.length})</h2>

            {variants.length === 0 ? (
              <p className="product-detail__empty-variants">No variant attributes recorded for this product.</p>
            ) : (
              <div className="product-detail__table-scroll">
                <table className="product-detail__table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>SKU</th>
                      <th>Color</th>
                      <th>Fabric / Material</th>
                      <th>Work / Details</th>
                      <th>Size / Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant, idx) => (
                      <tr key={variant.id || idx}>
                        <td>
                          {variant.image_url ? (
                            <img src={variant.image_url} alt="Variant" className="product-detail__variant-img" />
                          ) : (
                            <span style={{ color: "#aaa" }}>—</span>
                          )}
                        </td>
                        <td><strong>{variant.sku || "—"}</strong></td>
                        <td>{variant.color || "—"}</td>
                        <td>{variant.fabric || variant.metal || "—"}</td>
                        <td>{variant.work || variant.stone || variant.occasion || "—"}</td>
                        <td>{variant.size || variant.weight || variant.purity || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
