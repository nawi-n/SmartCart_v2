import type React from "react"
import { MainNav } from "@/components/main-nav"
import { PersonaSidebar } from "@/components/persona-sidebar"
import { ChatButton } from "@/components/chat-button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex flex-1">
        <PersonaSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="container p-4 md:p-8">{children}</div>
        </main>
        <ChatButton />
      </div>
    </div>
  )
}
