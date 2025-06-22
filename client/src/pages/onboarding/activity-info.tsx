import { Label } from "@/components/ui/label"
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group"
import { useFitcareForm } from "@/hooks/use-fitcare-form"

const acitvities = [
  {
    value: 'low',
    title: "Sedentary",
    desc: "e.g. Office work, sitting most of the time."
  },
  {
    value: 'light',
    title: "Lightly Active",
    desc: "e.g. Walking for 20-30 minutes daily."
  },
  {
    value: 'moderate',
    title: "Moderately Active",
    desc: "e.g. Jogging, cycling or playing sports regularly."
  },
  {
    value: 'very',
    title: "Very Active",
    desc: "e.g. Intense gym sessions, construction work or regular sports activities."
  },
  {
    value: 'ultra',
    title: "Ultra Active",
    desc: "e.g. Professional athelete, marathon runner or labor work."
  },
]

function ActivityInfo() {
  const { form, updateForm } = useFitcareForm()
  return (
    <div>
      <RadioGroup
        value={form.activity ?? ""}
        onValueChange={(val) => updateForm({ activity: val })}
        className="space-y-4"
      >
        {acitvities.map((act) => (
          <div key={act.title} className="flex items-center gap-3">
            <RadioGroupItem value={act.value} id={act.title} />
            <Label htmlFor={act.title} className={`flex flex-col items-start gap-0 border rounded-md p-3 hover:bg-primary/5 ${form.activity === act.value ? "bg-primary/3" : ""}`}>
              <span className="font-semibold text-base">{act.title}</span>
              <p className="text-xs tracking-wider opacity-50 ">{act.desc}</p>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default ActivityInfo