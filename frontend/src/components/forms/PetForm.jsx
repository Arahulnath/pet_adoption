import React from "react";
import { Input, Textarea, Select } from "../common/FormField";
import Button from "../common/Button";
import useForm from "../../hooks/useForm";
import { isRequired, isPositiveNumber, minLength, validateForm } from "../../utils/validators";
import { SPECIES_OPTIONS, ADOPTION_STATUS_OPTIONS } from "../../constants";
import ImageUpload from "./ImageUpload";
import "./PetForm.css";

const schema = {
  name: [{ test: isRequired, message: "Pet name is required." }],
  species: [{ test: isRequired, message: "Please choose a species." }],
  breed: [{ test: isRequired, message: "Breed is required." }],
  age: [{ test: isPositiveNumber, message: "Enter a valid age (0 or more)." }],
  description: [
    { test: isRequired, message: "A short description helps adopters decide." },
    { test: (v) => minLength(v, 20), message: "Description should be at least 20 characters." },
  ],
  adoptionStatus: [{ test: isRequired, message: "Select the current adoption status." }],
  // imageUrl is optional
};

/**
 * Same form component powers both "Create Pet" and "Edit Pet" — passed
 * `mode` + `initialData` per the SRS reusability guidance
 * (<PetForm initialData={selectedPet} mode="edit" onSubmit={...} />).
 */
export default function PetForm({ mode = "create", initialData, onSubmit, onCancel }) {
  const { values, errors, handleChange, handleBlur, handleSubmit, submitting, submitError } = useForm({
    initialValues: {
      name: initialData?.name || "",
      species: initialData?.species || "",
      breed: initialData?.breed || "",
      age: initialData?.age ?? "",
      description: initialData?.description || "",
      adoptionStatus: initialData?.adoptionStatus || "Available",
      imageUrl: initialData?.imageUrl || initialData?.primaryImageUrl || initialData?.images?.[0]?.imageUrl || "",
      vaccinationStatus: initialData?.vaccinationStatus || "",
      spayNeuterStatus: initialData?.spayNeuterStatus || "",
      specialNeeds: initialData?.specialNeeds || "",
    },
    schema,
    onSubmit: async (vals) => {
      const errs = validateForm(vals, schema);
      if (Object.keys(errs).length) {
        const err = new Error("Please fix the highlighted fields.");
        err.fieldErrors = errs;
        throw err;
      }
      await onSubmit(vals);
    },
  });

  return (
    <form className="pet-form" onSubmit={handleSubmit} noValidate>
      {submitError && <p className="pet-form__error" role="alert">{submitError}</p>}

      <div className="pet-form__grid">
        <Input
          label="Pet name"
          name="name"
          required
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          placeholder="e.g. Rusty"
        />
        <Select
          label="Species"
          name="species"
          required
          options={SPECIES_OPTIONS}
          value={values.species}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.species}
        />
        <Input
          label="Breed"
          name="breed"
          required
          value={values.breed}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.breed}
          placeholder="e.g. Labrador Mix"
        />
        <Input
          label="Age (years)"
          name="age"
          type="number"
          min="0"
          required
          value={values.age}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.age}
        />
        <Select
          label="Adoption status"
          name="adoptionStatus"
          required
          options={ADOPTION_STATUS_OPTIONS}
          value={values.adoptionStatus}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.adoptionStatus}
        />
        <ImageUpload
          value={values.imageUrl}
          onChange={(val) => handleChange({ target: { name: "imageUrl", value: val } })}
          error={errors.imageUrl}
        />
      </div>

      <Textarea
        label="Description"
        name="description"
        required
        rows={4}
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        placeholder="Tell prospective adopters about this pet's personality…"
      />

      <div className="pet-form__section-label">Health &amp; history (staff-only, FR13)</div>
      <div className="pet-form__grid">
        <Input
          label="Vaccination status"
          name="vaccinationStatus"
          value={values.vaccinationStatus}
          onChange={handleChange}
          placeholder="e.g. Up to date"
        />
        <Input
          label="Spay/neuter status"
          name="spayNeuterStatus"
          value={values.spayNeuterStatus}
          onChange={handleChange}
          placeholder="e.g. Spayed"
        />
      </div>
      <Textarea
        label="Special medical needs"
        name="specialNeeds"
        rows={2}
        value={values.specialNeeds}
        onChange={handleChange}
        placeholder="Optional — any medical needs staff should track"
      />

      <div className="pet-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {mode === "edit" ? "Save changes" : "Create pet"}
        </Button>
      </div>
    </form>
  );
}
