import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export function SentimentChart({ resumen }: any) {
  const data = Object.entries(resumen).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" label>
          {data.map((_, i) => (
            <Cell key={i} fill={["#4caf50", "#f44336", "#9e9e9e"][i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
