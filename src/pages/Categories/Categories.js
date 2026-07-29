import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./Categories.css";

function Categories() {
  const navigate = useNavigate();
  const {
    categories,
    categoriesLoading,
    subcategories,
    removeCategory,
    removeSubCategory,
  } = useData();

  const handleDeleteCategory = async (category) => {
    const name = category.name || category.category;
    if (!window.confirm(`Delete category "${name}"? This can't be undone.`)) return;
    try {
      await removeCategory(category.id);
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't delete this category.");
    }
  };

  const handleDeleteSubcategory = async (sub) => {
    if (!window.confirm(`Delete sub-category "${sub.name}"? This can't be undone.`)) return;
    try {
      await removeSubCategory(sub.id);
    } catch (err) {
      window.alert(err.response?.data?.message || "Couldn't delete this sub-category.");
    }
  };

  return (
    <div className="categories">
      <div className="categories__header">
        <div>
          <h1 className="categories__title">Category Management</h1>
          <p className="categories__subtitle">
            Create a main category first (SAREE or JEWEL collection), then add sub-categories under it.
          </p>
        </div>
        <div className="categories__header-actions">
          <button
            className="categories__btn categories__btn--primary"
            onClick={() => navigate("/categories/new")}
          >
            + New Category
          </button>
        </div>
      </div>
      <div className="categories__summary">
        <div className="categories__summary-card">
          <span className="categories__summary-label">Total Categories</span>
          <span className="categories__summary-value">{categories.length}</span>
        </div>
        <div className="categories__summary-card">
          <span className="categories__summary-label">Total Sub-Categories</span>
          <span className="categories__summary-value">{subcategories.length}</span>
        </div>
      </div>

      {categoriesLoading && <p className="categories__loading">Loading categories...</p>}

      {!categoriesLoading && categories.length === 0 && (
        <div className="categories__empty">
          No categories yet. Create your first main category to get started.
        </div>
      )}
      {/* Cateory Collection for SAREE */}
      <h1 className="categories__title" style={{ marginTop: 15 }}>Saree Collection</h1>
      <div className="categories__grid">
        {categories
          .filter((category) => category.collection === "SAREE")
          .map((category) => {
            const name = category.name || category.category;
            const subs = subcategories.filter(
              (s) => String(s.categoryId) === String(category.id)
            );
            return (
              <div className="categories__card" key={category.id}>
                <div className="categories__card-image">🏷️</div>
                <div className="categories__card-body">
                  <div className="categories__card-top">
                    <div>
                      {/* <span className="categories__collection-badge">{collection}</span> */}
                      <h2 className="categories__card-title">{name}</h2>
                    </div>
                    <button
                      className="categories__tag-edit"
                      onClick={() => navigate(`/categories/categories/edit/${category.id}`)}
                      aria-label="Edit category"
                    >
                      ✏️
                    </button>
                    <button
                      className="categories__icon-btn"
                      onClick={() => handleDeleteCategory(category)}
                      aria-label="Delete category"
                    >
                      🗑️
                    </button>
                  </div>

                  <div className="categories__tags">
                    {subs.map((sub) => (
                      <span className="categories__tag" key={sub.id}>
                        {sub.name}
                        <button
                          className="categories__tag-edit"
                          onClick={() => navigate(`/categories/subcategories/edit/${sub.id}`)}
                          aria-label="Edit sub-category"
                        >
                          ✏️
                        </button>
                        <button
                          className="categories__tag-remove"
                          onClick={() => handleDeleteSubcategory(sub)}
                          aria-label="Remove sub-category"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      className="categories__add-sub"
                      onClick={() => navigate(`/categories/subcategories/new?categoryId=${category.id}`)}
                    >
                      + Add Sub
                    </button>
                  </div>

                  <div className="categories__card-footer">
                    <span>
                      Sub-categories: <strong>{subs.length}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Cateory Collection for JEWEL */}
      <h1 className="categories__title" style={{ marginTop: 15 }}>Jewellery Collection</h1>
      <div className="categories__grid">
        {categories
          .filter((category) => category.collection === "JEWEL")
          .map((category) => {
            const name = category.name || category.category;
            const subs = subcategories.filter(
              (s) => String(s.categoryId) === String(category.id)
            );
            return (
              <div className="categories__card" key={category.id}>
                <div className="categories__card-image">🏷️</div>
                <div className="categories__card-body">
                  <div className="categories__card-top">
                    <div>
                      {/* <span className="categories__collection-badge">{collection}</span> */}
                      <h2 className="categories__card-title">{name}</h2>
                    </div>
                    <div className="categories__card-actions">
                      <button
                        className="categories__tag-edit"
                        onClick={() => navigate(`/categories/categories/edit/${category.id}`)}
                        aria-label="Edit category"
                      >
                        ✏️
                      </button>
                      <button
                        className="categories__icon-btn"
                        onClick={() => handleDeleteCategory(category)}
                        aria-label="Delete category"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="categories__tags">
                    {subs.map((sub) => (
                      <span className="categories__tag" key={sub.id}>
                        {sub.name}
                        <button
                          className="categories__tag-edit"
                          onClick={() => navigate(`/categories/subcategories/edit/${sub.id}`)}
                          aria-label="Edit sub-category"
                        >
                          ✏️
                        </button>
                        <button
                          className="categories__tag-remove"
                          onClick={() => handleDeleteSubcategory(sub)}
                          aria-label="Remove sub-category"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    <button
                      className="categories__add-sub"
                      onClick={() => navigate(`/categories/subcategories/new?categoryId=${category.id}`)}
                    >
                      + Add Sub
                    </button>
                  </div>

                  <div className="categories__card-footer">
                    <span>
                      Sub-categories: <strong>{subs.length}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Categories;
