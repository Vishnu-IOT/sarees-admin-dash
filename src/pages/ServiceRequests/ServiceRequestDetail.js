import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import {
  getServiceRequestById,
  updateServiceRequestStatus,
} from "../../api/serviceRequestApi";
import "./ServiceRequestDetail.css";

const STATUS_FILTERS = ["pending", "in_progress", "resolved", "rejected"];
const PRIORITY_FILTERS = ["low", "medium", "high"];

function ServiceRequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusFormData, setStatusFormData] = useState({
    status: "",
    priority: "",
    adminNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getServiceRequestById(id);
      setRequest(response.data || response);
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  const handleStatusUpdate = async () => {
    if (!statusFormData.status) return;

    try {
      setIsSubmitting(true);
      await updateServiceRequestStatus(id, {
        status: statusFormData.status,
        priority: statusFormData.priority,
        adminNotes: statusFormData.adminNotes,
      });

      // Refresh the request
      await fetchRequest();
      setStatusDialog(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update request status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusDialog = () => {
    if (!request) return;
    setStatusFormData({
      status: request.status || "pending",
      priority: request.priority || "",
      adminNotes: request.adminNotes || "",
    });
    setStatusDialog(true);
  };

  const getStatusBadgeClass = (status) => {
    return `detail__status-badge detail__status-badge--${(status || "").toLowerCase()}`;
  };

  const getPriorityBadgeClass = (priority) => {
    return `detail__priority-badge detail__priority-badge--${(priority || "").toLowerCase()}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="detail">
        <div className="detail__loading">Loading...</div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="detail">
        <div className="detail__error">Request not found</div>
      </div>
    );
  }

  return (
    <div className="detail">
      <div className="detail__header">
        <button className="detail__back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1 className="detail__title">Service Request #{request.id}</h1>
      </div>

      <div className="detail__grid">
        {/* Main Content */}
        <div className="detail__main">
          {/* Request Info */}
          <section className="detail__section">
            <h2 className="detail__section-title">Request Details</h2>
            <div className="detail__info-grid">
              <div className="detail__info-item">
                <span className="detail__label">Subject</span>
                <span className="detail__value">{request.subject || "—"}</span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Type</span>
                <span className="detail__value">
                  {request.requestType
                    ? request.requestType.charAt(0).toUpperCase() +
                    request.requestType.slice(1)
                    : "—"}
                </span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Status</span>
                <span className={getStatusBadgeClass(request.status)}>
                  {request.status
                    ? request.status.charAt(0).toUpperCase() +
                    request.status.slice(1).replace("_", " ")
                    : "Pending"}
                </span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Priority</span>
                {request.priority ? (
                  <span className={getPriorityBadgeClass(request.priority)}>
                    {request.priority.charAt(0).toUpperCase() +
                      request.priority.slice(1)}
                  </span>
                ) : (
                  <span className="detail__value">—</span>
                )}
              </div>
              <div className="detail__info-item full">
                <span className="detail__label">Message</span>
                <p className="detail__message">{request.message || "—"}</p>
              </div>
            </div>
          </section>

          {/* Customer Info */}
          <section className="detail__section">
            <h2 className="detail__section-title">Customer Information</h2>
            <div className="detail__info-grid">
              <div className="detail__info-item">
                <span className="detail__label">Name</span>
                <span className="detail__value">{request.name || "—"}</span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Email</span>
                <span className="detail__value">
                  <a href={`mailto:${request.email}`}>{request.email || "—"}</a>
                </span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Phone</span>
                <span className="detail__value">
                  {request.phone ? (
                    <a href={`tel:${request.phone}`}>{request.phone}</a>
                  ) : (
                    "—"
                  )}
                </span>
              </div>
              <div className="detail__info-item">
                <span className="detail__label">Submitted</span>
                <span className="detail__value">{formatDate(request.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Admin Notes */}
          {request.adminNotes && (
            <section className="detail__section">
              <h2 className="detail__section-title">Admin Notes</h2>
              <p className="detail__notes-content">{request.adminNotes}</p>
            </section>
          )}

          {/* Attachment */}
          {request.attachmentUrl && (
            <section className="detail__section">
              <h2 className="detail__section-title">Attachment</h2>
              <a
                href={request.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail__attachment-link"
              >
                📎 View Attachment
              </a>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail__sidebar">
          <div className="detail__card">
            <h3 className="detail__card-title">Order Information</h3>
            {request.order ? (
              <div className="detail__order-info">
                <div className="detail__order-item">
                  <span className="detail__order-label">Order Number</span>
                  <button
                    className="detail__order-number-btn"
                    onClick={() => navigate(`/orders/${request.order.id}`)}
                  >
                    {request.order.orderNumber || `ORD-${request.order.id}`}
                  </button>
                </div>
                <div className="detail__order-item">
                  <span className="detail__order-label">Status</span>
                  <span className="detail__order-status">{request.order.status || "Pending"}</span>
                </div>
                <div className="detail__order-item">
                  <span className="detail__order-label">Amount</span>
                  <span className="detail__order-amount">
                    ₹{Number(request.order.grandTotal || 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="detail__order-item">
                  <span className="detail__order-label">Date</span>
                  <span className="detail__order-date">{formatDate(request.order.createdAt)}</span>
                </div>
              </div>
            ) : (
              <p className="detail__no-order">No order associated</p>
            )}
          </div>

          <div className="detail__card">
            <button
              className="detail__action-btn"
              onClick={openStatusDialog}
            >
              ✏️ Update Status
            </button>
            <button
              className="detail__action-btn detail__action-btn--secondary"
              onClick={() => navigate("/service-requests")}
            >
              ← Back to List
            </button>
          </div>
        </aside>
      </div>

      {/* Status Update Dialog */}
      <Dialog
        isOpen={statusDialog}
        title="Update Request Status"
        onCancel={() => setStatusDialog(false)}
        onConfirm={handleStatusUpdate}
        confirmText="Update"
        isLoading={isSubmitting}
      >
        <div className="service-requests__dialog-content">
          <div className="dialog__form-group">
            <label className="dialog__label">Status</label>
            <select
              className="dialog__select"
              value={statusFormData.status}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  status: e.target.value,
                })
              }
              disabled={isSubmitting}
            >
              <option value="">Select Status</option>
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="dialog__form-group">
            <label className="dialog__label">Priority</label>
            <select
              className="dialog__select"
              value={statusFormData.priority}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  priority: e.target.value,
                })
              }
              disabled={isSubmitting}
            >
              <option value="">No Priority</option>
              {PRIORITY_FILTERS.map((priority) => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="dialog__form-group">
            <label className="dialog__label">Admin Notes</label>
            <textarea
              className="dialog__textarea"
              placeholder="Add internal notes about this request..."
              value={statusFormData.adminNotes}
              onChange={(e) =>
                setStatusFormData({
                  ...statusFormData,
                  adminNotes: e.target.value,
                })
              }
              disabled={isSubmitting}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default ServiceRequestDetail;
