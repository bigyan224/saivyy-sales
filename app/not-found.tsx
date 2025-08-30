"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SalesFlow</h1>
        </div>

        <Card>
          <CardContent className="p-8 text-center space-y-6">
            {/* 404 Illustration */}
            <div className="space-y-4">
              <div className="text-6xl font-bold text-slate-300">404</div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Page Not Found</h2>
                <p className="text-slate-600">
                  Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered
                  the wrong URL.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/dashboard" className="block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Need help? Contact your system administrator or try searching for what you need.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-500">Common pages:</p>
          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
              Dashboard
            </Link>
            <Link href="/profile" className="text-blue-600 hover:text-blue-700">
              Profile
            </Link>
            <Link href="/admin" className="text-blue-600 hover:text-blue-700">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
