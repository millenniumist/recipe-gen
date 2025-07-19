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

        // Check if we have an authorization code
        const code = searchParams.get('code')
        if (!code) {
          console.error('No authorization code found in URL')
          setError('No authorization code received from OAuth provider')
          return
        }

        console.log('Processing authorization code:', code)

        // Set up auth state listener first
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

        // Try to exchange the authorization code for a session
        console.log('Attempting to exchange code for session...')
        
        // Use the current URL (which contains the code) for session exchange
        const { data: exchangeData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        console.log('Exchange code result:', exchangeData, exchangeError)

        if (exchangeData.session) {
          console.log('Session established via code exchange!', exchangeData.session.user)
          subscription.unsubscribe()
          router.push('/dashboard')
          return
        } else if (exchangeError) {
          console.error('Error exchanging code for session:', exchangeError)
          setError(`Failed to exchange authorization code: ${exchangeError.message}`)
          return
        }

        // Alternative: Try getting session from URL hash/query
        console.log('Trying to get session from URL...')
        
        // Check if there's a session in the current state
        const { data: currentSession } = await supabase.auth.getSession()
        console.log('Current session check:', currentSession)
        
        if (currentSession.session) {
          console.log('Found existing session!')
          subscription.unsubscribe()
          router.push('/dashboard')
          return
        }

        // Wait a bit for any async auth processing
        console.log('Waiting for auth processing...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Final session check
        const { data: finalSession } = await supabase.auth.getSession()
        if (finalSession.session) {
          console.log('Session found after waiting!')
          subscription.unsubscribe()
          router.push('/dashboard')
          return
        }

        // If still no session after all attempts, set timeout
        setTimeout(async () => {
          const { data: timeoutSession } = await supabase.auth.getSession()
          if (!timeoutSession.session) {
            console.error('No session established within timeout period')
            subscription.unsubscribe()
            setError('Authentication timeout - failed to establish session. Please try signing in again.')
          }
        }, 8000) // 8 more seconds

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
