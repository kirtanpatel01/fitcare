import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { calories_data } from "@/lib/data"
import { X } from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Link } from "react-router-dom"
import { markActiveDay } from "@/lib/actions"

function DietPlanPage() {
  const [foods, setFoods] = useState<typeof calories_data>([])
  const [selectedTiming, setSelectedTiming] = useState<string>("breakfast")
  const [selectedFoods, setSelectedFoods] = useState<typeof calories_data>([])
  const [selectedFood, setSelectedFood] = useState<typeof calories_data[number] | undefined>(undefined)
  const [editableFood, setEditableFood] = useState<typeof calories_data[number] | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFood, setSearchFood] = useState<typeof calories_data[number] | undefined>(undefined);

  const timings = ["breakfast", "lunch", "dinner"]

  const handleSelection = (time: string = "breakfast") => {
    setSelectedTiming(time)
    const foodData = calories_data.filter(f => f.timing.includes(time))
    setFoods(foodData)
  }

  useEffect(() => {
    handleSelection("breakfast")
  }, [])

  const handleFoodClick = (food: typeof calories_data[number]) => {
    setSelectedFood(food)
    setEditableFood({ ...food })
  }

  const handleChangeCal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCalories = Number(e.target.value)
    if (!selectedFood || !editableFood) return

    const ratio = newCalories / selectedFood.calories
    const newQuantity = Number((selectedFood.quantity * ratio).toFixed(2))

    setEditableFood({
      ...editableFood,
      calories: newCalories,
      quantity: newQuantity,
    })
  }

  const handleChangeQty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Number(e.target.value)
    if (!selectedFood || !editableFood) return

    const ratio = newQuantity / selectedFood.quantity
    const newCalories = Number((selectedFood.calories * ratio).toFixed(2))

    setEditableFood({
      ...editableFood,
      quantity: newQuantity,
      calories: newCalories,
    })
  }

  const handleAddSelected = () => {
    if (!editableFood) return
    setSelectedFoods((prev) => [...prev, editableFood])
    setEditableFood(undefined)
    setSelectedFood(undefined)
  }

  const handleRemoveSelected = (index: number) => {
    const updated = [...selectedFoods]
    updated.splice(index, 1)
    setSelectedFoods(updated)
  }

  const handleSave = async () => {
    const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
    const payload = {
      timing: selectedTiming,
      calories: totalCalories,
    }

    try {
      setIsLoading(true)
      await markActiveDay()
      const res = await api.post('/calories/save', { payload })
      if (res.status === 201) {
        toast.success("Calories saved.");
        setSelectedFoods([])
      }
    } catch (error) {
      toast.error("Calories not saved.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      try {
        setIsLoading(true);
        // console.log(searchTerm)
        const res = await api.get(`/calories/search?query=${searchTerm}`);

        if (res.status === 200 && res.data?.parsed?.name) {
          setSearchFood(res.data.parsed);
          console.log(res.data.parsed);

          toast.success("Fetched details!");
          // setSearchTerm("");
        } else {
          toast.error("No food found.");
        }
      } catch {
        toast.error("Failed to fetch food data.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
  const totalQuantity = selectedFoods.reduce((sum, food) => sum + food.quantity, 0)

  const quantityUnit = selectedFoods[0]?.qtyUnit || "g"

  return (
    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-[1fr_.25fr] gap-6">
      <Link to={'/diet-plan/suggetions'} className="absolute top-18 right-6">
        <Button>
          See Our AI Suggetions
        </Button>
      </Link>
      <div className="flex flex-col flex-1 gap-4">
        {/* Timing Buttons */}
        <div className="flex gap-4">
          {timings.map((time) => (
            <Button
              key={time}
              onClick={() => handleSelection(time)}
              variant={selectedTiming === time ? "default" : "outline"}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </Button>
          ))}
        </div>

        <Command className="flex-1 overflow-hidden">
          <CommandInput
            value={searchTerm}
            onValueChange={setSearchTerm}
            onKeyDown={handleKeyDown}
            placeholder="Search the food..."
          />

          <CommandList className="sm:h-[calc(100vh-13rem)] overflow-y-auto">
            <CommandEmpty>
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <div>
                  {searchTerm && searchFood ? (
                    <Card
                      onClick={() => handleFoodClick(searchFood)}
                      className="max-w-48 cursor-pointer bg-card/50 hover:bg-card/100"
                    >
                      <CardHeader className="px-4">
                        <CardTitle>{searchFood?.name}</CardTitle>
                      </CardHeader>
                      <Separator />
                      <CardContent className="px-4">
                        <span>
                          {searchFood?.calories} cal - {searchFood?.quantity} {searchFood?.qtyUnit}
                        </span>
                      </CardContent>
                    </Card>
                  ) : (
                    <div>
                      Press
                      <span className="mx-1.5 bg-accent font-mono font-bold p-1 rounded-sm">
                        enter
                      </span>
                      to find calories for your food.
                    </div>
                  )}
                </div>
              )}
            </CommandEmpty>

            <CommandGroup>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 py-2">
                {foods.map((food) => (
                  <CommandItem
                    key={food.name}
                    onSelect={() => handleFoodClick(food)}
                    className="p-0"
                  >
                    <Card
                      onClick={() => handleFoodClick(food)}
                      className="w-full cursor-pointer bg-card/50 hover:bg-card/100"
                    >
                      <CardHeader className="px-4">
                        <CardTitle>{food.name}</CardTitle>
                      </CardHeader>
                      <Separator />
                      <CardContent className="px-4">
                        <span>
                          {food.calories} cal - {food.quantity} {food.qtyUnit}
                        </span>
                      </CardContent>
                    </Card>
                  </CommandItem>
                ))}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>


      {/* Selected Food Panel */}
      <div className="flex flex-col gap-6">
        <Card className="h-fit gap-4 sm:gap-6 py-4 sm:py-6 mt-16">
          {editableFood ? (
            <>
              <CardHeader className="px-4 sm:px-6">
                <CardTitle>{editableFood.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4 px-4 sm:px-6">
                <div className="flex gap-2">
                  <Input type="number" value={editableFood.calories} onChange={handleChangeCal} className="w-20" />
                  <Label>Calories</Label>
                </div>
                <span>-</span>
                <div className="flex gap-2">
                  <Input type="number" value={editableFood.quantity} onChange={handleChangeQty} className="w-20" />
                  <Label>{editableFood.qtyUnit.charAt(0).toUpperCase() + editableFood.qtyUnit.slice(1)}</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end px-4 sm:px-6">
                <Button onClick={handleAddSelected} className="cursor-pointer">Add</Button>
              </CardFooter>
            </>
          ) : (
            <CardHeader>
              <CardTitle>No food selected</CardTitle>
            </CardHeader>
          )}
        </Card>

        {/* Selected Foods */}
        {selectedFoods.length > 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Selected Foods:</h2>
              <ul className="flex flex-wrap gap-2 max-h-40 sm:max-h-96 overflow-y-auto">
                {selectedFoods.map((food, index) => (
                  <li
                    key={index}
                    className="border rounded-md w-fit h-fit space-x-2 p-1 px-2 flex items-center"
                  >
                    <span>{food.name}</span>
                    <Button
                      variant={"destructive"}
                      size={"icon"}
                      className="p-0 border-0 h-6 w-6 cursor-pointer"
                      onClick={() => handleRemoveSelected(index)}
                    >
                      <X />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary Box */}
            <Card className="px-4 py-4">
              <div className="flex flex-col gap-2">
                <div className="text-sm">
                  <span className="font-medium">Total Calories:</span> {totalCalories.toFixed(2)} kcal
                </div>
                <div className="text-sm">
                  <span className="font-medium">Total Quantity:</span> {totalQuantity.toFixed(2)} {quantityUnit}
                </div>
                <div className="flex justify-end mt-2">
                  <Button onClick={handleSave} disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default DietPlanPage
