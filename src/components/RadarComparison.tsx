import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { PROPERTY_META, normalizeScore, type Material } from "../data/materials";

export default function RadarComparison({ materials }: { materials: Material[] }) {
  const data = PROPERTY_META.map((meta) => {
    const row: Record<string, number | string> = { property: meta.label };
    materials.forEach((m) => {
      row[m.shortName] = normalizeScore(m[meta.key], meta);
    });
    return row;
  });

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#d1d5db" />
          <PolarAngleAxis
            dataKey="property"
            tick={{ fill: "#334155", fontSize: 12, fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickCount={5}
          />
          {materials.map((m) => (
            <Radar
              key={m.id}
              name={m.shortName}
              dataKey={m.shortName}
              stroke={m.color}
              fill={m.color}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          ))}
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}/100`, ""]}
          />
          <Legend wrapperStyle={{ fontSize: 13, fontWeight: 600 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
