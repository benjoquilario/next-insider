"use client"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AiOutlineGoogle } from "react-icons/ai"
import { FiGithub } from "react-icons/fi"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  ICredentials,
  credentialsValidator,
} from "@/lib/validations/credentials"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { login } from "@/server/auth"

const Login = () => {
  const form = useForm<ICredentials>({
    resolver: zodResolver(credentialsValidator),
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  function handleOnSubmit(values: ICredentials) {
    setError("")
    startTransition(() => {
      login(values).then((data) => {
        if (data.error) {
          setError(data.error)
        }

        if (data.ok) {
          window.location.href = "/"
        }
      })
    })
  }

  return (
    <>
      <Card className="mx-2 w-[450px]">
        <CardHeader>
          <CardTitle className="text-2xl">Sign In to Insider!</CardTitle>
          <CardDescription>
            Select a method to sign in to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          <div className="grid w-full grid-cols-2 gap-3">
            <Button variant="outline">
              <AiOutlineGoogle aria-hidden="true" className="mr-2 size-4" />
              Google
            </Button>
            <Button variant="outline">
              <FiGithub aria-hidden="true" className="mr-2 size-4" />
              Github
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Form {...form}>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit(handleOnSubmit)}
            >
              <div className="flex flex-col gap-3.5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-3.5">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-2 text-destructive">{error}</div>
              <Button disabled={isPending} className="w-full" type="submit">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-1.5">
          <div className="mt-2 text-left text-sm">
            <span className="text-muted-foreground">
              Don&apos;t have an account yet?
            </span>
            <Link
              href="/register"
              className="ml-1 text-muted-foreground underline transition duration-200 ease-in-out hover:text-primary"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </>
  )
}

export default Login
