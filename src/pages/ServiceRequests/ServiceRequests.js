import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import {
  getServiceRequests,
  updateServiceRequestStatus,
  deleteServiceRequest,
} from "../../api/serviceRequestApi";
import "./ServiceRequests.css";

const REQUEST_TYPE_FILTERS = ["", "inquiry", "complaint", "return", "other"];
const STATUS_FILTERS = ["", "pending", "in_progress", "resolved", "rejected"];
const PRIORITY_FILTERS = ["", "low", "medium", "high"];

function ServiceRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Dialogs
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [statusDialog, setStatusDialog] = useState(null);
  const [statusFormData, setStatusFormData] = useState({
    status: "",
    priority: "",
    adminNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRequests(1);
  }, [statusFilter, typeFilter, priorityFilter]);

  const fetchRequests = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getServiceRequests({
        page,
        limit: 10,
        status: statusFilter || undefined,
        requestType: typeFilter || undefined,
      });

      setRequests(response.data || []);
      setMeta({
        currentPage: response.currentPage || 1,
        totalPages: response.totalPages || 1,
        total: response.total || 0,
      });
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusDialog || !statusFormData.status) {
      return;
    }

    try {
      setIsSubmitting(true);
      await updateServiceRequestStatus(statusDialog.id, {
        status: statusFormData.status,
        priority: statusFormData.priority || statusDialog.priority,
        adminNotes: statusFormData.adminNotes,
      });

      // Refresh the list
      fetchRequests(meta.currentPage);
      setStatusDialog(null);
      setStatusFormData({ status: "", priority: "", adminNotes: "" });
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update request status");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    try {
      setIsSubmitting(true);
      await deleteServiceRequest(deleteDialog.id);

      // Refresh the list
      fetchRequests(meta.currentPage);
      setDeleteDialog(null);
    } catch (error) {
      console.error("Error deleting request:", error);
      alert("Failed to delete request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openStatusDialog = (request) => {
    setStatusDialog(request);
    setStatusFormData({
      status: request.status || "pending",
      priority: request.priority || "",
      adminNotes: request.adminNotes || "",
    });
  };

  const handlePageChange = (page) => {
    fetchRequests(page);
  };

  const getStatusClass = (status) => {
    return `service-requests__status service-requests__status--${(status || "").toLowerCase()}`;
  };

  const getPriorityClass = (priority) => {
    return `service-requests__priority service-requests__priority--${(priority || "").toLowerCase()}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const inProgressCount = requests.filter((r) => r.status === "in_progress").length;
  const resolvedCount = requests.filter((r) => r.status === "resolved").length;

  return (
    <div className="service-requests">
      <div className="service-requests__header">
        <div>
          <h1 className="service-requests__title">Service Requests</h1>
          <p className="service-requests__subtitle">
            Manage customer service requests and support tickets
          </p>
        </div>
      </div>

      <div className="service-requests__stats">
        <div className="service-requests__stat-card">
          <span className="service-requests__stat-label">Total Requests</span>
          <span className="service-requests__stat-value">{meta.total}</span>
        </div>
        <div className="service-requests__stat-card">
          <span className="service-requests__stat-label">Pending</span>
          <span className="service-requests__stat-value service-requests__stat-value--warning">
            {pendingCount}
          </span>
        </div>
        <div className="service-requests__stat-card">
          <span className="service-requests__stat-label">In Progress</span>
          <span className="service-requests__stat-value service-requests__stat-value--info">
            {inProgressCount}
          </span>
        </div>
        <div className="service-requests__stat-card">
          <span className="service-requests__stat-label">Resolved</span>
          <span className="service-requests__stat-value service-requests__stat-value--success">
            {resolvedCount}
          </span>
        </div>
      </div>

      <div className="service-requests__panel">
        <div className="service-requests__filters">
          <select
            className="service-requests__filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_FILTERS.filter((s) => s).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            className="service-requests__filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            {REQUEST_TYPE_FILTERS.filter((t) => t).map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            className="service-requests__filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITY_FILTERS.filter((p) => p).map((priority) => (
              <option key={priority} value={priority}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </option>
            ))}
          </select>

          <span className="service-requests__filter-count">
            {loading ? "Loading..." : `${requests.length} of ${meta.total}`}
          </span>
        </div>

        <div className="service-requests__table-scroll">
          <table className="service-requests__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Date</th>
                <th>Order ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={9} className="service-requests__empty">
                    No service requests found.
                  </td>
                </tr>
              )}
              {requests.map((request) => (
                <tr key={request.id} className="service-requests__row">
                  <td className="service-requests__id">#{request.id}</td>
                  <td className="service-requests__name">{request.name}</td>
                  <td className="service-requests__email">{request.email}</td>
                  <td>
                    <span className="service-requests__type">
                      {request.requestType
                        ? request.requestType.charAt(0).toUpperCase() +
                          request.requestType.slice(1)
                        : "—"}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusClass(request.status)}>
                      {request.status
                        ? request.status.charAt(0).toUpperCase() +
                          request.status.slice(1).replace("_", " ")
                        : "Pending"}
                    </span>
                  </td>
                  <td>
                    {request.priority ? (
                      <span className={getPriorityClass(request.priority)}>
                        {request.priority.charAt(0).toUpperCase() +
                          request.priority.slice(1)}
                      </span>
                    ) : (
                      <span className="service-requests__priority service-requests__priority--none">
                        —
                      </span>
                    )}
                  </td>
                  <td>{formatDate(request.createdAt)}</td>
                  <td>
                    {request.orderId ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/orders/${request.orderId}`);
                        }}
                        className="service-requests__order-link"
                      >
                        #{request.order?.orderNumber || request.orderId}
                      </a>
                    ) : (
                      <span className="service-requests__no-order">—</span>
                    )}
                  </td>
                  <td>
                    <div className="service-requests__actions">
                      <button
                        className="service-requests__icon-btn"
                        title="View details"
                        onClick={() =>
                          navigate(`/service-requests/${request.id}`)
                        }
                      >
                        👁️
                      </button>
                      <button
                        className="service-requests__icon-btn"
                        title="Update status"
                        onClick={() => openStatusDialog(request)}
                      >
                        ✏️
                      </button>
                      <button
                        className="service-requests__icon-btn service-requests__icon-btn--danger"
                        title="Delete"
                        onClick={() => setDeleteDialog(request)}
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

        {meta.totalPages > 1 && (
          <div className="service-requests__pagination">
            <span>
              Page {meta.currentPage} of {meta.totalPages}
            </span>
            <div className="service-requests__pagination-controls">
              <button
                className="service-requests__page-btn"
                disabled={meta.currentPage === 1}
                onClick={() => handlePageChange(meta.currentPage - 1)}
              >
                Previous
              </button>
              <button
                className="service-requests__page-btn"
                disabled={meta.currentPage === meta.totalPages}
                onClick={() => handlePageChange(meta.currentPage + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Dialog */}
      <Dialog
        isOpen={!!statusDialog}
        title="Update Request Status"
        onCancel={() => setStatusDialog(null)}
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
              {STATUS_FILTERS.filter((s) => s).map((status) => (
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
              {PRIORITY_FILTERS.filter((p) => p).map((priority) => (
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!deleteDialog}
        title="Delete Service Request"
        message="Are you sure you want to delete this service request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setDeleteDialog(null)}
        onConfirm={handleDelete}
        isLoading={isSubmitting}
        isDangerous={true}
      />
    </div>
  );
}

export default ServiceRequests;
