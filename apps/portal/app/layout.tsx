import "@repo/ui/styles/globals.css"
import { Inter } from "next/font/google"
import ClientLayout from "@repo/ui/components/root.layout"
import Footer from "@repo/ui/components/footer"
import Header from "@repo/ui/components/header"
import Menu from "@repo/ui/components/menu"
import { NextIntlClientProvider } from "next-intl"
import { getLocale, getMessages } from "next-intl/server"

const inter = Inter({ subsets: ["latin"] })

export default async function RootLayout({
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
          <div className="grid h-screen grid-cols-[auto_1fr]">
            <div className="border-r-1">
              <Menu />
            </div>
            <div className="grid grid-rows-[auto_1fr_auto] overflow-scroll">
              <div className="border-b-1">
                <Header />
              </div>
              <section className="relative h-full p-4">
                <ClientLayout>{children}</ClientLayout>
              </section>
              <Footer />
            </div>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
