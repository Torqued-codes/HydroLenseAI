import { PARAMS, DEMO_DATA, validate } from "../utils/validation";
import ParameterCard from "./ParameterCard";
import Loading from "./Loading";
import { useState } from "react";

export default function WaterInput({ onAnalyze }) {
  const [values, setValues] = useState(Object.fromEntries(PARAMS.map((p) => [p.key, ""])));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const loadDemo = () => {
    setValues(DEMO_DATA);
    setErrors({});
  };

  const submit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }
    setLoading(true);
    try {
      await onAnalyze(Object.fromEntries(PARAMS.map((p) => [p.key, Number(values[p.key])])), values);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card input-card" onSubmit={submit}>
      <div className="panel-head">
        <div>
          <h2 className="panel-title panel-title--lg">Enter measurements</h2>
          <p className="panel-sub">Provide the latest sensor or field readings for anomaly analysis.</p>
        </div>
        <button type="button" className="ghost-button" onClick={loadDemo}>Load demo</button>
      </div>

      <div className="parameter-grid">
        {PARAMS.map((p) => (
          <ParameterCard
            key={p.key}
            label={p.label}
            unit={p.unit}
            value={values[p.key]}
            error={errors[p.key]}
            onChange={(value) => update(p.key, value)}
          />
        ))}
      </div>

      <div className="form-footer">
        <span className="form-hint">All six parameters are required.</span>
        <button className="primary-button" disabled={loading}>
          {loading ? <Loading label="Analyzing" /> : "Analyze water quality"}
        </button>
      </div>
    </form>
  );
}
