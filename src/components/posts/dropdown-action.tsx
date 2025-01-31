import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Ellipsis, PencilLine, Trash, Bookmark } from "lucide-react"
import * as React from "react"

interface DropdownPostProps {
  onAlertOpen: () => void
  onAction: () => void
  className?: string
}

const DropdownAction = React.memo(
  ({ onAlertOpen, onAction, className }: DropdownPostProps) => {
    const handleOnAction = React.useCallback(() => {
      onAction()
    }, [onAction])

    return (
      <div className={className}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              type="button"
              className={cn(
                "rounded-full p-2 text-foreground/80 hover:text-foreground/90 active:scale-110"
              )}
              aria-label="open modal post"
            >
              <Ellipsis aria-hidden="true" className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-full cursor-pointer justify-start text-sm"
                onClick={handleOnAction}
              >
                <PencilLine className="ml-2 size-5" />
                Edit
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                onClick={onAlertOpen}
                variant="ghost"
                size="sm"
                className="w-full cursor-pointer justify-start text-sm"
              >
                <Trash className="ml-2 size-5" /> Delete
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button
                size="sm"
                variant="ghost"
                className="w-full cursor-pointer justify-start text-sm"
              >
                <Bookmark className="ml-2 size-5" />
                Bookmark
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
)

DropdownAction.displayName = "DropdownAction"

export default DropdownAction
