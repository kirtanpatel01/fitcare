import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { ChartContainer, type ChartConfig } from "./ui/chart"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useProfile } from "@/context/ProfileContext"
import { useCalories } from "@/context/CalorieContex"
import { Button } from "./ui/button"
import { RefreshCcw } from "lucide-react"

const chartConfig = {
  morningCal: {
    label: "Breakfast",
  },
} satisfies ChartConfig

export function Radial({ time }: { time: string }) {
  const { profileData } = useProfile()
  const target = Math.round(Number(profileData?.targetCalories ?? 0))

  const { isLoading, calories, refreshCal } = useCalories();

  if (isLoading) return <div>Loading...</div>

  const filteredCal = calories.filter(cal => cal.time === time)
  const calSum = Math.round(filteredCal.reduce((sum, cal) => sum + cal.cal, 0))

  const chartData = [
    { timing: "Breakfast", calories: calSum, fill: "var(--color-chart-2)" },
  ]

  const end = Math.round((calSum * 360) / target)

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{time.charAt(0).toUpperCase()+time.slice(1)}</CardTitle>
        <Button
          onClick={refreshCal}
          size={"icon"}
          type="button"
          variant={"outline"}
          className="cursor-pointer">
          <RefreshCcw />
        </Button>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col sm:flex-row">
        <ChartContainer
          config={chartConfig}
          className="flex-1 aspect-square h-auto"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={end}
            innerRadius={65}
            outerRadius={90}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[70, 60]}
            />
            <RadialBar dataKey="calories" background cornerRadius={10} />
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
                          {chartData[0].calories.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {target}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}