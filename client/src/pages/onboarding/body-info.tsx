import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useFitcareForm } from "@/hooks/use-fitcare-form"

function BodyInfo() {
  const { form, updateForm } = useFitcareForm()
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          type="number"
          name="height"
          value={form.height ?? ""} // fallback to empty string if undefined
          onChange={(e) => {
            const val = e.target.value
            updateForm({ height: val === "" ? undefined : +val })
          }}
          className="max-w-24"
          placeholder="Height"
        />
        <Select
          value={form.hUnit ?? ""} 
          defaultValue="cm"
          onValueChange={(val: "cm" | "m" | "ft" | "in") => updateForm({ hUnit: val })}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
            <SelectItem value="in">in</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          name="weight"
          value={form.weight ?? ""} // fallback to empty string if undefined
          onChange={(e) => {
            const val = e.target.value
            updateForm({ weight: val === "" ? undefined : +val })
          }}
          className="max-w-24"
          placeholder="Weight"
        />
        <Select
          defaultValue="kg"
          value={form.wUnit ?? ''}
          onValueChange={(val: "kg" | "g" | "lbs") => updateForm({ wUnit: val })}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md p-3 space-y-3">
        <Label>What you wamt ?</Label>
        <RadioGroup
          className="flex ml-1"
          value={form.goal ?? ""}
          onValueChange={(value: "gain" | "loss") => updateForm({ goal: value })}
        >
          {["Gain", "Loss"].map((type) => (
            <div key={type} className="flex items-center gap-2">
              <RadioGroupItem value={type.toLowerCase()} id={type} />
              <Label htmlFor={type}>{type}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex gap-2">
        <Input
          type="number"
          name="target"
          value={form.target ?? ""} // fallback to empty string if undefined
          onChange={(e) => {
            const val = e.target.value
            updateForm({ target: val === "" ? undefined : +val })
          }}
          className="max-w-24"
          placeholder="Target"
        />
        <Select
          defaultValue="kg"
          value={form.tUnit ?? ""}
          onValueChange={(val: "kg" | "g" | "lbs") => updateForm({ tUnit: val })}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">kg</SelectItem>
            <SelectItem value="g">g</SelectItem>
            <SelectItem value="lbs">lbs</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default BodyInfo