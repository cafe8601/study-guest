"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Target, LayoutDashboard, MessageSquare, Settings } from "lucide-react"

export function Navbar() {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 mx-auto">
                <Link href="/" className="flex items-center space-x-2 mr-8">
                    <Target className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">Study Quest</span>
                </Link>

                <div className="flex gap-6 flex-1">
                    <Link
                        href="/dashboard"
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                            isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        <span>대시보드</span>
                    </Link>
                    <Link
                        href="/chat"
                        className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                            isActive('/chat') ? 'text-primary' : 'text-muted-foreground'
                        }`}
                    >
                        <MessageSquare className="h-4 w-4" />
                        <span>AI 멘토</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}
