import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { Input } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import useForm from "../../hooks/useForm";
import useAuth from "../../hooks/useAuth";
import useToast from "../../hooks/useToast";
import { isRequired, isValidEmail, isValidPassword } from "../../utils/validators";
import "./Auth.css";

const schema = {
  name: [{ test: isRequired, message: "Your name is required." }],
  email: [
    { test: isRequired, message: "Email is required." },
    { test: isValidEmail, message: "Enter a valid email address." },
  ],
  password: [
    { test: isRequired, message: "Password is required." },
    { test: isValidPassword, message: "Use at least 8 characters, including a letter and a number." },
  ],
};

export default function Register() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: { name: "", email: "", password: "" },
    schema,
    onSubmit: async (vals) => {
      await registerUser(vals);
      toast.success("Account created — welcome to Pawfinder!");
      navigate("/pets", { replace: true });
    },
  });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__icon">
          <UserPlus size={22} />
        </div>
        <h1>Create an account</h1>
        <p className="auth-card__subtitle">
          Optional, but registering lets you save favorites and track your requests (FR4/FR5).
        </p>

        {submitError && <p className="auth-card__error" role="alert">{submitError}</p>}

        <form onSubmit={handleSubmit} noValidate>
          <Input
            label="Full name"
            name="name"
            icon={User}
            required
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
          />
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
            hint="At least 8 characters, with a letter and a number."
          />
          <Button type="submit" variant="primary" fullWidth loading={submitting}>
            Create account
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
