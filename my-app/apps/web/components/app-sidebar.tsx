'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@workspace/ui/components/sidebar"
import { Eclipse, Folder, FolderCheck, Moon, Sidebar as SidebarIcon, UserRound } from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@workspace/ui/components/button"
import { usePathname } from 'next/navigation'

// Menu items
const items = [
    {
        title: "Projects",
        url: "/projects",
        icon: Folder,
    },
    {
        title: "Tasks",
        url: "/tasks",
        icon: FolderCheck,
    },
    {
        title: "Profile",
        url: "/profiles",
        icon: UserRound,
    },
]

export function AppSidebar() {
    const { setTheme } = useTheme()
    const pathname = usePathname()

    return (
        <Sidebar variant="sidebar" suppressHydrationWarning>
            <SidebarHeader className="h-16 border-b border-gray-600/10 flex items-center px-6 bg-gray-700">
                <span className="font-semibold text-xl tracking-tight text-amber-50 mt-auto">
                    Dashboard
                </span>
            </SidebarHeader>
            <SidebarContent className="bg-gray-700 w-64 text-gray-100">


                <SidebarGroup className="mt-6">
                    <SidebarGroupContent>
                        <SidebarMenu className="px-3 space-y-1">
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`
                                                flex items-center px-4 py-3 rounded-lg text-sm font-medium
                                                transition-all duration-150 ease-in-out
                                                ${isActive
                                                    ? 'bg-gray-800 text-blue-400 border border-gray-700'
                                                    : 'hover:bg-gray-800 hover:text-gray-100'
                                                }
                                            `}
                                        >
                                            <Link href={item.url} className="flex items-center w-full">
                                                <item.icon className={`
                                                    w-5 h-5 mr-3
                                                    ${isActive ? 'text-blue-400' : 'text-gray-400'}
                                                `} />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="bg-gray-800 w-64 border-t border-gray-600/10">
                <SidebarMenu className="p-3 space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-150 ease-in-out"
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setTheme("light")}
                            >
                                <Eclipse className="mr-2 h-4 w-4 text-gray-400" />
                                <span>Light Mode</span>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-gray-100 transition-all duration-150 ease-in-out"
                        >
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={() => setTheme("dark")}
                            >
                                <Moon className="mr-2 h-4 w-4 text-gray-400" />
                                <span>Dark Mode</span>
                            </Button>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}