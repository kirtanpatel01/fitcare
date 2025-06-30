import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useSuggetion } from "@/context/SuggetionsContext"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/api"
import { markActiveDay } from "@/lib/actions"

function ExercisePage() {
  const { suggetions, isLoading } = useSuggetion()
  const [performance, setPerformance] = useState<any[]>([])
  const [inputEnabled, setInputEnabled] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const [saving, setSaving] = useState(false)
 
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(() => setTimer((prev) => prev + 1), 1000)
      setIntervalId(id)
    } else if (!isRunning && intervalId) {
      clearInterval(intervalId)
    }
    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
    setInputEnabled(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleChange = (index: number, setIndex: number, value: number) => {
    setPerformance((prev) => {
      const updated = [...prev]
      if (!updated[index]) updated[index] = { actual: [], efficiency: 0 }
      updated[index].actual[setIndex] = value
      return updated
    })
  }

  const handleUpdate = (index: number) => {
    const exercise = suggetions?.exercise[index]
    if (!exercise) return

    const actual = performance[index]?.actual || []
    const expected = Array(exercise.sets).fill(
      exercise.type === "duration" ? exercise.duration_seconds : exercise.reps_per_set
    )

    const totalActual = actual.reduce((a: number, b: number) => a + b, 0)
    const totalExpected = expected.reduce((a: number, b: number) => a + b, 0)
    const efficiency = Math.min((totalActual / totalExpected) * 100, 100)

    setPerformance((prev) => {
      const updated = [...prev]
      if (!updated[index]) updated[index] = {}
      updated[index].efficiency = efficiency
      return updated
    })
  }

  const handleSaveAll = async () => {
    const totalEfficiency = performance.reduce((sum, p) => sum + (p?.efficiency || 0), 0) / (performance.length || 1)
    const totalTime = timer
    setIsRunning(false)
    console.log("Total Efficiency:", Math.round(totalEfficiency) + "%")
    console.log("Total Time:", totalTime + "s")

    const payload = {
      efficiency: Math.round(totalEfficiency),
      time: totalTime
    }
    
    try {
      setSaving(true)
      await markActiveDay()
      const res = await api.post('/exercise/save', { payload })
      if(res.status === 201) {
        toast.success("Exercise Data saved.")
      }
    } catch (error) {
      console.log("Error while saving the exrecise data: ", error)
      toast.error("Error while saving the exrecise data!")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button onClick={handleStart} disabled={isRunning}>Start</Button>
        <Button onClick={handleStop} disabled={!isRunning}>Stop</Button>
        <span className="text-xl font-mono">Time: {timer}s</span>
      </div>

      <div className="border space-y-6">
        <ul className="flex flex-wrap gap-6 mx-6 mt-6">
          {suggetions?.exercise &&
            suggetions.exercise.map((exe, index) => (
              <Card key={index} className="w-sm h-fit">
                <CardHeader>
                  <CardTitle>{exe.name}</CardTitle>
                  <CardDescription>
                    {exe.type === "duration"
                      ? `${exe.sets} sets of ${exe.duration_seconds} seconds`
                      : `${exe.sets} sets of ${exe.reps_per_set} reps`}
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-2">
                  {[...Array(exe.sets)].map((_, setIndex) => (
                    <div key={setIndex} className="flex items-center gap-2">
                      <Input
                        type="number"
                        className="w-24"
                        placeholder="0"
                        disabled={!inputEnabled}
                        value={performance[index]?.actual?.[setIndex] || ""}
                        onChange={(e) => handleChange(index, setIndex, Number(e.target.value))}
                      />
                      <span>
                        / {exe.type === "duration" ? exe.duration_seconds + " sec" : exe.reps_per_set + " reps"}
                      </span>
                    </div>
                  ))}
                  {performance[index]?.efficiency !== undefined && (
                    <div className="text-green-600 font-semibold">
                      Efficiency: {performance[index].efficiency.toFixed(2)}%
                    </div>
                  )}
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-end">
                  <Button onClick={() => handleUpdate(index)} disabled={!inputEnabled}>Update</Button>
                </CardFooter>
              </Card>
            ))}
        </ul>

        <Separator />
        <div className="flex justify-center mb-6">
          <Button onClick={handleSaveAll} disabled={!performance.length || saving}>Save All</Button>
        </div>
      </div>

      {/* <Card className="w-fit">
        <CardHeader>
          <CardTitle>
            Squats
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <img
            src="https://t3.ftcdn.net/jpg/04/43/38/20/360_F_443382067_UD5yY1Lk9aJy9HWRAzzaUODnlWXTPOXI.jpg"
            alt="squat"
            className="max-w-48 rounded-md"
          />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-center">
          <Link to={"/exercise/squats"}>
            <Button className="cursor-pointer">
              Understand Squats
            </Button>
          </Link>
        </CardFooter>
      </Card> */}
    </div>
  )
}

export default ExercisePage
