import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

function Header() {
  const goal = "loss"
  const target = 55
  const currentWeight = 35
  const progress = Math.round((currentWeight * 100) / target)
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-ecnter sm:items-center gap-2">
          <span className="font-bold text-lg sm:text-xl">
            Weight {goal.charAt(0).toUpperCase() + goal.slice(1)} : {progress}%
          </span>
          <span className="w-fit border rounded-md p-2 bg-teal-500/10">
            {currentWeight} / {target} (KG)
          </span>
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center gap-2">
        <Progress value={progress} className="w-64 min-[375px]:w-72 min-[475px]:w-96 sm:w-lg h-6" />
      </CardContent>
    </Card>
  )
}

export default Header