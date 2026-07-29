import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./AddCategory.css";

function AddCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { categories, addCategory, editCategory } = useData();

  const [name, setName] = useState("");
  const [collection, setCollection] = useState("SAREE");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const existing = categories.find(
        (category) => String(category.id) === String(id)
      );

      if (existing) {
        setName(existing.name || "");
        setCollection(existing.collection || "SAREE");
      }
    }
  }, [id, categories, isEditMode]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        collection,
      };

      if (isEditMode) {
        await editCategory(id, payload);
      } else {
        await addCategory(payload);
      }

      navigate("/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Couldn't save this category. Make sure the API server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-category">
      <div className="add-category__breadcrumb">
        <button className="add-category__breadcrumb-link" onClick={() => navigate("/dashboard")}>
          Dashboard
        </button>
        <span> / </span>
        <button className="add-category__breadcrumb-link" onClick={() => navigate("/categories")}>
          Categories
        </button>
        <span> / </span>
        <span className="add-category__breadcrumb-current">
          {isEditMode ? "Edit Category" : "Create New"}
        </span>
      </div>

      <div className="add-category__header">
        <h1 className="add-category__title">
          {isEditMode ? "Edit Category" : "Create New Category"}
        </h1>
        <div className="add-category__header-actions">
          <button
            type="button"
            className="add-category__btn add-category__btn--outline"
            onClick={() => navigate("/categories")}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-category-form"
            className="add-category__btn add-category__btn--primary"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Category"
                : "Save Category"}
          </button>
        </div>
      </div>

      {error && <div className="add-category__error">{error}</div>}

      <form id="add-category-form" className="add-category__grid" onSubmit={handleSave}>
        <div className="add-category__col">
          <section className="add-category__card">
            <h2 className="add-category__card-title">Category Metadata</h2>

            <label className="add-category__label">Collection</label>
            <select
              className="add-category__input"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              required
            >
              <option value="SAREE">SAREE Collection</option>
              <option value="JEWEL">JEWEL Collection</option>
            </select>

            <label className="add-category__label" style={{ marginTop: "16px" }}>
              Category Name
            </label>
            <input
              className="add-category__input"
              placeholder="e.g., Banarasi Sarees or Diamond Necklaces"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="add-category__hint">
              Use a unique name for identification in the warehouse ledger.
            </p>
          </section>

          <div className="add-category__note-mobile">
            Once this category is saved, you can add sub-categories under it from the Categories
            page.
          </div>
        </div>

        {/* <div className="add-category__col">
          <section className="add-category__card">
            <h2 className="add-category__card-title">Category Visuals</h2>
            <label className="add-category__upload">
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              <span className="add-category__upload-icon">📄</span>
              <span className="add-category__upload-text">
                {imageName || "Upload Cover Image"}
              </span>
              <span className="add-category__upload-hint">
                Recommended: 600x800px JPG or PNG. High contrast preferred.
              </span>
            </label>
          </section>

          <div className="add-category__notice">
            <p className="add-category__notice-title">
              <span className="add-category__notice-icon">ⓘ</span> Data Governance Note
            </p>
            <p className="add-category__notice-text">
              Sub-categories can only be created after this main category has been saved.
              Adding a new category will trigger a re-indexing of the warehouse inventory search.
            </p>
            <div className="add-category__notice-footer">
              <span>STATUS</span>
              <span className="add-category__status-pill">DRAFT</span>
            </div>
          </div>
        </div> */}
      </form>
    </div>
  );
}

export default AddCategory;
