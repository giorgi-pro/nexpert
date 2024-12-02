"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useRef, useState } from "react"
import { type SignInFormData, signInSchema } from "@repo/ui/form/schemas"
import { issueNewAuthCodeAction } from "~/actions/issue-new-auth-code.action"
import { useServerAction } from "@repo/ui/hooks/use-server-action"
import { EmailIcon } from "@repo/ui"
import toast from "react-hot-toast"
import { useTranslations } from "next-intl"
import { useSearchParams, useRouter } from "next/navigation"
import { signInCodeSchema } from "./schemas"
import { signIn } from "next-auth/react"
import useSingleEffect from "@repo/ui/hooks/use-single-effect.hook"
import LoadingButton from "@repo/ui/components/action-button.component"
// import useLog from "@repo/ui/hooks/use-log.hook";

export default function SignInPage() {
  const t = useTranslations("SignIn")
  const searchParams = useSearchParams()
  const authCode = searchParams.get("code")
  const [errorOccurred, setErrorOccurred] = useState(false)
  const errorShown = useRef(false)
  const router = useRouter()

  const { callAction, isPending, error } = useServerAction(issueNewAuthCodeAction, {
    onSuccess: () => {
      toast.success(t("linkSent"))
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInFormData) => {
    callAction(data)
  }

  useEffect(() => {
    if (!error) return
    toast.error(t("errorSendingLink"))
    setErrorOccurred(true)
  }, [error, t])

  useEffect(() => {
    if (!authCode) return

    const parsed = signInCodeSchema.safeParse({ code: authCode })
    if (errorShown.current) return
    if (!parsed.success) {
      toast.error(t("invalidCode"))
      setErrorOccurred(true)
      errorShown.current = true
    }
  }, [authCode, t])

  useEffect(
    function removeCodeFromUrl() {
      if (!errorOccurred) return
      const url = new URL(window.location.href)
      url.searchParams.delete("code")
      router.replace(url.pathname)
    },
    [errorOccurred, router],
  )

  useSingleEffect(
    async function signInWithCode() {
      try {
        const res = await signIn("credentials", {
          code: authCode,
          redirect: false,
        })

        if (res?.error) {
          toast.error(t("errorSigningIn"))
        } else if (res?.ok) {
          toast.success(t("loginSuccessful"))
          router.push("/")
        }
      } catch (error) {
        toast.error(t("errorExchangingToken"))
      }
    },
    authCode,
    [authCode, router, t],
  )

  return (
    <div className="flex h-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {authCode ? (
          <h2 className="mt-6 text-center text-3xl font-extrabold">{t("signingYouIn")}</h2>
        ) : (
          <>
            <h2 className="mt-6 text-center text-3xl font-extrabold">{t("signInTitle")}</h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <label className="input input-bordered flex items-center gap-2">
                <EmailIcon />
                <input
                  type="email"
                  className="grow"
                  placeholder={t("emailPlaceholder")}
                  {...register("email")}
                />
              </label>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              <div>
                <LoadingButton className="w-full" isLoading={isPending} type="submit">
                  {t("signInButton")}
                </LoadingButton>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
