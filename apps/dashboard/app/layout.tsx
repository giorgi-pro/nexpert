import "@repo/ui/styles/globals.css"
import { Inter } from "next/font/google"
import RootLayout from "~/components/root.layout"
import InitLayout from "@repo/ui/components/init.layout"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

const inter = Inter({ subsets: ["latin"] })

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale} className="antialiased">
      <body className={`${inter.className}`}>
        <NextIntlClientProvider messages={messages}>
          <InitLayout>
            <RootLayout>{children}</RootLayout>
          </InitLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
