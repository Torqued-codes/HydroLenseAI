import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function WaterChart({ values }) {
  if (!values) return null;

  const data = [
    { name: "pH", value: Number(values.pH), display: Number(values.pH).toFixed(1) },
    { name: "Turbidity", value: Number(values.turbidity_ntu), display: Number(values.turbidity_ntu).toFixed(1) },
    { name: "TDS", value: Number(values.tds_mg_l), display: Number(values.tds_mg_l).toFixed(0) },
    { name: "Temp", value: Number(values.temperature_c), display: Number(values.temperature_c).toFixed(1) },
    { name: "O₂", value: Number(values.dissolved_oxygen_mg_l), display: Number(values.dissolved_oxygen_mg_l).toFixed(1) },
    { name: "Conduct.", value: Number(values.conductivity_us_cm), display: Number(values.conductivity_us_cm).toFixed(0) }
  ];

  return (
    <section className="card chart-card">
      <div className="card-heading">
        <div>
          <div className="section-kicker">MEASUREMENTS</div>
          <h3>Current water-quality profile</h3>
        </div>
        <span className="muted">Relative values</span>
      </div>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip formatter={(value, _, item) => [item?.payload?.display ?? value, "Value"]} />
            <Bar dataKey="value" radius={[7, 7, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}