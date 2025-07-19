'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, ChefHat } from 'lucide-react'

function AuthCodeErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  
  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'session_exchange_failed':
        return 'Failed to exchange authorization code for session. Please check your Google OAuth configuration.'
      case 'exception':
        return 'An unexpected error occurred during authentication.'
      case 'no_code':
        return 'No authorization code received from Google.'
      case 'access_denied':
        return 'You denied access to your Google account.'
      default:
        return 'There was an error with Google authentication. Please try again.'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            {getErrorMessage(error)}
          </CardDescription>
          {error && (
            <div className="text-xs text-gray-500 mt-2">
              Error code: {error}
            </div>
          )}
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Link href="/login">
            <Button className="w-full">Try Login Again</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Go Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
}
