// ExamplePage.tsx
"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

// Define chart config
const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))", // use Tailwind CSS vars or any color
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-2))",
  },
};

const data = [
  { month: "Jan", sales: 4000, profit: 2400 },
  { month: "Feb", sales: 3000, profit: 2210 },
  { month: "Mar", sales: 2000, profit: 2290 },
  { month: "Apr", sales: 2780, profit: 2000 },
  { month: "May", sales: 1890, profit: 2181 },
  { month: "Jun", sales: 2390, profit: 2500 },
  { month: "Jul", sales: 3490, profit: 2100 },
];

export default function ExamplePage() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">📈 Sales vs Profit</h2>

      <ChartContainer config={chartConfig} className="w-full max-w-3xl">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line type="monotone" dataKey="sales" stroke="var(--color-sales)" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
