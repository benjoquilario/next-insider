import { z } from "zod"
import { sub } from "date-fns"
import { users } from "@/db/schema"
import { createSelectSchema } from "drizzle-zod"

export const userSelectSchema = createSelectSchema(users)

export type User = z.infer<typeof userSelectSchema>

const nonEmptyString = z
  .string()
  .trim()
  .min(3, { message: "Value must be at least three characters" })

export const userSchema = z.object({
  username: nonEmptyString.regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only alphanumeric characters and underscores are allowed",
  }),
  name: nonEmptyString,
  // email: nonEmptyString.email(),
  phoneNumber: nonEmptyString
    .regex(
      new RegExp(/^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/),
      { message: "Invalid phone number" }
    )
    .nullable(),
  bio: nonEmptyString.nullable(),
  website: nonEmptyString
    .regex(
      new RegExp(
        /^(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(?:\/[^\s]*)?$/
      ),
      { message: "Invalid website" }
    )
    .nullable(),
  address: nonEmptyString.nullable(),
  gender: z.union([z.literal("FEMALE"), z.literal("MALE")]).nullable(),
  relationshipStatus: z
    .union([
      z.literal("SINGLE"),
      z.literal("IN_A_RELATIONSHIP"),
      z.literal("ENGAGED"),
      z.literal("MARRIED"),
    ])
    .nullable(),
  birthDate: z.nullable(
    z.string().superRefine((value, ctx) => {
      const today = new Date()
      const selectedDate = new Date(value)

      const min = sub(today, { years: 85 })
      const max = sub(today, { years: 18 })

      if (selectedDate > max) {
        // you must be at least 18 years old
        ctx.addIssue({
          message: "You must be at least 18 years old",
          code: z.ZodIssueCode.invalid_date,
        })
      }

      if (selectedDate < min) {
        // you must be younger than
        ctx.addIssue({
          message: "You must be younger than 85 years old",
          code: z.ZodIssueCode.invalid_date,
        })
      }
    })
  ),
})

export type UserSchema = z.infer<typeof userSchema>
