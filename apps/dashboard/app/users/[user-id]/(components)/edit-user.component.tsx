"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type EditUserFormData, editUserSchema } from "@repo/ui/form/schemas"
import editUser from "~/actions/edit-user.action"
import { useServerAction } from "@repo/ui/hooks/use-server-action"
import { useTranslations } from "next-intl"
import { toast } from "react-hot-toast"
import useSingleEffect from "@repo/ui/hooks/use-single-effect.hook"
import LoadingButtonComponent from "@repo/ui/components/action-button.component"
import { useRouter } from "next/navigation"
import type { I18nKey } from "/types"
import { useEffect } from "react"

type EditUserProps = {
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
  },
  onSubmit: () => void
}

export default function EditUserComponent(props: EditUserProps) {
  const t = useTranslations("EditUser")
  const router = useRouter()
  const { callAction, isPending, error } = useServerAction(editUser)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  })

  useEffect(() => {
    reset({
      id: props.user.id,
      email: props.user.email,
      firstName: props.user.firstName,
      lastName: props.user.lastName,
    })
  }, [props.user, reset])

  const onSubmit = async (data: EditUserFormData) => {
    const userData = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    }

    await callAction(userData)
    toast.success(t("successEditing"))
    props.onSubmit()
  }

  useSingleEffect(
    () => {
      toast.error(t((error?.message as I18nKey) ?? "genericError"))
    },
    error,
    [error],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div className="form-control">
        <label className="label" htmlFor="email">
          <span className="label-text">{t("email")}</span>
        </label>
        <input id="email" type="email" {...register("email")} className="input input-bordered" />
        {errors.email && <span className="text-error text-sm">{errors.email.message}</span>}
      </div>

      <div className="form-control">
        <label className="label" htmlFor="first_name">
          <span className="label-text">{t("firstName")}</span>
        </label>
        <input
          id="first_name"
          type="text"
          {...register("firstName")}
          className="input input-bordered"
        />
        {errors.firstName && <span className="text-error text-sm">{errors.firstName.message}</span>}
      </div>

      <div className="form-control">
        <label className="label" htmlFor="last_name">
          <span className="label-text">{t("lastName")}</span>
        </label>
        <input
          id="last_name"
          type="text"
          {...register("lastName")}
          className="input input-bordered"
        />
        {errors.lastName && <span className="text-error text-sm">{errors.lastName.message}</span>}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push(`/users/${props.user.id}`)}
          className="btn btn-ghost"
        >
          {t("cancel")}
        </button>
        <LoadingButtonComponent type="submit" isLoading={isPending}>
          {t("save")}
        </LoadingButtonComponent>
      </div>
    </form>
  )
}
