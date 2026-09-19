import { PARAMS } from "./validation";

/*
 * Indicative reference ranges, used only to give visual context next to a reading.
 * They are NOT a compliance check and never certify water as safe or unsafe.
 * The anomaly result comes from the ML model and is a separate, pattern-based signal.
 *
 * low / high: null means the range is open on that side.
 * scaleMin / scaleMax: the extent of the drawn scale (readings beyond it are pinned to the edge).
 * ticks: number of ruler divisions drawn along the scale.
 *
 * Adjust these to match the standard your project follows (see knowledge_base/).
 */
export const REFERENCE = {
  pH: { low: 6.5, high: 8.5, scaleMin: 0, scaleMax: 14, ticks: 14, decimals: 1 },
  turbidity_ntu: { low: null, high: 5, scaleMin: 0, scaleMax: 20, ticks: 10, decimals: 1 },
  tds_mg_l: { low: null, high: 600, scaleMin: 0, scaleMax: 1500, ticks: 10, decimals: 0 },
  temperature_c: { low: 15, high: 30, scaleMin: 0, scaleMax: 40, ticks: 8, decimals: 1 },
  dissolved_oxygen_mg_l: { low: 5, high: null, scaleMin: 0, scaleMax: 14, ticks: 14, decimals: 1 },
  conductivity_us_cm: { low: 50, high: 1500, scaleMin: 0, scaleMax: 2000, ticks: 10, decimals: 0 }
};

export const STATUS_TEXT = {
  within: "In range",
  below: "Below range",
  above: "Above range",
  none: "No reading"
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const isOutside = (status) => status === "below" || status === "above";

export function rangeLabel(key) {
  const { low, high } = REFERENCE[key];
  if (low != null && high != null) return `${low}–${high}`;
  if (high != null) return `up to ${high}`;
  return `at least ${low}`;
}

export function assessValue(key, raw) {
  const ref = REFERENCE[key];
  const value = Number(raw);
  if (raw === undefined || raw === null || raw === "" || Number.isNaN(value)) return "none";
  if (ref.low != null && value < ref.low) return "below";
  if (ref.high != null && value > ref.high) return "above";
  return "within";
}

/** Position of a value along its scale, 0–100, pinned to the edges. */
export function positionPercent(key, raw) {
  const { scaleMin, scaleMax } = REFERENCE[key];
  return clamp(((Number(raw) - scaleMin) / (scaleMax - scaleMin)) * 100, 0, 100);
}

/** Start and end of the shaded reference band along the scale, 0–100. */
export function bandPercent(key) {
  const { low, high, scaleMin, scaleMax } = REFERENCE[key];
  const span = scaleMax - scaleMin;
  return {
    start: low == null ? 0 : ((low - scaleMin) / span) * 100,
    end: high == null ? 100 : ((high - scaleMin) / span) * 100
  };
}

/** One row per parameter, safe to call with undefined (returns "No reading" rows). */
export function assessReading(values) {
  return PARAMS.map((p) => {
    const raw = values?.[p.key];
    const status = assessValue(p.key, raw);
    const ref = REFERENCE[p.key];
    return {
      key: p.key,
      label: p.label,
      unit: p.unit,
      status,
      value: status === "none" ? null : Number(raw),
      display: status === "none" ? "" : Number(raw).toFixed(ref.decimals),
      range: rangeLabel(p.key),
      scaleMin: ref.scaleMin,
      scaleMax: ref.scaleMax,
      ticks: ref.ticks
    };
  });
}
