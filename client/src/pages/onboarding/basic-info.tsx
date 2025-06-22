import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomCombobox } from "@/components/custom-combobox"
import { useFitcareForm } from "@/hooks/use-fitcare-form"
import { useLocationAPI } from "@/hooks/use-location"

function BasicInfo() {
  const { form, updateForm } = useFitcareForm();

  const genders = ["Male", "Female", "Other"]

  const { states, cities, fetchCities, loadingCities } = useLocationAPI()

  const stateOptions = states.map((s) => ({ label: s.name, value: s.name }))
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }))
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="number"
          name="age"
          value={form.age ?? ""}
          onChange={(e) => {
            const val = e.target.value
            updateForm({ age: val === "" ? undefined : +val })
          }}
          placeholder="Age"
          className="max-w-24" />
        <Label>Year</Label>
      </div>
      <div className="border rounded-md p-3 space-y-3">
        <Label>Choose gender:</Label>
        <RadioGroup
          value={form.gender ?? ""}
          onValueChange={(value) => updateForm({ gender: value })}
        >
          {genders.map((gender) => (
            <div className="flex items-center gap-2" key={gender}>
              <RadioGroupItem value={gender.toLowerCase()} id={gender} />
              <Label htmlFor={gender}>{gender}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">State</label>
        <CustomCombobox
          options={stateOptions}
          placeholder="Select a state"
          value={form.state || ''}
          onChange={(selectedState) => {
            updateForm({ state: selectedState, city: "" })
            fetchCities(selectedState)
          }}
        />
      </div>

      {/* CITY SELECT */}
      <div>
        <label className="mb-1 block text-sm font-medium">City</label>
        <CustomCombobox
          options={cityOptions}
          placeholder={loadingCities ? "Loading cities..." : "Select a city"}
          value={form.city || ''}
          onChange={(selectedCity) => updateForm({ city: selectedCity })}
        />
      </div>
    </div>
  )
}

export default BasicInfo