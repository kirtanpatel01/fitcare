import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Squats } from "./squats"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

function ExercisePage() {
  return (
    <div>
      {/* <Card className="w-fit">
        <CardHeader>
          <CardTitle>Squat</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent>
          <img 
            src="https://media.istockphoto.com/id/1327765561/photo/man-exercising-at-home.jpg?s=612x612&w=0&k=20&c=gLyU7kx_Aq_Z54hBZaDjQZB6Tiltuje8wAztlYpVlq8=" 
            alt="squat"
            className="aspect-auto w-48 rounded-md"
          />
        </CardContent>
        <Separator />
        <CardFooter className="flex justify-end">
          <Button className="cursor-pointer">Go</Button>
        </CardFooter>
      </Card> */}
      <Squats />
    </div>
  )
}

export default ExercisePage