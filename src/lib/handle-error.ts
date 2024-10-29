import * as z from "zod"

export function getErrorMessage(err: unknown) {
  const unknownError = "An unknown error occurred. Please try again later."

  if (err instanceof z.ZodError) {
    return err.errors[0]?.message ?? unknownError
  } else if (err instanceof Error) {
    return err.message
  } else {
    return "An unknown error occurred. Please try again later."
  }
}
