import { CaloriesReport } from "./calories-report"
import { EarnedCal } from "./earned-cal"
import { ExerciseReport } from "./exercise-report"
import Header from "./header"
import TargetCal from "./target-cal"

function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <Header />
      <div className="grid xl:grid-cols-2 gap-4 sm:gap-6">
        <TargetCal />
        <EarnedCal />
        <CaloriesReport />
        <ExerciseReport />
      </div>
    </div>
  )
}

export default DashboardPage