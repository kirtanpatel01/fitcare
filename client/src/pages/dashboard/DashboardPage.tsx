import { Radial } from "@/components/radial"
import { CaloriesReport } from "./calories-report"
import { ExerciseReport } from "./exercise-report"
import Header from "./header"
import TargetCal from "./target-cal"
import { ProfileProvider } from "@/context/ProfileContext"

function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <ProfileProvider>
        <Header />
        <div className="max-w-[430px] sm:max-w-full grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <TargetCal />
          <Radial />
          <Radial />
          <Radial />
        </div>
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          <CaloriesReport />
          <ExerciseReport />
        </div>
      </ProfileProvider>
    </div>
  )
}

export default DashboardPage