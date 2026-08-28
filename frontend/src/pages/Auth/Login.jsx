import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle, Mail, Lock } from "lucide-react";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { isRequired, isValidEmail } from "../../utils/validators";
import "./Auth.css";

const schema = {
  email: [
    { test: isRequired, message: "Email is required." },
    { test: isValidEmail, message: "Enter a valid email address." },
  ],
  password: [{ test: isRequired, message: "Password is required." }],
};

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: { email: "", password: "" },
    schema,
    onSubmit: async (vals) => {
      await loginUser(vals);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/pets", { replace: true });
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__icon">
          <UserCircle size={22} />
        </div>
        <h1>Log in</h1>
        <p className="auth-card__subtitle">Access your favorites and track your adoption requests.</p>

        {submitError && <p className="auth-card__error" role="alert">{submitError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Email address"
            name="email"
            type="email"
            icon={Mail}
            required
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            icon={Lock}
            required
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />
          <Button type="submit" variant="primary" fullWidth loading={submitting}>
            Log in
          </Button>
        </form>

        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
