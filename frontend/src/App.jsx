
import { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

const api = axios.create({
  baseURL: "",
  headers: { "Content-Type": "application/json" },
});

const emptyForm = {
  planName: "",
  monthlyCost: "",
  maxUsers: "",
  active: true,
};

function getErrorMessage(error) {
  if (error.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") return data;
    return data.message || data.error || "Request failed.";
  }

  if (error.request) {
    return "Cannot connect to the backend. Check that the backend is running.";
  }

  return error.message || "Something went wrong.";
}

function currency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

export default function App() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState("home");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");

  async function loadPlans() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/DisplayAllplans");
      const data = response.data;

      if (Array.isArray(data)) {
        setPlans(data);
      } else if (Array.isArray(data?.data)) {
        setPlans(data.data);
      } else {
        setPlans([]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
  }, []);

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm({ ...emptyForm });
    setEditingId(null);
  }

  function dismissMessages() {
    setError("");
    setSuccess("");
  }

  function goToPage(page) {
    dismissMessages();
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleAddClick() {
    resetForm();
    dismissMessages();
    setCurrentPage("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleViewClick() {
    dismissMessages();
    setCurrentPage("view");
    await loadPlans();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    dismissMessages();

    const planName = form.planName.trim();
    const monthlyCost = Number(form.monthlyCost);
    const maxUsers = Number(form.maxUsers);

    if (!planName) {
      setError("Please enter a plan name.");
      return;
    }

    if (
      form.monthlyCost === "" ||
      !Number.isFinite(monthlyCost) ||
      monthlyCost < 0
    ) {
      setError("Enter a valid monthly cost of zero or more.");
      return;
    }

    if (
      form.maxUsers === "" ||
      !Number.isInteger(maxUsers) ||
      maxUsers < 1
    ) {
      setError("Maximum users must be a positive whole number.");
      return;
    }

    const payload = {
      planName,
      monthlyCost,
      maxUsers,
      active: Boolean(form.active),
    };

    setSaving(true);

    try {
      if (editingId !== null) {
        await api.put(
          `/Update%20plan/${encodeURIComponent(editingId)}`,
          payload
        );

        setSuccess("Subscription plan updated successfully.");
      } else {
        await api.post("/Addplan", payload);
        setSuccess("Subscription plan added successfully.");
      }

      resetForm();
      setCurrentPage("view");
      await loadPlans();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function startEdit(plan) {
    setEditingId(plan.id);

    setForm({
      planName: plan.planName ?? "",
      monthlyCost: String(plan.monthlyCost ?? ""),
      maxUsers: String(plan.maxUsers ?? ""),
      active: plan.active ?? false,
    });

    dismissMessages();
    setCurrentPage("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete subscription plan #${id}?`)) {
      return;
    }

    dismissMessages();
    setDeletingId(id);

    try {
      await api.delete(
        `/Delete%20plan/${encodeURIComponent(id)}`
      );

      setSuccess("Subscription plan deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await loadPlans();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  }

  const filteredPlans = plans.filter((plan) =>
    String(plan.planName ?? "")
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="portal-app">
      <header className="portal-navbar">
        <a
          href="#home"
          className="portal-brand"
          onClick={(event) => {
            event.preventDefault();
            goToPage("home");
          }}
        >
          Subscription Portal
        </a>

        <nav className="portal-nav" aria-label="Main navigation">
          <a
            href="#home"
            className={currentPage === "home" ? "portal-nav-active" : ""}
            onClick={(event) => {
              event.preventDefault();
              goToPage("home");
            }}
          >
            Home
          </a>

          <a
            href="#add"
            className={currentPage === "add" ? "portal-nav-active" : ""}
            onClick={(event) => {
              event.preventDefault();
              handleAddClick();
            }}
          >
            Add Plan
          </a>

          <a
            href="#view"
            className={currentPage === "view" ? "portal-nav-active" : ""}
            onClick={(event) => {
              event.preventDefault();
              handleViewClick();
            }}
          >
            View Plans
          </a>
        </nav>
      </header>

      <main className="portal-main">
        {error && (
          <div className="portal-alert portal-error" role="alert">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="portal-alert portal-success" role="status">
            <span>{success}</span>
            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* HOME PAGE */}
        {currentPage === "home" && (
          <section className="portal-hero">
            <p className="portal-eyebrow">
              SUBSCRIPTION SERVICE CENTER
            </p>

            <h1>Subscription Plan Management System</h1>

            <p className="portal-description">
              Manage subscription plans, pricing, and user limits in one place.
            </p>

            <div className="portal-hero-actions">
              <button
                type="button"
                className="portal-primary-button"
                onClick={handleAddClick}
              >
                Add Subscription Plan
              </button>

              <button
                type="button"
                className="portal-secondary-button"
                onClick={handleViewClick}
              >
                View Plans
              </button>
            </div>
          </section>
        )}

        {/* ADD / EDIT PAGE */}
        {currentPage === "add" && (
          <section className="portal-content-card portal-page-card">
            <div className="portal-section-heading">
              <div>
                <p className="portal-page-eyebrow">
                  {editingId !== null ? "UPDATE PLAN" : "NEW SUBSCRIPTION"}
                </p>

                <h1>
                  {editingId !== null
                    ? "Edit Subscription Plan"
                    : "Add Subscription Plan"}
                </h1>

                <p>
                  {editingId !== null
                    ? `Update the details for plan #${editingId}.`
                    : "Enter the details to create a subscription plan."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="portal-form-grid">
                <div className="portal-field">
                  <label htmlFor="planName">Plan Name *</label>
                  <input
                    id="planName"
                    name="planName"
                    className="form-control"
                    placeholder="e.g. Basic"
                    value={form.planName}
                    onChange={updateField}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="portal-field">
                  <label htmlFor="monthlyCost">Monthly Cost (₹) *</label>
                  <input
                    id="monthlyCost"
                    name="monthlyCost"
                    className="form-control"
                    type="number"
                    placeholder="e.g. 499"
                    min="0"
                    step="0.01"
                    value={form.monthlyCost}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="portal-field">
                  <label htmlFor="maxUsers">Maximum Users *</label>
                  <input
                    id="maxUsers"
                    name="maxUsers"
                    className="form-control"
                    type="number"
                    placeholder="e.g. 5"
                    min="1"
                    step="1"
                    value={form.maxUsers}
                    onChange={updateField}
                    required
                  />
                </div>

                <label
                  className="portal-active-toggle"
                  htmlFor="active"
                >
                  <input
                    id="active"
                    name="active"
                    type="checkbox"
                    checked={Boolean(form.active)}
                    onChange={updateField}
                  />

                  <span>
                    <strong>Active plan</strong>
                    <small>Make this plan available</small>
                  </span>
                </label>
              </div>

              <div className="portal-form-actions">
                <button
                  type="button"
                  className="portal-secondary-button"
                  onClick={() => {
                    resetForm();
                    goToPage("home");
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="portal-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save Changes"
                      : "Add Subscription Plan"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* VIEW PLANS PAGE */}
        {currentPage === "view" && (
          <section className="portal-content-card portal-page-card">
            <div className="portal-plans-heading">
              <div>
                <p className="portal-page-eyebrow">YOUR SUBSCRIPTIONS</p>
                <h1>View Subscription Plans</h1>
                <p>Search, edit, and manage your existing plans.</p>
              </div>

              <input
                className="portal-search"
                aria-label="Search plans"
                placeholder="Search plans..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {loading ? (
              <p className="portal-state">
                Loading subscription plans...
              </p>
            ) : filteredPlans.length === 0 ? (
              <div className="portal-state">
                <h3>
                  {search ? "No matching plans" : "No plans available"}
                </h3>
                <p>
                  {search
                    ? "Try a different search term."
                    : "Add your first subscription plan to see it here."}
                </p>
                {search && (
                  <button
                    type="button"
                    className="portal-secondary-button"
                    onClick={() => setSearch("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="table-responsive">
                <table className="portal-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Plan Name</th>
                      <th>Monthly Cost</th>
                      <th>Maximum Users</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td>#{plan.id}</td>
                        <td>{plan.planName}</td>
                        <td>{currency(plan.monthlyCost)}</td>
                        <td>{plan.maxUsers ?? "—"}</td>

                        <td>
                          <span
                            className={
                              plan.active === true
                                ? "portal-status-active"
                                : "portal-status-inactive"
                            }
                          >
                            {plan.active === true ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td>
                          <div className="portal-row-actions">
                            <button
                              type="button"
                              className="portal-edit-button"
                              onClick={() => startEdit(plan)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="portal-delete-button"
                              onClick={() => handleDelete(plan.id)}
                              disabled={deletingId === plan.id}
                            >
                              {deletingId === plan.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="portal-table-footer">
              <span>
                Showing {filteredPlans.length} of {plans.length} plans
              </span>

              <button
                type="button"
                className="portal-refresh-button"
                onClick={loadPlans}
                disabled={loading}
              >
                Refresh Plans
              </button>
            </div>
          </section>
        )}

        <footer className="portal-footer">
          Subscription Portal · Subscription Plan Management System
        </footer>
      </main>
    </div>
  );
}
