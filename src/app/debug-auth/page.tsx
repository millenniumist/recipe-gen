'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'

export default function DebugAuth() {
  const handleDebugInfo = () => {
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Current origin:', window.location.origin)
    console.log('Expected callback URL:', `${window.location.origin}/auth/callback`)
    console.log('Supabase OAuth callback URL should be:', `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Debug Auth Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            <p><strong>Google Console should have:</strong></p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li><strong>Authorized JavaScript origins:</strong> https://recipe-generator-ten-brown.vercel.app</li>
              <li><strong>Authorized redirect URIs:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback</li>
            </ul>
          </div>
          <Button onClick={handleDebugInfo} className="w-full">
            Log Debug Info to Console
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
