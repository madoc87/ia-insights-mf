"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart, // Renomeado para evitar conflito de nome
  CartesianGrid, // Se for usar, adicione
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

interface CampaignStatusChartProps {
  data: { name: string; valor: number }[];
  config: ChartConfig; // Certifique-se que ChartConfig está corretamente tipado ou importado
}

export default function CampaignStatusChart({ data, config }: CampaignStatusChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">Sem dados para exibir o gráfico.</p>;
  }
  return (
    <ChartContainer config={config} className="min-h-[200px] w-full">
      <RechartsBarChart
        accessibilityLayer
        data={data}
        margin={{ left: 0, top: 20, right:10 }} // Adicionado margem para LabelList
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 7) : value}
          fontSize={12}
        />
        <YAxis />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel className="font-mono font-medium justify-start" />}
        />
        <Bar
          dataKey="valor"
          fill="var(--color-desktop)" // Certifique-se que esta variável CSS existe e está acessível
          radius={8}
        >
          <LabelList
            position="top"
            offset={5}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </RechartsBarChart>
    </ChartContainer>
  );
}
