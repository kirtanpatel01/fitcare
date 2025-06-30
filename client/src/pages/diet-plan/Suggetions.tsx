import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useSuggetion } from "@/context/SuggetionsContext";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { markActiveDay } from "@/lib/actions";

function Suggetions() {
  const { suggetions, isLoading } = useSuggetion();

  const [editStates, setEditStates] = useState<{
    [index: number]: boolean;
  }>({});
  const originalFoods = suggetions?.food?.map(f => ({ ...f })) || []
  const [editableFoods, setEditableFoods] = useState(() => originalFoods.map(f => ({ ...f })))
  const [backupFoods, setBackupFoods] = useState(() => originalFoods.map(f => ({ ...f })))

  const [savingIndex, setSavingIndex] = useState<number | null>(null);

  const handleEditClick = (index: number) => {
    setBackupFoods(prev => {
      const updated = [...prev];
      updated[index] = { ...editableFoods[index] };
      return updated;
    });
    setEditStates(prev => ({ ...prev, [index]: true }));
  };

  const handleCancel = (index: number) => {
    setEditableFoods(prev => {
      const updated = [...prev];
      updated[index] = { ...backupFoods[index] };
      return updated;
    });
    setEditStates(prev => ({ ...prev, [index]: false }));
  };

  const handleSave = async (index: number) => {
    const food = editableFoods[index];
    const payload = {
      timing: food.timing[0],
      calories: food.calories,
    };

    try {
      setSavingIndex(index);
      await markActiveDay()
      const res = await api.post("/calories/save", { payload });
      if (res.status === 201) {
        toast.success("Calories saved.");

        setEditableFoods(prev => {
          const updated = [...prev];
          updated[index] = { ...originalFoods[index] };
          return updated;
        });

        setBackupFoods(prev => {
          const updated = [...prev];
          updated[index] = { ...originalFoods[index] };
          return updated;
        });

        setEditStates(prev => ({ ...prev, [index]: false }));
      }
    } catch (error) {
      toast.error("Calories not saved.");
    } finally {
      setSavingIndex(null);
    }
  };

  const handleChangeCal = (index: number, newCal: number) => {
    const base = backupFoods[index];
    const ratio = newCal / (base.calories || 1);
    const newQty = Number((base.quantity * ratio).toFixed(2));

    setEditableFoods(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        calories: newCal,
        quantity: newQty,
      };
      return updated;
    });
  };

  const handleChangeQty = (index: number, newQty: number) => {
    const base = backupFoods[index];
    const ratio = newQty / (base.quantity || 1);
    const newCal = Number((base.calories * ratio).toFixed(2));

    setEditableFoods(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        quantity: newQty,
        calories: newCal,
      };
      return updated;
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!suggetions?.food) return <div>No suggestions found.</div>;

  return (
    <div className="p-6">
      <ul className="gap-6 flex flex-wrap">
        {editableFoods.map((food, index) => {
          const isEditing = editStates[index] || false;
          return (
            <Card key={index} className="w-sm">
              <CardHeader>
                <CardTitle>{food.name}</CardTitle>
                <CardDescription>{food.timing?.join(", ")}</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Input
                        type="number"
                        value={food.calories}
                        onChange={e => handleChangeCal(index, Number(e.target.value))}
                        className="w-24"
                      />
                      <span>Calories</span>
                    </>
                  ) : (
                    <span>
                      <strong>Calories:</strong> {food.calories}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <Input
                        type="number"
                        value={food.quantity}
                        onChange={e => handleChangeQty(index, Number(e.target.value))}
                        className="w-24"
                      />
                      <span>Quantity ({food.qtyUnit})</span>
                    </>
                  ) : (
                    <span>
                      <strong>Quantity:</strong> {food.quantity} {food.qtyUnit}
                    </span>
                  )}
                </div>
              </CardContent>
              <Separator />
              <CardFooter className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" onClick={() => handleCancel(index)}>
                      Cancel
                    </Button>
                    <Button onClick={() => handleSave(index)} disabled={savingIndex === index}>
                      {savingIndex === index ? "Saving..." : "Save"}
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => handleEditClick(index)} className="w-full cursor-pointer">
                    Add meal to the daily intake
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </ul>
    </div>
  );
}

export default Suggetions;
