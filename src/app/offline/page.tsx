'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChefHat, Wifi, WifiOff } from 'lucide-react'
import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <ChefHat className="h-16 w-16 text-orange-600" />
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <WifiOff className="h-6 w-6" />
            You're Offline
          </CardTitle>
          <CardDescription>
            Don't worry! You can still browse your saved recipes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Some features may be limited while you're offline. Please check your internet connection to access all features.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/dashboard">
              <Button className="w-full">View Saved Recipes</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">Try Again</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
