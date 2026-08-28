import React from "react";
import shelterApi from "../../api/shelterApi";
import useFetch from "../../hooks/useFetch";
import useForm from "../../hooks/useForm";
import useToast from "../../hooks/useToast";
import { Input, Textarea } from "../../components/common/FormField";
import Button from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { ErrorState } from "../../components/common/StateDisplays";
import { isRequired } from "../../utils/validators";
import "./Staff.css";

const schema = {
  name: [{ test: isRequired, message: "Shelter name is required." }],
  address: [{ test: isRequired, message: "Address is required." }],
};

function ShelterForm({ initialData, onSave }) {
  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      operatingHours: initialData?.operatingHours || "",
      contactPhone: initialData?.contactPhone || "",
      contactEmail: initialData?.contactEmail || "",
    },
    schema,
    onSubmit: onSave,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="staff-page__form">
      {submitError && <p className="pet-form__error" role="alert">{submitError}</p>}
      <Input
        label="Shelter name"
        name="name"
        required
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
      />
      <Textarea
        label="Address"
        name="address"
        required
        rows={2}
        value={values.address}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.address}
      />
      <Input
        label="Operating hours"
        name="operatingHours"
        placeholder="e.g. Mon–Sat, 9am–5pm"
        value={values.operatingHours}
        onChange={handleChange}
      />
      <Input
        label="Phone"
        name="contactPhone"
        type="tel"
        value={values.contactPhone}
        onChange={handleChange}
      />
      <Input
        label="Email"
        name="contactEmail"
        type="email"
        value={values.contactEmail}
        onChange={handleChange}
      />
      <Button type="submit" variant="primary" loading={submitting}>
        Save changes
      </Button>
    </form>
  );
}

export default function ShelterSettings() {
  const toast = useToast();
  const { data, loading, error, refetch, setData } = useFetch(
    () => shelterApi.getShelterInfo().then((r) => r.data),
    []
  );

  const handleSave = async (values) => {
    const { data: updated } = await shelterApi.updateShelterInfo(values);
    setData(updated);
    toast.success("Shelter information updated.");
  };

  return (
    <div className="staff-page">
      <div className="page-header">
        <div>
          <span className="page-header__eyebrow">Settings</span>
          <h1>Shelter information</h1>
          <p>This information is shown publicly on the Shelter page (FR12).</p>
        </div>
      </div>

      {loading && <Loader label="Loading shelter details…" />}
      {error && <ErrorState message={error.message} onAction={refetch} />}

      {!loading && !error && (
        <div className="staff-page__card">
          <ShelterForm initialData={data} onSave={handleSave} />
        </div>
      )}
    </div>
  );
}
