import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already signed in? Skip the login screen.
  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await login(form.email, form.password);
      const token = res.token || res.accessToken || res.data?.token || res.success;
      if (token) {
        localStorage.setItem("authToken", token);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Couldn't sign in. Check your email/password and that the API server is running."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login__overlay" />
      <form className="login__card" onSubmit={handleSubmit}>
        <div className="login__logo">✂️</div>
        <h1 className="login__title">Saree &amp; Jewelry Admin</h1>
        <p className="login__subtitle">Warehouse Management Console</p>

        <div className="login__form-header">
          <h2 className="login__form-title">Sign In</h2>
          <p className="login__form-desc">Enter your credentials to access the dashboard</p>
        </div>

        {error && <div className="login__error">{error}</div>}

        <label className="login__label" htmlFor="email">
          Business Email
        </label>
        <div className="login__input-wrap">
          <input
            id="email"
            name="email"
            type="email"
            className="login__input"
            placeholder="admin@warehouse.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <span className="login__input-icon">✉️</span>
        </div>

        <div className="login__label-row">
          <label className="login__label" htmlFor="password">
            Password
          </label>
          <button type="button" className="login__forgot">
            Forgot?
          </button>
        </div>
        <div className="login__input-wrap">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            className="login__input"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="login__input-icon login__input-icon--btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label="Toggle password visibility"
          >
            👁️
          </button>
        </div>

        <label className="login__checkbox-row">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          Remember this device
        </label>

        <button type="submit" className="login__submit" disabled={submitting}>
          {submitting ? "Authenticating..." : "Authenticate"} <span aria-hidden="true">→</span>
        </button>

        <p className="login__support">
          Need technical assistance? <span className="login__support-link">Contact Support</span>
        </p>

        <div className="login__meta">
          <span>v2.4.0-STABLE</span>
          <span className="login__meta-dot">•</span>
          <span className="login__meta-status">SYSTEM_ONLINE</span>
        </div>
      </form>
    </div>
  );
}

export default Login;
