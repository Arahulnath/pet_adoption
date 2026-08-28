import React, { useRef } from "react";
import { UploadCloud, X } from "lucide-react";

export default function ImageUpload({ value, onChange, error }) {
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`field ${error ? "field--error" : ""}`}>
      <label className="field__label">Pet image</label>

      {value ? (
        <div className="img-upload__preview">
          <img src={value} alt="Pet preview" className="img-upload__img" />
          <button type="button" className="img-upload__clear" onClick={handleClear} aria-label="Remove image">
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="img-upload__zone" htmlFor="pet-image-input">
          <UploadCloud size={28} className="img-upload__icon" />
          <span className="img-upload__text">Click to upload</span>
          <span className="img-upload__hint">JPG, PNG, WEBP — max 5 MB</span>
          <input
            ref={inputRef}
            id="pet-image-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="img-upload__input"
            onChange={handleFile}
          />
        </label>
      )}

      {error && <p className="field__message field__message--error" role="alert">{error}</p>}
    </div>
  );
}
