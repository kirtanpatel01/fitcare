import { Radial } from "@/components/radial"
import { CaloriesReport } from "./calories-report"
// import { ExerciseReport } from "./exercise-report"
// import Header from "./header"
import TargetCal from "./target-cal"
import { ProfileProvider } from "@/context/ProfileContext"
import { CaloriesProvider } from "@/context/CalorieContex"

function DashboardPage() {

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <ProfileProvider>
        <CaloriesProvider>
          {/* <Header /> */}
          <div className="max-w-[430px] sm:max-w-full grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
            <TargetCal />
            <Radial time="breakfast" />
            <Radial time="lunch" />
            <Radial time="dinner" />
          </div>
          <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
            <CaloriesReport />
            {/* <ExerciseReport /> */}
          </div>
        </CaloriesProvider>
      </ProfileProvider>
    </div>
  )
}

export default DashboardPage