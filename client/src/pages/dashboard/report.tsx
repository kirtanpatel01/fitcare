import { useProfile } from "@/context/ProfileContext"

function Report() {
  const { profileData, isLoading } = useProfile()

  if(isLoading) return <div>Loading...</div>
  
  const targetCalories = profileData?.targetCalories;
  console.log(targetCalories)

  return (
    <div>
      Kiton
    </div>
  )
}

export default Report