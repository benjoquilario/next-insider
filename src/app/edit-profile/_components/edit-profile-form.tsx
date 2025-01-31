"use client"

import { type User } from "@prisma/client"
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
import * as React from "react"
import { updateUserInformation } from "@/server/user"
import { toast } from "sonner"

import { getErrorMessage } from "@/lib/handle-error"

interface EditProfileFormProps {
  editProfilePromise: Promise<User>
}

type UserSchema = z.infer<typeof userSchema>

const EditProfileForm = ({ editProfilePromise }: EditProfileFormProps) => {
  const user = React.use(editProfilePromise)

  const defaultValues = React.useMemo(
    () => ({
      username: user?.username || user?.id || "",
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || null,
      bio: user?.bio || null,
      website: user?.website || "" || null,
      address: user?.address || "" || null,
      gender: user?.gender || "" || null,
      relationshipStatus: user?.relationshipStatus || "" || null,
      birthDate: user?.birthDate as Date,
    }),
    [user]
  )

  console.log(defaultValues)

  const form = useForm<UserSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValues,
  })

  console.log(form.formState.errors)

  const submit = function (data: UserSchema) {
    toast.promise(updateUserInformation(data), {
      loading: "Saving...",
      success: () => {
        window.location.href = `/profile/${user.id}`

        return "Profile updated!"
      },
      error: (error) => getErrorMessage(error),
    })
    console.log(data)
  }

  return (
    <>
      <h1 className="mt-4 self-start text-3xl font-bold">Edit Profile</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                    disabled={form.formState.isSubmitSuccessful}
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
                          disabled={form.formState.isSubmitSuccessful}
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
                        selected={field.value}
                        onSelect={field.onChange}
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
          <Button type="submit" disabled={form.formState.isSubmitSuccessful}>
            Save
          </Button>
        </form>
      </Form>
    </>
  )
}
export default EditProfileForm
