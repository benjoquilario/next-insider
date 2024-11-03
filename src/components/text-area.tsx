"use client"

import React from "react"
import { cn } from "@/lib/utils"
import TextareaAutoSize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize"

interface TextAreaProps extends TextareaAutosizeProps {
  className?: string
  userName?: string
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return (
      <TextareaAutoSize
        className={cn(
          "w-full rounded-t-md bg-background px-0 py-3 text-sm text-foreground/90 focus:outline-none md:text-base"
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

TextArea.displayName = "TextArea"

export default TextArea
