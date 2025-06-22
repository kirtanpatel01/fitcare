import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"

const formSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(16),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const res = await api.post('/user/signup', values)
      if (res.status === 201) {
        toast.success('User registered successfully.')
        navigate('/login')
      }
    } catch (error: any) {
      console.log(error)
      const message = error?.response?.data?.error || "Error while creating user!"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20">
      <Card className="max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Sign Up Page</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter your email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Choose strong password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Re-enter above password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} className="flex mx-auto">
                {isLoading ? "Registering..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm my-4">
            Already have an account ?{" "}
            <Link className="underline underline-offset-2 text-primary" to={'/login'}>Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}