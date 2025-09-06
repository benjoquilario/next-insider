import * as React from "react"
import TextareaAutoSize from "react-textarea-autosize"
import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <TextareaAutoSize
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...(props as React.ComponentProps<typeof TextareaAutoSize>)}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
