import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import "./AddLoom.css";

function AddLoom() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { looms, addLoom, editLoom } = useData();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    loomId: "",
    model: "",
    location: "",
    specsText: "",
    status: true,
  });

  useEffect(() => {
    if (isEditMode) {
      const existing = looms.find((l) => l.id === id);
      if (existing) {
        setForm({
          loomId: existing.id,
          model: existing.model || "",
          location: existing.location || "",
          specsText: (existing.specs || []).join(", "),
          status: Boolean(existing.status),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      model: form.model,
      location: form.location,
      specs: form.specsText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
    };

    if (isEditMode) {
      editLoom(id, payload);
    } else {
      addLoom({ id: form.loomId || undefined, ...payload });
    }
    navigate("/looms");
  };

  return (
    <div className="add-loom">
      <div className="add-loom__breadcrumb">
        <button className="add-loom__breadcrumb-link" onClick={() => navigate("/looms")}>
          Looms
        </button>
        <span> &gt; </span>
        <span className="add-loom__breadcrumb-current">{isEditMode ? "Edit Loom" : "Add Loom"}</span>
      </div>

      <div className="add-loom__header">
        <h1 className="add-loom__title">{isEditMode ? "Edit Loom" : "Add New Loom"}</h1>
        <div className="add-loom__header-actions">
          <button className="add-loom__btn add-loom__btn--outline" onClick={() => navigate("/looms")}>
            Cancel
          </button>
          <button type="submit" form="add-loom-form" className="add-loom__btn add-loom__btn--primary">
            {isEditMode ? "Update Loom" : "Save Loom"}
          </button>
        </div>
      </div>

      <form id="add-loom-form" className="add-loom__card" onSubmit={handleSave}>
        {!isEditMode && (
          <>
            <label className="add-loom__label">Loom ID</label>
            <input
              className="add-loom__input"
              name="loomId"
              placeholder="e.g. LM-2023-06 (leave blank to auto-generate)"
              value={form.loomId}
              onChange={handleChange}
            />
          </>
        )}

        <label className="add-loom__label">Model Name</label>
        <input
          className="add-loom__input"
          name="model"
          placeholder="e.g. Picanol Optimax-i"
          value={form.model}
          onChange={handleChange}
        />

        <label className="add-loom__label">Facility Location</label>
        <input
          className="add-loom__input"
          name="location"
          placeholder="e.g. Zone A - Floor 02"
          value={form.location}
          onChange={handleChange}
        />

        <label className="add-loom__label">Technical Specs</label>
        <input
          className="add-loom__input"
          name="specsText"
          placeholder="Comma separated, e.g. Air-Jet, Silk-Ready"
          value={form.specsText}
          onChange={handleChange}
        />
        <p className="add-loom__hint">Separate multiple specs with commas.</p>

        <label className="add-loom__checkbox-row">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          Loom is currently active
        </label>
      </form>
    </div>
  );
}

export default AddLoom;
