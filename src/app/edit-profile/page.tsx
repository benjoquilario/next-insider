"use client"

import { useQueryUser } from "@/hooks/queries/use-query-user"
import React, { useMemo, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { userSchema } from "@/lib/validations/user"
import * as z from "zod"
import { CalendarIcon } from "@radix-ui/react-icons"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useUpdateDataMutation } from "@/hooks/useUpdateDataMutation"
import { useRouter } from "next/navigation"

type UserSchema = z.infer<typeof userSchema>

const EditProfile = () => {
  const { data: currentUser } = useQueryUser()
  const router = useRouter()

  const defaultValues = useMemo(
    () => ({
      username: currentUser?.username || currentUser?.id || "",
      name: currentUser?.name || "",
      phoneNumber: currentUser?.phoneNumber || null,
      bio: currentUser?.bio || null,
      website: currentUser?.website || "" || null,
      address: currentUser?.address || "" || null,
      gender: currentUser?.gender || "" || null,
      relationshipStatus: currentUser?.relationshipStatus || "" || null,
      birthDate: currentUser?.birthDate?.toString() || "" || null,
    }),
    [currentUser]
  )

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  })

  const { updateUserData } = useUpdateDataMutation()

  useEffect(() => {
    form.reset(defaultValues)
  }, [currentUser, form, defaultValues])

  const handleOnSubmit = function (data: UserSchema) {
    updateUserData.mutate(data, {
      onSuccess: () => {
        if (currentUser) router.push(`/profile/${currentUser.id}`)
      },
    })
  }

  return (
    <>
      <h1 className="mt-4 self-start text-3xl font-bold">Edit Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleOnSubmit)}
          className="mt-2 w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    ref={ref}
                    onChange={(value) => onChange(value)}
                    value={value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    ref={ref}
                    onChange={(value) => onChange(value)}
                    value={value}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    ref={ref}
                    onChange={(value) => onChange(value || null)}
                    value={value || ""}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    value={value || ""}
                    onChange={(value) => onChange(value || null)}
                    ref={ref}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    value={value || ""}
                    onChange={(value) => onChange(value || null)}
                    ref={ref}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="relationshipStatus"
            render={({ field: { onChange, value, ref } }) => (
              <FormItem>
                <FormLabel>Relationship Status</FormLabel>
                <FormControl>
                  <Input
                    disabled={updateUserData.isPending}
                    value={value || ""}
                    onChange={(value) => onChange(value || null)}
                    ref={ref}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={updateUserData.isPending}
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto size-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        // @ts-expect-error
                        selected={field.value || ""}
                        onSelect={(value) => field.onChange(value)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={updateUserData.isPending}>
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}

export default EditProfile
