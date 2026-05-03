"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export function ScoreGauge({ score }: { score: number }) {
  const data = [
    { name: "Выполнено", value: score },
    { name: "Осталось", value: 100 - score },
  ];
  const COLORS = ["#22c55e", "#e5e7eb"];

  return (
    <div className="w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p className="text-center text-2xl font-bold">{score}%</p>
    </div>
  );
}