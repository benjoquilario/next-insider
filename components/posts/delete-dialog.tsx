"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import * as React from "react"

interface DeleteDialogProps {
  isAlertOpen: boolean
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>
  onHandleDelete: (id: string) => void
  isDisabled: boolean
  description: string
  id: string
}

const DeleteDialog = ({
  isAlertOpen,
  setIsAlertOpen,
  isDisabled,
  onHandleDelete,
  id,
  description,
}: DeleteDialogProps) => {
  const handleOnDelete = React.useCallback(() => {
    onHandleDelete(id)
  }, [onHandleDelete, id])

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="cursor-pointer"
              size="sm"
              disabled={isDisabled}
              onClick={handleOnDelete}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
export default DeleteDialog
