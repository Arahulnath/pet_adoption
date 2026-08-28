import React from "react";
import { Input } from "../common/FormField";
import Button from "../common/Button";
import useForm from "../../hooks/useForm";
import { isRequired, isValidEmail, isValidPhone } from "../../utils/validators";

const schema = {
  applicantName: [{ test: isRequired, message: "Your name is required." }],
  applicantEmail: [
    { test: isRequired, message: "Your email is required." },
    { test: isValidEmail, message: "Enter a valid email address." },
  ],
  applicantPhone: [
    { test: isRequired, message: "Your phone number is required." },
    { test: isValidPhone, message: "Enter a valid phone number." },
  ],
};

/**
 * Public-facing adoption request form — FR6. Works for both guests and
 * registered users; when a registered user is logged in the parent page
 * pre-fills applicantName/applicantEmail from their profile.
 */
export default function AdoptionRequestForm({ initialValues, onSubmit, onCancel }) {
  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: {
      applicantName: initialValues?.applicantName || "",
      applicantEmail: initialValues?.applicantEmail || "",
      applicantPhone: initialValues?.applicantPhone || "",
    },
    schema,
    onSubmit,
  });

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <p className="pet-form__error" role="alert">
          {submitError}
        </p>
      )}
      <Input
        label="Full name"
        name="applicantName"
        required
        value={values.applicantName}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.applicantName}
      />
      <Input
        label="Email address"
        name="applicantEmail"
        type="email"
        required
        value={values.applicantEmail}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.applicantEmail}
      />
      <Input
        label="Phone number"
        name="applicantPhone"
        type="tel"
        required
        value={values.applicantPhone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.applicantPhone}
        hint="We'll only use this to reach you about your request."
      />
      <div className="pet-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="accent" loading={submitting}>
          Submit adoption request
        </Button>
      </div>
    </form>
  );
}
