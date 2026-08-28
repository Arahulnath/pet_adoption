import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ShieldCheck, User, Lock } from "lucide-react";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { isRequired } from "../../utils/validators";
import "./Auth.css";

const schema = {
  username: [{ test: isRequired, message: "Username is required." }],
  password: [{ test: isRequired, message: "Password is required." }],
};

export default function StaffLogin() {
  const { loginStaff } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: { username: "", password: "" },
    schema,
    onSubmit: async (vals) => {
      await loginStaff(vals);
      toast.success("Welcome back!");
      navigate(location.state?.from?.pathname || "/staff/dashboard", { replace: true });
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--staff">
        <div className="auth-card__icon">
          <ShieldCheck size={22} />
        </div>
        <h1>Staff login</h1>
        <p className="auth-card__subtitle">Restricted to shelter staff for managing pets and requests.</p>

        {submitError && <p className="auth-card__error" role="alert">{submitError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Username or email"
            name="username"
            icon={User}
            required
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
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
          <Button type="submit" variant="accent" fullWidth loading={submitting}>
            Log in to staff console
          </Button>
        </form>

        <p className="auth-card__footer">
          Not staff? <Link to="/">Return to the public site</Link>
        </p>
      </div>
    </div>
  );
}
