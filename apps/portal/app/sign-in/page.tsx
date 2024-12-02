"use client"

import { EmailIcon } from "@repo/ui/icons"

import { useForm, type SubmitHandler } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { delay } from "@repo/ui/helpers"
import toast from "react-hot-toast"
import { signIn } from "next-auth/react"

type FormOutput = {
  identifier: string
}

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authCode = searchParams.get("code")
  const isPendingRef = useRef(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormOutput>()

  const onSubmit: SubmitHandler<FormOutput> = async (data) => {}

  useEffect(() => {
    if (isPendingRef.current) return
    isPendingRef.current = true

    const exchangeToken = async () => {
      if (authCode) {
        await delay(500) // Wait for half a second
        try {
          const res = await signIn("credentials", {
            code: authCode,
            redirect: false,
          })

          if (res?.error) {
            toast.error(res.error)
          } else if (res?.ok) {
            toast.success("Login successful")
            router.push("/")
          }
        } catch (error) {
          toast.error("Error exchanging token")
        }
      }
    }

    exchangeToken()
  }, [authCode, router])

  return (
    <div className="flex h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {authCode ? (
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Signing you in...
          </h2>
        ) : (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <label className="input input-bordered flex items-center gap-2">
                <EmailIcon />
                <input
                  type="text"
                  className="grow"
                  placeholder="Email, username or Id"
                  {...register("identifier", {
                    required: "Identifier is required",
                  })}
                />
              </label>
              {errors.identifier && (
                <p className="mt-2 text-sm text-red-600">{errors.identifier.message}</p>
              )}
              <div>
                <button type="submit" className="btn btn-neutral w-full" disabled={false}>
                  {"Send authorization link"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
