export const DEMO_DATA = {
  pH: 6.1,
  turbidity_ntu: 11.5,
  tds_mg_l: 710,
  temperature_c: 29,
  dissolved_oxygen_mg_l: 3,
  conductivity_us_cm: 860
};

export const PARAMS = [
  { key: "pH", label: "pH", unit: "pH", min: 0, max: 14, step: 0.1 },
  { key: "turbidity_ntu", label: "Turbidity", unit: "NTU", min: 0, max: 100, step: 0.1 },
  { key: "tds_mg_l", label: "TDS", unit: "mg/L", min: 0, max: 5000, step: 1 },
  { key: "temperature_c", label: "Temperature", unit: "°C", min: -20, max: 100, step: 0.1 },
  { key: "dissolved_oxygen_mg_l", label: "Dissolved oxygen", unit: "mg/L", min: 0, max: 20, step: 0.1 },
  { key: "conductivity_us_cm", label: "Conductivity", unit: "µS/cm", min: 0, max: 10000, step: 1 }
];

export function validate(values) {
  const errors = {};
  PARAMS.forEach((p) => {
    const value = Number(values[p.key]);
    if (values[p.key] === "" || Number.isNaN(value)) errors[p.key] = "Enter a value";
    else if (value < p.min || value > p.max) errors[p.key] = `Use ${p.min}–${p.max}`;
  });
  return errors;
}

