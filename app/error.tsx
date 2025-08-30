"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, RefreshCw, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

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
            {/* Error Illustration */}
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">Something went wrong</h2>
                <p className="text-slate-600">
                  We encountered an unexpected error. This has been logged and our team will look into it.
                </p>
              </div>
            </div>

            {/* Error Details (in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="p-3 bg-slate-100 rounded-lg text-left">
                <p className="text-xs font-mono text-slate-700 break-all">{error.message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={reset} className="w-full bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>

            {/* Help Text */}
            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                If this problem persists, please contact your system administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
