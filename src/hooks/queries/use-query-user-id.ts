import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/lib/metrics"

export function useQueryUserId(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById({ userId }),
  })
}
