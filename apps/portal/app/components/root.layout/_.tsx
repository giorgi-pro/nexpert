"use client"

import MenuComponent from "~/components/menu.component"
import Footer from "~/components/footer"
import Header from "~/components/header"

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr]">
      <div className="border-r-1">
        <MenuComponent />
      </div>
      <div className="grid grid-rows-[auto_1fr_auto] overflow-scroll">
        <div className="border-b-1">
          <Header />
        </div>
        <section className="relative h-full p-4">{props.children}</section>
        <Footer />
      </div>
    </div>
  )
}
