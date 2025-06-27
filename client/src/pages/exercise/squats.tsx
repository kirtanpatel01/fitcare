import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export function Squats() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
  
    useEffect(() => {
      return () => {
        if (videoUrl) {
          URL.revokeObjectURL(videoUrl);
        }
      }
    }, [videoUrl]);
  
  
    const formSchema = z.object({
      inputVid: z.any()
    })
  
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    })
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      const file = values.inputVid?.[0];
      if (!file) return;
  
      const formData = new FormData();
      formData.append("file", file);
  
      setLoading(true);
  
      const response = await fetch("http://127.0.0.1:8000/analyze-video", {
        method: "POST",
        body: formData
      });
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      console.log(blob)
      console.log(url)
      setVideoUrl(url);
      setLoading(false);
    }

  return (
    <div className="flex gap-6 p-6">
      <Card className="w-fit h-fit">
        <CardHeader>
          <CardTitle>Squats</CardTitle>
        </CardHeader>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardContent>
              <FormField
                control={form.control}
                name="inputVid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose the video file</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => field.onChange(e.target.files)}
                        className="w-fit" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
            <Separator />
            <CardFooter className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Processing..." : "Analyze Video"}
              </Button>
              {videoUrl && (
                <a
                  href={videoUrl}
                  download="squat_analysis_output.mp4"
                >
                  <Button type="button" variant={"link"}>Download Video</Button>
                </a>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="w-fit">
        <CardHeader>
          <CardTitle>Live Stream (Real-time Analysis)</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isStreaming && (
            <img
              src="http://127.0.0.1:8000/live-stream"
              alt="Live Stream"
              className="w-full max-w-xl rounded-md border shadow-md"
            />
          )}
        </CardContent>

        <Separator />
        <CardFooter className="flex gap-4">
          <Button
            variant="default"
            onClick={async () => {
              await fetch("http://127.0.0.1:8000/start-stream");
              setIsStreaming(true); // show the <img>
            }}
          >
            Start Stream
          </Button>

          <Button
            variant="destructive"
            onClick={async () => {
              await fetch("http://127.0.0.1:8000/stop-stream");
              setIsStreaming(false); // hide the <img>
            }}
          >
            Stop Stream
          </Button>

          <a
            href="http://127.0.0.1:8000/download-live-output"
            download="squat_live_output.mp4"
          >
            <Button variant="secondary">Download Recorded Video</Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
