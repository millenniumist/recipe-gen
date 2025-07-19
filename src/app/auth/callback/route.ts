import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error_param = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  
  console.log('OAuth callback - Code:', code)
  console.log('OAuth callback - Error:', error_param)
  console.log('OAuth callback - Error Description:', error_description)
  console.log('OAuth callback - Origin:', origin)
  console.log('OAuth callback - All params:', Object.fromEntries(searchParams.entries()))

  // Check for OAuth errors from Google
  if (error_param) {
    console.error('OAuth error from provider:', error_param, error_description)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error_param}`)
  }

  if (code) {
    try {
      const supabase = createClient()
      console.log('Attempting to exchange code for session...')
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      console.log('Exchange result - Data:', data)
      console.log('Exchange result - Error:', error)
      
      if (!error && data.session) {
        console.log('OAuth success! Redirecting to dashboard')
        return NextResponse.redirect(`${origin}/dashboard`)
      } else {
        console.error('Session exchange failed:', error)
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=session_exchange_failed`)
      }
    } catch (err) {
      console.error('Exception during code exchange:', err)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exception`)
    }
  }

  console.error('No code parameter found in callback')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code`)
}
