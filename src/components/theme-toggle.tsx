"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "./ui/button"

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Moon className="hidden size-5 rotate-90 scale-0 transition-all dark:block dark:rotate-0 dark:scale-100" />
      <Sun className="h-6 w-[1.3rem] rotate-0 scale-100 transition-all dark:hidden dark:-rotate-90" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  )
}
