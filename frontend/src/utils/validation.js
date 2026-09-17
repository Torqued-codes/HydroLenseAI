export const WATER_FIELDS = [
  { key: "pH", label: "pH", min: 0, max: 14 },
  { key: "turbidity_ntu", label: "Turbidity (NTU)", min: 0 },
  { key: "tds_mg_l", label: "TDS (mg/L)", min: 0 },
  { key: "temperature_c", label: "Temperature (°C)" },
  { key: "dissolved_oxygen_mg_l", label: "Dissolved Oxygen (mg/L)", min: 0 },
  { key: "conductivity_us_cm", label: "Conductivity (µS/cm)", min: 0 }
];

export function validateWaterInput(values) {
  const errors = {};

  WATER_FIELDS.forEach(({ key, label, min, max }) => {
    const value = values[key];

    if (value === "" || value === undefined || value === null) {
      errors[key] = `${label} is required`;
      return;
    }

    const number = Number(value);
    if (!Number.isFinite(number)) {
      errors[key] = `${label} must be numeric`;
      return;
    }

    if (min !== undefined && number < min) {
      errors[key] = `${label} cannot be below ${min}`;
    }

    if (max !== undefined && number > max) {
      errors[key] = `${label} cannot exceed ${max}`;
    }
  });

  return errors;
}