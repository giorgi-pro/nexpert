"use client"

import { delay } from "@repo/ui/helpers"
import { useCallback, useState } from "react"

export type ActionStatus = "idle" | "pending" | "success" | "error"

const MINIMUM_ACTION_DELAY = 500

interface ServerActionOptions<A extends (...args: any[]) => any> {
  autoLoad?: boolean
  onSuccess?: (data: Awaited<ReturnType<A>>) => void
  onError?: (error: unknown) => void
  onSettled?: () => void
}

export const useServerAction = <A extends (...args: any[]) => any>(
  action: A,
  options?: ServerActionOptions<A>,
) => {
  const [status, setStatus] = useState<ActionStatus>("idle")
  const [error, setError] = useState<{ message: string } | null>(null)

  const callAction = useCallback(
    async (...params: Parameters<A>) => {
      setStatus("pending")
      setError(null)

      const [data] = await Promise.allSettled([action(...params), delay(MINIMUM_ACTION_DELAY)])
      if (data.status === "fulfilled") {
        options?.onSuccess?.(data.value)
        setStatus("success")
        options?.onSettled?.()
      } else {
        setError(data.reason as { message: string })
        options?.onError?.(data.reason)
        setStatus("error")
        options?.onSettled?.()
      }
    },
    [action, options],
  )

  return {
    isPending: ["pending"].includes(status),
    status,
    error,
    resetError: () => {
      setError(null)
      setStatus("idle")
    },
    callAction,
  }
}
