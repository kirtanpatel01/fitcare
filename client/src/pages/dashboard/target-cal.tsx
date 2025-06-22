import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from "@/components/ui/separator"
const chartData = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export default function TargetCal() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Shape</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col sm:flex-row items-center">
        <ChartContainer
          config={chartConfig}
          className="flex-1 aspect-square"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        <div className="flex flex-col items-center gap-6">
          <span className="w-fit border rounded-md bg-teal-500/10 p-2">Total: 2323 cal</span>
          <span className="w-fit border rounded-md bg-teal-500/10 p-2">Earned: 2323 cal</span>
          <span className="w-fit border rounded-md bg-teal-500/10 p-2">Remaining: 2323 cal</span>
        </div>
      </CardContent>
    </Card>
  )
}
