import React, { useState } from "react";
import "../LoginPage.css";
import { apiRequest } from "../../api";
import { useAppContext } from "../../context/AppContext";

const normalizeIndianPhone10 = (raw) => {
  if (!raw) return "";
  let value = String(raw).trim().replace(/[^\d+]/g, "");
  if (value.startsWith("+91")) value = value.slice(3);
  if (value.startsWith("0")) value = value.slice(1);
  value = value.replace(/\D/g, "");
  if (value.length > 10) value = value.slice(-10);
  return value;
};

const RegisterPage = ({ onGoToLogin }) => {
  const { showAlert } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phone10 = normalizeIndianPhone10(formData.phone);

    if (!formData.name?.trim()) {
      if (showAlert) showAlert("Please enter your name", "error");
      return;
    }
    if (!formData.email?.trim()) {
      if (showAlert) showAlert("Please enter your email", "error");
      return;
    }
    if (phone10.length !== 10) {
      if (showAlert) showAlert("Please enter a valid 10 digit mobile number", "error");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      if (showAlert) showAlert("Password must be at least 6 characters", "error");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: phone10,
          role: formData.role,
          password: formData.password
        })
      });
      if (showAlert) showAlert("Account created successfully. Please login.", "success");
      if (onGoToLogin) onGoToLogin();
    } catch (err) {
      if (showAlert) showAlert(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-container">

      <div className="login-left">

        <div className="login-brand">

          <h1>BankFinance CRM</h1>

          <p>
            Complete financial management and customer relationship platform for modern banking institutions.
          </p>

          <div className="badge-container">
            <span className="feature-badge">Secure System</span>
            <span className="feature-badge">Employee Management</span>
            <span className="feature-badge">Loan Processing</span>
          </div>

        </div>

      </div>

      <div className="login-right">

        <div className="login-form-container">

          <div className="login-header">
            <h2>Create Account</h2>
            <p>Register a new user account</p>
          </div>

          <form className="login-form active" onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="+91 9876543210"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager/Team Lead</option>
                <option value="staff">Staff</option>
                <option value="franchise">Franchise</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Create password (min 6 characters)"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary login-btn"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register Account"}
            </button>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              Already have an account?{" "}
              <button
                type="button"
                onClick={onGoToLogin}
                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", textDecoration: "underline", padding: 0, font: "inherit" }}
              >
                Login
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default RegisterPage;