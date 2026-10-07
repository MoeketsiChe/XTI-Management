import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { currentUser, login } = useAuth();
  const [values, setValues] = useState({ membershipId: "", password: "" });
  const [errors, setErrors] = useState({});

  if (currentUser) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!values.membershipId.trim()) errs.membershipId = "Membership ID is required";
    if (!values.password) errs.password = "Password is required";
    if (Object.keys(errs).length === 0) {
      const result = login(values.membershipId, values.password);
      if (!result.ok) errs.form = result.error;
    }
    setErrors(errs);
  };

  return (
    <div className="login-card">
      <div className="brand">
        XTI<span>LIBRARY</span>
      </div>
      <p className="eyebrow">Sign in</p>
      <h1>Welcome back.</h1>

      <form onSubmit={handleSubmit} noValidate style={{ marginTop: "1.5rem" }}>
        {errors.form && <p className="error">{errors.form}</p>}
        <div>
          <label htmlFor="membershipId">Membership ID</label>
          <input
            id="membershipId"
            name="membershipId"
            value={values.membershipId}
            onChange={handleChange}
          />
          {errors.membershipId && <p className="error">{errors.membershipId}</p>}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}