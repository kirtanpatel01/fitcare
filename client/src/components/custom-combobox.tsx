import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command"

type Option = {
  label: string
  value: string
}

type ComboBoxProps = {
  options: Option[]
  placeholder: string
  value: string
  onChange: (value: string) => void
}

export const CustomCombobox = ({
  options,
  placeholder,
  value,
  onChange,
}: ComboBoxProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-full justify-between">
          {value ? options.find((o) => o.value === value)?.label : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}`} />
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup className="max-h-[350px] overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
