"use client"

import { useFormStatus } from "react-dom"
import { Button } from "./ui/button"

type SubmitButtonProps = {
  children: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button {...props} disabled={pending} type="submit">
      {children}
    </Button>
  )
}
