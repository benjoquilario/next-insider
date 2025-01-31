import { z } from "zod"
import { sub } from "date-fns"

const nonEmptyString = z
  .string()
  .trim()
  .min(3, { message: "Value must be at least three characters" })

export const userSchema = z.object({
  username: nonEmptyString.regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only alphanumeric characters and underscores are allowed",
  }),
  cover: z.string().optional(),
  image: z.string().optional(),
  name: nonEmptyString,
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
  birthDate: z.date({
    required_error: "A date of birth is required.",
  }),
})

export type UserSchema = z.infer<typeof userSchema>
