import { useCallback, useState } from "react";
import { validateForm } from "../utils/validators";

/**
 * useForm — small controlled-form hook shared by every form in the app
 * (login, register, pet form, adoption request form). Handles field
 * values, touched state, validation-on-blur, and submit lifecycle so
 * individual page components stay focused on markup, not form plumbing.
 */
export default function useForm({ initialValues, schema = {}, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (schema[name]) {
        const fieldErrors = validateForm(values, { [name]: schema[name] });
        setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
      }
    },
    [schema, values]
  );

  const validateAll = useCallback(() => {
    const allErrors = validateForm(values, schema);
    setErrors(allErrors);
    setTouched(
      Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    return Object.keys(allErrors).length === 0;
  }, [schema, values]);

  const setServerErrors = useCallback((fieldErrors) => {
    if (fieldErrors) setErrors((prev) => ({ ...prev, ...fieldErrors }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      setSubmitError(null);
      if (!validateAll()) return;
      setSubmitting(true);
      try {
        await onSubmit(values);
      } catch (err) {
        setSubmitError(err?.message || "Something went wrong. Please try again.");
        setServerErrors(err?.fieldErrors);
      } finally {
        setSubmitting(false);
      }
    },
    [onSubmit, validateAll, values, setServerErrors]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    submitting,
    submitError,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValues,
  };
}
