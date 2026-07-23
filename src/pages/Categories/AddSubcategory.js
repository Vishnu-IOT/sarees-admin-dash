import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./AddSubcategory.css";

function AddSubcategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { categories, subcategories, addSubCategory, editSubCategory } = useData();
  const isEditMode = Boolean(id);

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const existing = subcategories.find((s) => String(s.id) === String(id));
      if (existing) {
        setName(existing.name || "");
        setCategoryId(existing.categoryId || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, subcategories]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !categoryId) {
      setError("Sub-category name and parent category are both required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const payload = { name: name.trim(), categoryId: Number(categoryId) };
      if (isEditMode) {
        await editSubCategory(id, payload);
      } else {
        await addSubCategory(payload);
      }
      navigate("/categories");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't save this sub-category. Make sure the API server is running."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-subcategory">
      <div className="add-subcategory__breadcrumb">
        <button className="add-subcategory__breadcrumb-link" onClick={() => navigate("/categories")}>
          Categories
        </button>
        <span> &gt; </span>
        <span className="add-subcategory__breadcrumb-current">
          {isEditMode ? "Edit Sub-category" : "Add Sub-category"}
        </span>
      </div>

      <div className="add-subcategory__header">
        <h1 className="add-subcategory__title">
          {isEditMode ? "Edit Sub-category" : "Add Sub-category"}
        </h1>
        <div className="add-subcategory__header-actions">
          <button
            className="add-subcategory__btn add-subcategory__btn--outline"
            onClick={() => navigate("/categories")}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-subcategory-form"
            className="add-subcategory__btn add-subcategory__btn--primary"
            disabled={saving}
          >
            {saving ? "Saving..." : isEditMode ? "Update Sub-category" : "Save Sub-category"}
          </button>
        </div>
      </div>

      {error && <div className="add-subcategory__error">{error}</div>}

      <form id="add-subcategory-form" className="add-subcategory__card" onSubmit={handleSave}>
        <label className="add-subcategory__label">Parent Category</label>
        <select
          className="add-subcategory__input"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select main category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.category} ({c.collection || "SAREE"})
            </option>
          ))}
        </select>

        <label className="add-subcategory__label">Sub-category Name</label>
        <input
          className="add-subcategory__input"
          placeholder="e.g., Kanchipuram"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </form>
    </div>
  );
}

export default AddSubcategory;
