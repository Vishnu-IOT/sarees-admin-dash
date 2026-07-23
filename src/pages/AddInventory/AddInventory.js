import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { getCategoriesByCollection } from "../../api/categoriesApi";
import "./AddInventory.css";

const COLLECTION_OPTIONS = [
  { value: "SAREE", label: "Saree" },
  { value: "JEWEL", label: "Jewellery" },
];

const STATUS_OPTIONS = ["active", "inactive"];

const EMPTY_FORM = {
  name: "",
  desc: "",
  status: "active",
  price: "",
  discount: "",
  offerPrice: "",
  collection: "SAREE",
  categoryId: "",
  subcategoryId: "",
  loom: false,
  isFeatured: false,
  isNewArrival: false,
};

const EMPTY_VARIANT = {
  sku: "",
  color: "",
  fabric: "",
  work: "",
  blouseLength: "",
  occasion: "",
  metal: "",
  purity: "",
  stone: "",
  weight: "",
  size: "",
  imageFile: null,
  image_url: "", // For edit mode display
};

function AddInventory() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { products, categories, subcategories, addProduct, editProduct } = useData();
  const isEditMode = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);
  const [variants, setVariants] = useState([{ ...EMPTY_VARIANT }]);
  const [expandedVariant, setExpandedVariant] = useState(0);
  const [collectionCategories, setCollectionCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch categories whenever collection changes
  const fetchCategoriesForCollection = useCallback(async (col) => {
    if (!col) return;
    setCategoriesLoading(true);
    try {
      const data = await getCategoriesByCollection(col);
      setCollectionCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories for collection:", err);
      setCollectionCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Initial load: fetch categories for default collection (SAREE)
  useEffect(() => {
    fetchCategoriesForCollection(form.collection || "SAREE");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isEditMode) {
      const existing = products.find((p) => String(p.id) === String(id));
      if (existing) {
        const existingCollection = existing.collection || "SAREE";
        setForm({
          name: existing.name || "",
          desc: existing.desc || "",
          status: existing.status || "active",
          price: existing.price || "",
          discount: existing.discount ?? "",
          offerPrice: existing.offerPrice ?? "",
          collection: existingCollection,
          categoryId: existing.categoryId ?? "",
          subcategoryId: existing.subcategoryId ?? "",
          loom: Boolean(existing.loom),
          isFeatured: Boolean(existing.isFeatured),
          isNewArrival: Boolean(existing.isNewArrival),
        });
        // Fetch categories for the product's collection
        fetchCategoriesForCollection(existingCollection);

        // Load variants/attributes
        if (existing.attributes && existing.attributes.length > 0) {
          setVariants(
            existing.attributes.map((attr) => ({
              sku: attr.sku || "",
              color: attr.color || "",
              fabric: attr.fabric || "",
              work: attr.work || "",
              blouseLength: attr.blouseLength || "",
              occasion: attr.occasion || "",
              metal: attr.metal || "",
              purity: attr.purity || "",
              stone: attr.stone || "",
              weight: attr.weight || "",
              size: attr.size || "",
              imageFile: null,
              image_url: attr.image_url || "",
            }))
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, products]);

  const filteredSubcategories = useMemo(
    () =>
      form.categoryId
        ? subcategories.filter((s) => String(s.categoryId) === String(form.categoryId))
        : subcategories,
    [subcategories, form.categoryId]
  );

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
      ...(name === "categoryId" ? { subcategoryId: "" } : {}),
      // When collection changes, reset category and subcategory
      ...(name === "collection" ? { categoryId: "", subcategoryId: "" } : {}),
    }));
    // If collection dropdown changed, re-fetch categories
    if (name === "collection" && value) {
      fetchCategoriesForCollection(value);
    }
  };

  const handleVariantChange = (index, fieldName, value) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [fieldName]: value,
    };
    setVariants(newVariants);
  };

  const handleVariantImageChange = (index, file) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      imageFile: file,
    };
    setVariants(newVariants);
  };

  const removeVariantImage = (index) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      imageFile: null,
    };
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { ...EMPTY_VARIANT }]);
    setExpandedVariant(variants.length);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      alert("You must have at least 1 variant!");
      return;
    }
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
    if (expandedVariant >= newVariants.length) {
      setExpandedVariant(newVariants.length - 1);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.price) {
      setError("Price is required");
      return;
    }
    if (!form.categoryId) {
      setError("Category is required");
      return;
    }
    if (variants.length === 0) {
      setError("At least one variant is required");
      return;
    }

    // Check if all variants have at least SKU or color
    const hasValidVariants = variants.every((v) => v.sku?.trim() || v.color?.trim());
    if (!hasValidVariants) {
      setError("Each variant must have at least SKU or Color");
      return;
    }

    // For create mode: check if at least one variant has an image
    if (!isEditMode) {
      const hasAtLeastOneImage = variants.some((v) => v.imageFile);
      if (!hasAtLeastOneImage) {
        setError("At least one variant must have an image uploaded");
        return;
      }
    } else {
      // For edit mode: every variant must end up with SOME image —
      // either a pre-existing image_url, or a newly picked imageFile.
      const hasImageCoverage = variants.every((v) => v.imageFile || v.image_url);
      if (!hasImageCoverage) {
        setError("Each variant must have an image (existing or newly uploaded)");
        return;
      }
    }

    setSaving(true);

    try {
      // Use the collection the user explicitly selected in the form
      const collection = form.collection || "SAREE";

      if (isEditMode) {
        const hasNewImages = variants.some((v) => v.imageFile);

        if (hasNewImages) {
          const formData = new FormData();

          formData.append("name", form.name);
          formData.append("desc", form.desc);
          formData.append("status", form.status);
          formData.append("price", form.price);
          formData.append("discount", form.discount || 0);
          formData.append("offerPrice", form.offerPrice || "");
          formData.append("categoryId", form.categoryId || "");
          formData.append("subcategoryId", form.subcategoryId || "");
          formData.append("collection", collection);
          formData.append("loom", form.loom);
          formData.append("isFeatured", form.isFeatured);
          formData.append("isNewArrival", form.isNewArrival);

          // Send variant data, including whether each one has a new image
          // (so the backend can match uploaded files to the right variant,
          // in order) and the existing image_url to keep for the rest.
          formData.append(
            "variants",
            JSON.stringify(
              variants.map((v) => ({
                sku: v.sku || null,
                color: v.color || null,
                fabric: v.fabric || null,
                work: v.work || null,
                blouseLength: v.blouseLength || null,
                occasion: v.occasion || null,
                metal: v.metal || null,
                purity: v.purity || null,
                stone: v.stone || null,
                weight: v.weight || null,
                size: v.size || null,
                image_url: v.image_url || null,
                hasNewImage: Boolean(v.imageFile),
              }))
            )
          );

          // Append new files in variant order (skip variants with no new file)
          variants.forEach((v) => {
            if (v.imageFile) {
              formData.append("variantImages", v.imageFile);
            }
          });

          await editProduct(id, formData);
        } else {
          // No image changes — keep the simple JSON payload path
          const payload = {
            name: form.name,
            desc: form.desc,
            status: form.status,
            price: form.price,
            discount: form.discount || 0,
            offerPrice: form.offerPrice || null,
            categoryId: form.categoryId || null,
            subcategoryId: form.subcategoryId || null,
            collection,
            loom: form.loom,
            isFeatured: form.isFeatured,
            isNewArrival: form.isNewArrival,
            variants: variants.map((v) => ({
              sku: v.sku || null,
              color: v.color || null,
              fabric: v.fabric || null,
              work: v.work || null,
              blouseLength: v.blouseLength || null,
              occasion: v.occasion || null,
              metal: v.metal || null,
              purity: v.purity || null,
              stone: v.stone || null,
              weight: v.weight || null,
              size: v.size || null,
              image_url: v.image_url || null,
            })),
          };

          await editProduct(id, payload);
        }
      } else {
        // Create product - use FormData for file uploads
        const formData = new FormData();

        // Append product fields
        formData.append("name", form.name);
        formData.append("desc", form.desc);
        formData.append("status", form.status);
        formData.append("price", form.price);
        formData.append("discount", form.discount || 0);
        formData.append("offerPrice", form.offerPrice || "");
        formData.append("categoryId", form.categoryId);
        formData.append("subcategoryId", form.subcategoryId || "");
        formData.append("collection", collection);
        formData.append("loom", form.loom);
        formData.append("isFeatured", form.isFeatured);
        formData.append("isNewArrival", form.isNewArrival);

        // ✅ Append variants as JSON string
        // hasImage tells the backend whether to expect a file for this
        // variant in req.files — since we only append files for variants
        // that actually have one, req.files ends up "dense" (no gaps), so
        // the backend needs this flag to line files back up correctly.
        formData.append(
          "variants",
          JSON.stringify(
            variants.map((v) => ({
              sku: v.sku || null,
              color: v.color || null,
              fabric: v.fabric || null,
              work: v.work || null,
              blouseLength: v.blouseLength || null,
              occasion: v.occasion || null,
              metal: v.metal || null,
              purity: v.purity || null,
              stone: v.stone || null,
              weight: v.weight || null,
              size: v.size || null,
              hasImage: Boolean(v.imageFile),
            }))
          )
        );

        // ✅ Append all variant images in correct order
        variants.forEach((variant) => {
          if (variant.imageFile) {
            formData.append("variantImages", variant.imageFile);
          }
        });

        await addProduct(formData);
      }

      navigate("/inventory");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Couldn't save this product. Make sure the API server is running and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setVariants([{ ...EMPTY_VARIANT }]);
    setExpandedVariant(0);
  };

  return (
    <div className="add-inventory">
      <div className="add-inventory__breadcrumb">
        <button className="add-inventory__breadcrumb-link" onClick={() => navigate("/inventory")}>
          Inventory
        </button>
        <span> &gt; </span>
        <span className="add-inventory__breadcrumb-current">
          {isEditMode ? "Edit Item" : "Add New Item"}
        </span>
      </div>

      <div className="add-inventory__header">
        <h1 className="add-inventory__title">{isEditMode ? "Edit Product" : "New Product Entry"}</h1>
        <button className="add-inventory__discard" onClick={() => navigate("/inventory")}>
          ✕ Discard Draft
        </button>
      </div>

      {error && <div className="add-inventory__error">{error}</div>}

      <form className="add-inventory__grid" onSubmit={handleSave}>
        <div className="add-inventory__col">
          {/* GENERAL SPECIFICATIONS */}
          <section className="add-inventory__card">
            <h2 className="add-inventory__card-title">General Specifications</h2>

            <label className="add-inventory__label">Product Name *</label>
            <input
              className="add-inventory__input"
              name="name"
              placeholder="e.g. Pure Kanchipuram Silk Saree - Midnight Gold"
              value={form.name}
              onChange={handleChange}
              required
            />

            <div className="add-inventory__row">
              <div className="add-inventory__field">
                <label className="add-inventory__label">Status</label>
                <select className="add-inventory__input" name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-inventory__field">
                <label className="add-inventory__label">Collection *</label>
                <select
                  className="add-inventory__input add-inventory__input--collection"
                  name="collection"
                  value={form.collection}
                  onChange={handleChange}
                  required
                >
                  {COLLECTION_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="add-inventory__row">
              <div className="add-inventory__field">
                <label className="add-inventory__label">Category *</label>
                <select
                  className="add-inventory__input"
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : collectionCategories.length === 0
                      ? `No categories for ${form.collection}`
                      : "Select Category"}
                  </option>
                  {collectionCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name || c.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="add-inventory__field">
                <label className="add-inventory__label">Sub-Category</label>
                <select
                  className="add-inventory__input"
                  name="subcategoryId"
                  value={form.subcategoryId}
                  onChange={handleChange}
                  disabled={!form.categoryId}
                >
                  <option value="">
                    {!form.categoryId ? "Select a category first" : "Select Sub-category"}
                  </option>
                  {filteredSubcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name || s.subcategory}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* PRODUCT DESCRIPTION */}
          <section className="add-inventory__card">
            <h2 className="add-inventory__card-title">Product Description</h2>
            <label className="add-inventory__label">Description</label>
            <textarea
              className="add-inventory__textarea"
              name="desc"
              placeholder="Enter detailed product description, material composition, and care instructions..."
              value={form.desc}
              onChange={handleChange}
            />
          </section>

          {/* COLOR VARIANTS */}
          <section className="add-inventory__card">
            <div className="add-inventory__card-header">
              <h2 className="add-inventory__card-title">Color Variants & SKUs</h2>
              <span className="add-inventory__variant-count">
                {variants.length} variant{variants.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="add-inventory__variants-list">
              {variants.map((variant, index) => (
                <div key={index} className="add-inventory__variant-item">
                  <div
                    className="add-inventory__variant-header"
                    onClick={() => setExpandedVariant(expandedVariant === index ? -1 : index)}
                  >
                    <div className="add-inventory__variant-summary">
                      <span className="add-inventory__variant-number">Variant {index + 1}</span>
                      <span className="add-inventory__variant-info">
                        {variant.color && `🎨 ${variant.color}`}
                        {variant.sku && ` • SKU: ${variant.sku}`}
                        {variant.imageFile && ` • 📷 ${variant.imageFile.name}`}
                        {!variant.imageFile && isEditMode && variant.image_url && ` • 📷 Image`}
                        {!variant.color && !variant.sku && <em>No details added</em>}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="add-inventory__variant-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeVariant(index);
                      }}
                      title="Remove variant"
                    >
                      🗑️
                    </button>
                  </div>

                  {expandedVariant === index && (
                    <div className="add-inventory__variant-body">
                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">SKU *</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. SKU-001-RED"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                          />
                        </div>
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Color *</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Midnight Red, Gold"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(index, "color", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Fabric</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Pure Silk"
                            value={variant.fabric}
                            onChange={(e) => handleVariantChange(index, "fabric", e.target.value)}
                          />
                        </div>
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Work / Weave</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Jacquard, Zari"
                            value={variant.work}
                            onChange={(e) => handleVariantChange(index, "work", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Size</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. M, L, One Size"
                            value={variant.size}
                            onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                          />
                        </div>
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Weight</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. 500g, 1.2kg"
                            value={variant.weight}
                            onChange={(e) => handleVariantChange(index, "weight", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Blouse Length</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. 30cm"
                            value={variant.blouseLength}
                            onChange={(e) => handleVariantChange(index, "blouseLength", e.target.value)}
                          />
                        </div>
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Occasion</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Wedding, Casual"
                            value={variant.occasion}
                            onChange={(e) => handleVariantChange(index, "occasion", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Metal Type</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Gold, Silver"
                            value={variant.metal}
                            onChange={(e) => handleVariantChange(index, "metal", e.target.value)}
                          />
                        </div>
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Purity</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. 22K, 18K"
                            value={variant.purity}
                            onChange={(e) => handleVariantChange(index, "purity", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="add-inventory__row">
                        <div className="add-inventory__field">
                          <label className="add-inventory__label">Stone/Gemstone</label>
                          <input
                            className="add-inventory__input"
                            placeholder="e.g. Diamond, Pearl"
                            value={variant.stone}
                            onChange={(e) => handleVariantChange(index, "stone", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* VARIANT IMAGE — works for both create and edit modes */}
                      <section className="add-inventory__card">
                        <h2 className="add-inventory__card-title">Variant Image</h2>

                        {/* Existing image from edit mode — shown only if no new file picked yet */}
                        {isEditMode && variant.image_url && !variant.imageFile && (
                          <div className="add-inventory__current-image">
                            <img
                              src={variant.image_url}
                              alt={`${variant.color || "Variant"}`}
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                              }}
                            />
                            <p className="add-inventory__helper-text">Current image</p>
                          </div>
                        )}

                        {/* Preview of newly selected file, in either mode */}
                        {variant.imageFile && (
                          <div className="add-inventory__current-image">
                            <img
                              src={URL.createObjectURL(variant.imageFile)}
                              alt="New upload preview"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                borderRadius: "8px",
                                marginBottom: "10px",
                              }}
                            />
                            <p className="add-inventory__helper-text">
                              New image selected —{" "}
                              <button
                                type="button"
                                className="add-inventory__link-btn"
                                onClick={() => removeVariantImage(index)}
                              >
                                undo
                              </button>
                            </p>
                          </div>
                        )}

                        <label className="add-inventory__upload">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVariantImageChange(index, e.target.files[0])}
                            hidden
                          />
                          <span className="add-inventory__upload-icon">📷</span>
                          <span className="add-inventory__upload-text">
                            {variant.imageFile
                              ? variant.imageFile.name
                              : isEditMode && variant.image_url
                                ? "Replace Variant Image"
                                : "Upload Variant Image"}
                          </span>
                        </label>
                        <p className="add-inventory__helper-text">
                          {isEditMode && variant.image_url && !variant.imageFile
                            ? "Upload a new image to replace the current one"
                            : "Upload a unique image for this variant"}
                        </p>
                      </section>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              className="add-inventory__btn add-inventory__btn--outline add-inventory__btn--full"
              onClick={addVariant}
            >
              + Add Another Color Variant
            </button>
          </section>

          {/* FORM ACTIONS */}
          <div className="add-inventory__form-actions">
            <button type="button" className="add-inventory__btn add-inventory__btn--outline" onClick={handleReset}>
              Reset Form
            </button>
            <button type="submit" className="add-inventory__btn add-inventory__btn--primary" disabled={saving}>
              💾 {saving ? "Saving..." : isEditMode ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="add-inventory__col">
          {/* PRICING & FLAGS */}
          <section className="add-inventory__card">
            <h2 className="add-inventory__card-title">Pricing &amp; Flags</h2>

            <div className="add-inventory__row">
              <div className="add-inventory__field">
                <label className="add-inventory__label">Price (INR) *</label>
                <input
                  className="add-inventory__input"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="add-inventory__field">
                <label className="add-inventory__label">Discount (%)</label>
                <input
                  className="add-inventory__input"
                  name="discount"
                  type="number"
                  placeholder="0"
                  step="0.01"
                  value={form.discount}
                  onChange={handleChange}
                />
              </div>
            </div>

            <label className="add-inventory__label">Offer Price (INR)</label>
            <input
              className="add-inventory__input"
              name="offerPrice"
              type="number"
              placeholder="Optional"
              step="0.01"
              value={form.offerPrice}
              onChange={handleChange}
            />

            <div className="add-inventory__checkbox-group">
              <label className="add-inventory__checkbox-row">
                <input type="checkbox" name="loom" checked={form.loom} onChange={handleChange} />
                Loom-produced item
              </label>
              <label className="add-inventory__checkbox-row">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
                Mark as Featured
              </label>
              <label className="add-inventory__checkbox-row">
                <input type="checkbox" name="isNewArrival" checked={form.isNewArrival} onChange={handleChange} />
                Mark as New Arrival
              </label>
            </div>
          </section>

          {/* NOTICE */}
          <div className="add-inventory__notice">
            <span className="add-inventory__notice-icon">ⓘ</span>
            <div>
              <strong>Multiple Variants</strong>
              <p>
                Each color variant will have its own SKU, attributes, and image. All variants belong to the same
                product.
              </p>
            </div>
          </div>

          {/* LEGEND */}
          <div className="add-inventory__legend">
            <p>
              <span className="add-inventory__required-indicator">*</span> Required fields
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AddInventory;