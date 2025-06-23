"use client"
import { signOut } from "@/server/auth"
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
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

const SignOut = () => {
  const submit = async () => {
    await signOut()
  }

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className={cn(
              "flex w-full items-center justify-center rounded-md p-2 focus:outline-none md:w-auto md:justify-start md:space-x-3 md:px-5 md:py-3",
              "focus-visible:outline-primary focus-visible:outline-offset-2",
              "hover:bg-primary/40 transition duration-75"
            )}
          >
            <LogOut size={29} className="text-primary" />
            <span className="hidden text-left text-base font-medium tracking-tight capitalize md:block">
              Logout
            </span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really wish to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <form onSubmit={submit} className="w-full">
                <Button type="submit">Confirm</Button>
              </form>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SignOut
