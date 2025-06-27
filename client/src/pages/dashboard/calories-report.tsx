import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"
import { useCalories } from "@/context/CalorieContex"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { format, subDays, eachDayOfInterval } from "date-fns"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CaloriesReport() {
  const { isLoading, allCal, refreshAllCal } = useCalories();
  
  if (isLoading) return <div>Loading...</div>
  
  const past7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const calMap = new Map<string, number>();

  for (const cal of allCal) {
    const dateStr = format(new Date(cal.createdAt), "dd-MMM");
    calMap.set(dateStr, (calMap.get(dateStr) || 0) + cal.cal);
  }

  const chartData = past7Days.map((date) => {
    const dateStr = format(date, "dd-MMM");
    return {
      date: dateStr,
      cal: calMap.get(dateStr) || 0,
    };
  });

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Past 7 Days Calories</CardTitle>
        <Button onClick={refreshAllCal} size="icon" variant="outline" className="cursor-pointer">
          <RefreshCcw />
        </Button>
      </CardHeader>
      <Separator />
      <CardContent>
        <ChartContainer config={chartConfig} className="flex-1 pb-0">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="cal"
              type="monotone"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}