import { Geist, Geist_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import { SidebarProvider, SidebarTrigger } from "@workspace/ui/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/darkmode/theme-provider"
import { Toaster } from "@workspace/ui/components/sonner"
import { HydrationBoundary } from "@/components/hydration-boundary"
import { HydrationErrorSuppress } from "@/components/hydration-error-suppress"



const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased min-h-full bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HydrationErrorSuppress />
          <HydrationBoundary>
            <SidebarProvider>
              <AppSidebar />
              <main className="min-h-screen bg-background">
                <SidebarTrigger/>
                <div className="container mx-auto p-6">
                  {children}
                </div>
              </main>
              <Toaster />
            </SidebarProvider>
          </HydrationBoundary>
        </ThemeProvider>
      </body>
    </html>
  )
}
