"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ModeToggle } from "@/components/mode-toggle"
import api from "@/lib/api"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"
import { useFitcareForm } from "@/hooks/use-fitcare-form"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(16),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    useFitcareForm.getState().resetForm();
  }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const res = await api.post('/user/login', values)
      if (res.status === 200) {
        toast.success('Logged in successfully.')
        const token = res.data.accessToken
        login(token)
        if (res.data.user.hasOnboarded) {
          navigate('/dashboard')
        } else {
          navigate('/onboarding')
        }
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
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="absolute right-4 top-4">
        <ModeToggle />
      </div>

      <Card className="max-w-96 w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Login Page</CardTitle>
          {/* <CardDescription>Heyy, welcome to the my world!</CardDescription> */}
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full m-0">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="flex mx-auto mt-6">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm my-4">
            Don&apos;t have an account ?{" "}
            <Link className="underline underline-offset-2 text-primary" to={'/signup'}>Sign Up</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}