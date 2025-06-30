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
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'
import { Separator } from "@/components/ui/separator"
import { useProfile } from "@/context/ProfileContext"
import { useCalories } from "@/context/CalorieContex"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"

const chartConfig = {
  calories: {
    label: "Calories",
  },
} satisfies ChartConfig

export default function TargetCal() {
  const { profileData } = useProfile()
  const target = Math.round(Number(profileData?.targetCalories ?? 0))

  
  const { isLoading, calories, refreshCal } = useCalories();
  console.log(isLoading, profileData)
  
  if(isLoading) return <div>Loading...</div>
  
  const calSum = Math.round(calories.reduce((sum, cal) => sum + cal.cal, 0))
  
  const chartData = [
    { browser: "calores", calories: calSum, fill: "var(--color-chart-2)" },
  ]

  const end = (calSum * 360) / target

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Today Calories</CardTitle>
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
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="flex-1 aspect-square h-auto"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={end}
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
            <RadialBar dataKey="calories" background cornerRadius={1} />
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
