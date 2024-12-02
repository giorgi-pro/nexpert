import type en from "@repo/i18n/en"

type Messages = typeof en

declare global {
  interface IntlMessages extends Messages {}
}

declare module "next-auth" {
  interface Session {
    user?: {
      id: string
      email: string
      firstName: string
      lastName: string
      role: string
      permissions: string[]
    }
    expires: string
  }
}

export type User = Session["user"]

export type TFunction = <TargetKey extends MessageKeys<IntlMessages, keyof IntlMessages>>(
  key: TargetKey,
  values?: TranslationValues,
  formats?: Partial<Formats>,
) => string

export type I18nKey = MessageKeys<IntlMessages, keyof IntlMessages>
