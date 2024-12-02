"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type NewUserFormData, newUserSchema } from "@repo/ui/form/schemas"
import createNewUser from "~/actions/create-new-user.action"
import { useServerAction } from "@repo/ui/hooks/use-server-action"
import { useTranslations } from "next-intl"
import { toast } from "react-hot-toast"
import useSingleEffect from "@repo/ui/hooks/use-single-effect.hook"
import LoadingButtonComponent from "@repo/ui/components/action-button.component"
import { useRouter } from "next/navigation"
import type { I18nKey } from "/types"
import { useState } from "react"
import getAllRoles from "~/actions/get-all-roles.action"
import { withPermission } from "@repo/access/client"

function NewUserPage() {
  const t = useTranslations("CreateUser")
  const router = useRouter()
  const { callAction, isPending, error } = useServerAction(createNewUser)
  const [roles, setRoles] = useState<{ id: string; name: I18nKey }[]>([])

  useSingleEffect(
    async () => {
      const rolesData = await getAllRoles()
      setRoles(rolesData)
    },
    [],
    [],
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewUserFormData>({
    resolver: zodResolver(newUserSchema),
  })

  const onSubmit = async (data: NewUserFormData) => {
    const userData = {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
    }

    await callAction(userData)
    toast.success(t("successCreating"))
    router.push("/users")
  }

  useSingleEffect(
    () => {
      toast.error(t((error?.message as I18nKey) ?? "genericError"))
    },
    error,
    [error],
  )

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          {errors.firstName && (
            <span className="text-error text-sm">{errors.firstName.message}</span>
          )}
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

        <div className="form-control">
          <label className="label" htmlFor="roleId">
            <span className="label-text">{t("role")}</span>
          </label>
          <select id="roleId" {...register("roleId")} className="select select-bordered">
            <option value="">{t("selectRole")}</option>
            {roles?.map((role) => (
              <option key={role.id} value={role.id}>
                {t(role.name)}
              </option>
            ))}
          </select>
          {errors.roleId && <span className="text-error text-sm">{errors.roleId.message}</span>}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="password">
            <span className="label-text">{t("password")}</span>
          </label>
          <input
            type="password"
            id="password"
            {...register("password")}
            className="input input-bordered"
          />
          {errors.password && <span className="text-error text-sm">{errors.password.message}</span>}
        </div>

        <div className="form-control">
          <label className="label" htmlFor="confirmPassword">
            <span className="label-text">{t("confirmPassword")}</span>
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
            className="input input-bordered"
          />
          {errors.confirmPassword && (
            <span className="text-error text-sm">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => {
              router.push("/users")
            }}
            className="btn btn-ghost"
          >
            {t("cancel")}
          </button>
          <LoadingButtonComponent type="submit" isLoading={isPending}>
            {t("create")}
          </LoadingButtonComponent>
        </div>
      </form>
    </div>
  )
}

export default withPermission("CREATE_USER", NewUserPage)
