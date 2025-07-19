'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChefHat, Loader2 } from 'lucide-react'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('Client-side OAuth callback handler started')
        console.log('Current URL:', window.location.href)
        console.log('Search params:', Object.fromEntries(searchParams.entries()))

        // Check for OAuth error parameters
        const error_param = searchParams.get('error')
        const error_description = searchParams.get('error_description')
        
        if (error_param) {
          console.error('OAuth error from provider:', error_param, error_description)
          setError(`OAuth error: ${error_param} - ${error_description}`)
          return
        }

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state change:', event, session)
          
          if (event === 'SIGNED_IN' && session) {
            console.log('User signed in successfully!', session.user)
            subscription.unsubscribe()
            router.push('/dashboard')
          } else if (event === 'SIGNED_OUT') {
            console.log('User signed out')
          }
        })

        // Also check current session immediately
        const { data, error: authError } = await supabase.auth.getSession()
        console.log('Initial session check:', data, authError)
        
        if (data.session) {
          console.log('Session already exists, redirecting...')
          subscription.unsubscribe()
          router.push('/dashboard')
          return
        }

        // If no immediate session, wait for auth state change or timeout
        setTimeout(() => {
          const currentSessionCheck = async () => {
            const { data: currentData } = await supabase.auth.getSession()
            if (!currentData.session) {
              console.error('No session established within timeout period')
              subscription.unsubscribe()
              setError('Authentication timeout - no session established')
            }
          }
          currentSessionCheck()
        }, 10000) // 10 second timeout

        // Cleanup function
        return () => {
          subscription.unsubscribe()
        }
        
      } catch (err) {
        console.error('Exception in OAuth callback:', err)
        setError(`Unexpected error: ${String(err)}`)
      }
    }

    handleCallback()
  }, [router, searchParams])

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <ChefHat className="h-12 w-12 text-orange-600" />
          </div>
          <CardTitle>Completing Sign In...</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-600">Please wait while we complete your sign in.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}
