"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BookOpen, FileText, BarChart3, Settings, LogOut } from "lucide-react"

interface MainNavigationProps {
  user: any
  onLogout: () => void
}

export function MainNavigation({ user, onLogout }: MainNavigationProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/exams", label: "Exams", icon: FileText },
  ]

  if (user?.role === "admin") {
    navItems.push({ href: "/admin", label: "Admin", icon: Settings })
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold text-blue-600">
            EduPlatform
          </Link>
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm" className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Welcome, {user?.name || "Student"}</span>
          <Button variant="outline" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
