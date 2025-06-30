import { useFitcareForm } from "@/hooks/use-fitcare-form"
import ActivityInfo from "./activity-info"
import BasicInfo from "./basic-info"
import BodyInfo from "./body-info"
import TasteInfo from "./taste-info"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import api from "@/lib/api"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const steps = ['Basic', "Body", "Activity", "Taste"]
const components = [<BasicInfo />, <BodyInfo />, <ActivityInfo />, <TasteInfo />]

type ProfileData = {
  _id: string;
};

function OnboardingPage() {
  const { form, step, nextStep, prevStep, setForm } = useFitcareForm()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await api.get('/profile')
        if (res.status === 200) {
          setProfileData(res.data.profile)
          setForm(res.data.profile)
          // navigate('/dashboard')
          // toast.success('Profile data fetched.')
        }
      } catch (error: any) {
        console.log("Error while fetching profile data: ", error)
        // toast.error(error.response.data.error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) return <div>Loading...</div>

  async function handleSave() {
    try {
      setIsSaving(true)
      console.log(form)
      const res = await api.post('/profile/onboarding', form)
      if (res.status === 201) {
        toast.success('Profile data saved successfully.')
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.log(error.response.data.error)
      toast.error("Error while saving the profile data!")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdate() {
    try {
      setIsUpdating(true)
      const res = await api.put(`/profile/onboarding/${profileData?._id}`, form)
      if (res.status === 200) {
        setProfileData(res.data.profile)
        toast.success('Profile data updated successfully.')
        // navigate('/dashboard')
      }
    } catch (error: any) {
      console.log(error.response.data.error)
      toast.error("Error while updating the profile data!")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-var(--site-header-height))] flex justify-center items-center">
      <Card className="max-w-sm w-full mx-auto">
        <CardHeader className="flex justify-center">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`px-2 py-1 rounded-full text-sm ${i === step ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-300"
                }`}
            >
              {s}
            </div>
          ))}
        </CardHeader>

        <Separator />
        <CardContent key={step}>
          {components[step]}
        </CardContent>

        <Separator />

        <CardFooter className="w-full flex justify-between">
          <Button variant={'secondary'} onClick={prevStep} disabled={step === 0} className="cursor-pointer">
            Previous
          </Button>
          {step === components.length - 1 ? (
            <>
              {profileData
                ? <Button 
                    onClick={handleUpdate} 
                    className="cursor-pointer" 
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                : <Button 
                    onClick={handleSave} 
                    className="cursor-pointer" 
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                }
            </>
          ) : (
            <Button variant={'secondary'} onClick={nextStep} className="cursor-pointer">
              Next
            </Button>
          )}

        </CardFooter>
      </Card>
    </div>
  )
}

export default OnboardingPage