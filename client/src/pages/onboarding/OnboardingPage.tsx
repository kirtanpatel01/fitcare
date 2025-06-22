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

const steps = ['Basic', "Body", "Activity", "Taste"]
const components = [<BasicInfo />, <BodyInfo />, <ActivityInfo />, <TasteInfo />]

function OnboardingPage() {
  const { form, step, nextStep, prevStep } = useFitcareForm()
  const navigate = useNavigate()

  async function handleSave() {
    try {
      const res = await api.post('/profile/onboarding', form)
      if(res.status === 201) {
        console.log(res)
        toast.success('Profile data saved successfully.')
        navigate('/dashbaord')
      }
    } catch (error: any) {
      console.log(error)
      console.log(error.response.data.error)
      toast.error("Error while saving the profile data!")
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
            <Button onClick={handleSave} className="cursor-pointer">
              Save
            </Button>
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