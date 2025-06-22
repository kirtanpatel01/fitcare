import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useProfile } from "@/context/ProfileContext"

function Header() {
  const { profileData } = useProfile()
  const goal = profileData?.goal
  const target = profileData?.target
  const currentWeight = 61
  const startWeight = profileData?.weight

  let progress = 0
  if (goal === 'gain' && target) {
    progress = Math.round((currentWeight * 100) / target)
  }

  if (goal === 'loss' && startWeight && target ) {
    const lossTotal = startWeight - target
    const lossAchieved = startWeight - currentWeight
    progress = Math.round((lossAchieved * 100) / lossTotal)
  }

  console.log(profileData)
  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row justify-between items-ecnter sm:items-center gap-2">
          <span className="font-bold text-lg sm:text-xl">
            {goal === 'gain'
              ? `Weight Gain Progress: ${progress}%`
              : `Weight Loss Progress: ${progress}%`}
          </span>

          <span className="w-fit border rounded-md p-2 bg-teal-500/10">
            {startWeight} → {currentWeight} / {target} kg
          </span>

        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="flex items-center gap-2">
        <Progress value={progress} className="w-[250px] min-[375px]:w-72 min-[475px]:w-[382px] sm:w-lg h-6" />
      </CardContent>
    </Card>
  )
}

export default Header