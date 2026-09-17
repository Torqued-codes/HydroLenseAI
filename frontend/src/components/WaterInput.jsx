import { useState } from "react";
import { WATER_FIELDS, validateWaterInput } from "../utils/validation";

const initialValues = {
  pH: "",
  turbidity_ntu: "",
  tds_mg_l: "",
  temperature_c: "",
  dissolved_oxygen_mg_l: "",
  conductivity_us_cm: ""
};

export default function WaterInput({ onSubmit, loading }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validation = validateWaterInput(values);
    setErrors(validation);
    if (Object.keys(validation).length) return;

    onSubmit(
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, Number(value)])
      )
    );
  }

  function loadDemo() {
    setValues({
      pH: 6.1,
      turbidity_ntu: 11.5,
      tds_mg_l: 710,
      temperature_c: 29,
      dissolved_oxygen_mg_l: 3,
      conductivity_us_cm: 860
    });
    setErrors({});
  }

  return (
    <form className="water-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <div>
          <p className="eyebrow">WATER QUALITY INPUT</p>
          <h2>Enter measurements</h2>
        </div>
        <button type="button" className="secondary-button" onClick={loadDemo}>
          Load Demo
        </button>
      </div>

      <div className="input-grid">
        {WATER_FIELDS.map((field) => (
          <label key={field.key} className="input-field">
            <span>{field.label}</span>
            <input
              name={field.key}
              type="number"
              step="any"
              value={values[field.key]}
              onChange={handleChange}
              placeholder="Enter value"
            />
            {errors[field.key] && <small>{errors[field.key]}</small>}
          </label>
        ))}
      </div>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Water Quality"}
      </button>
    </form>
  );
}