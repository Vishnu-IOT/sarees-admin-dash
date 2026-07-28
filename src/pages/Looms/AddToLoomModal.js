import React, { useEffect, useState } from "react";
import * as productsApi from "../../api/productsApi";
import { useData } from "../../context/DataContext";

// Lets an admin pick from EXISTING products and tag them as "Direct from Loom"
// without creating a new product or touching any of the product's other data.
function AddToLoomModal({ onClose }) {
  const { addToLoom } = useData();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCandidates() {
      setLoading(true);
      try {
        // Pull a large page from every collection so the picker isn't
        // limited to whatever page Inventory happens to be on.
        const [sarees, jewels] = await Promise.all([
          productsApi.getSarees(1, 200),
          productsApi.getJewels(1, 200),
        ]);
        const all = [...(sarees.products || []), ...(jewels.products || [])];
        if (!cancelled) {
          setCandidates(all.filter((p) => !p.loom));
        }
      } catch (err) {
        console.error("Failed to load products for loom picker", err);
        if (!cancelled) setCandidates([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCandidates();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = candidates.filter((p) =>
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (product) => {
    setAddingId(product.id);
    try {
      await addToLoom(product.id);
      setCandidates((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      window.alert(
        err.response?.data?.message || "Couldn't add this product to Loom. Please try again."
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="loom-modal__overlay" onClick={onClose}>
      <div className="loom-modal" onClick={(e) => e.stopPropagation()}>
        <div className="loom-modal__header">
          <div>
            <h2 className="loom-modal__title">Add to Loom</h2>
            <p className="loom-modal__subtitle">
              Tag an existing Saree or Jewel product as "Direct from Loom".
            </p>
          </div>
          <button className="loom-modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <input
          className="loom-modal__search"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="loom-modal__body">
          {loading && <p className="loom-modal__empty">Loading products...</p>}

          {!loading && filtered.length === 0 && (
            <p className="loom-modal__empty">
              {candidates.length === 0
                ? "Every product is already tagged for Loom."
                : "No products match your search."}
            </p>
          )}

          {!loading &&
            filtered.map((product) => (
              <div className="loom-modal__row" key={product.id}>
                <div>
                  <p className="loom-modal__row-name">{product.name}</p>
                  <p className="loom-modal__row-meta">
                    {product.collection === "JEWEL" ? "Jewel" : "Saree"} · ₹
                    {Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
                <button
                  className="loom-modal__add-btn"
                  disabled={addingId === product.id}
                  onClick={() => handleAdd(product)}
                >
                  {addingId === product.id ? "Adding..." : "+ Add to Loom"}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AddToLoomModal;
