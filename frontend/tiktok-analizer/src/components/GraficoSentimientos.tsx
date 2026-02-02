// src/components/GraficoSentimientos.tsx
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3182CE", "#38A169", "#E53E3E"];

export default function GraficoSentimientos({ resumen }: any) {
  const data = [
    { name: "Neutros", value: resumen.neutros },
    { name: "Positivos", value: resumen.positivos },
    { name: "Negativos", value: resumen.negativos },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" label>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
