import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { STATUS_TEXT, assessReading, isOutside, positionPercent } from "../utils/reference";

const SHORT_NAMES = {
  pH: "pH",
  turbidity_ntu: "Turbidity",
  tds_mg_l: "TDS",
  temperature_c: "Temp",
  dissolved_oxygen_mg_l: "O₂",
  conductivity_us_cm: "Conduct."
};

const COLOR_IN_RANGE = "#0b5d7a";
const COLOR_OUTSIDE = "#d98a1f";

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="chart-tip">
      <strong>{item.label}</strong>
      <span>{item.display} {item.unit}</span>
      <span className={`chart-tip-status chart-tip-status--${item.status}`}>
        {STATUS_TEXT[item.status]} (indicative range {item.range} {item.unit})
      </span>
    </div>
  );
}

export default function WaterChart({ values }) {
  if (!values) return null;

  // Each bar is scaled to its own parameter range so pH (0-14) and conductivity
  // (hundreds) can be read side by side. The tooltip and labels show the real values.
  const data = assessReading(values).map((row) => ({
    name: SHORT_NAMES[row.key],
    scaled: positionPercent(row.key, row.value),
    display: row.display,
    unit: row.unit,
    label: row.label,
    status: row.status,
    range: row.range
  }));

  return (
    <section className="card chart-card">
      <div className="panel-head">
        <div>
          <h3 className="panel-title">Current water-quality profile</h3>
          <p className="panel-sub">Each bar is scaled to its own range. Amber marks a value outside its indicative range.</p>
        </div>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 22, right: 4, left: 4, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e3e9ed" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#536874", fontSize: 12 }} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(11, 93, 122, 0.06)" }} />
            <Bar dataKey="scaled" radius={[4, 4, 0, 0]} maxBarSize={44}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={isOutside(entry.status) ? COLOR_OUTSIDE : COLOR_IN_RANGE} />
              ))}
              <LabelList dataKey="display" position="top" style={{ fill: "#384d58", fontSize: 12, fontWeight: 600 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
