"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, TrendingUp, Home, DollarSign, Calendar, User, Users, Settings, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { useClerk, UserButton } from "@clerk/nextjs"

interface MobileNavProps {
  currentUser: {
    name: string
    email: string
    role: string
  }
}

export function MobileNav({ currentUser }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/new-sale", icon: DollarSign, label: "New Sale" },
    { href: "/schedule-meeting", icon: Calendar, label: "Schedule Meeting" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  if (currentUser.role === "admin") {
    navItems.push({ href: "/admin", icon: Users, label: "Admin Panel" })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-3 pb-6 border-b">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">SalesFlow</h2>
              <p className="text-sm text-slate-600">TechCorp Solutions</p>
            </div>
          </div>

          {/* User Info */}
          <div className="py-6 border-b">
            <div className="flex items-center space-x-3">
              <Avatar>
                <UserButton/>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-sm text-slate-600 truncate">{currentUser.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {currentUser.role}
                  </Badge>
                  {currentUser.role === "admin" && <Shield className="w-3 h-3 text-blue-600" />}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="pt-6 border-t space-y-2">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => {
                setOpen(false)
                // Handle logout
              }}
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
