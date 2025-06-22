import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useFitcareForm } from "@/hooks/use-fitcare-form"

const tasteOptions = ["Sweet", "Sour", "Salty", "Spicy"];

function TasteInfo() {
  const { form, updateForm } = useFitcareForm()
  return (
    <div className="space-y-6">
      <div className="border rounded-md p-3 space-y-3">
        <Label>Food Type:</Label>
        <RadioGroup
          className="flex ml-1"
          value={form.food ?? ""}
          onValueChange={(value: "veg" | "nonveg") => updateForm({ food: value })}
        >
          {["Veg", "Nonveg"].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <RadioGroupItem value={type.toLowerCase()} id={type} />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="border rounded-md p-3 space-y-3">
        <Label className="underline underline-offset-2 decoration-border">
          Select your preferred tastes:
        </Label>

        <div className="grid grid-cols-2 gap-3">
          {tasteOptions.map((taste) => {
            const isChecked = form.taste?.includes(taste.toLowerCase()) ?? false;
            return (
              <div key={taste} className="flex items-center gap-2">
                <Checkbox
                  id={taste}
                  checked={isChecked}
                  onCheckedChange={(checked) => {
                    const current = form.taste || [];
                    if (checked === true) {
                      // Avoid duplicates
                      if (!current.includes(taste.toLowerCase())) {
                        updateForm({ taste: [...current, taste.toLowerCase()] });
                      }
                    } else {
                      updateForm({ taste: current.filter((t) => t !== taste.toLowerCase()) });
                    }
                  }}
                />
                <Label htmlFor={taste}>{taste}</Label>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  )
}

export default TasteInfo