import { Radial } from "@/components/radial"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function EarnedCal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today Earned Calories:</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col sm:flex-row">
        <Radial />
        <Radial />
        <Radial />
      </CardContent>
    </Card>
  )
}
