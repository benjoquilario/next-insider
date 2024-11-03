import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { sessionAuth } from "@/db/queries/user"

export function useQueryUser() {
  const { data: session } = useSession()

  const userId = session?.user.id

  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => sessionAuth(),
  })
}
