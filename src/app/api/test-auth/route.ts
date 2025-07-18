import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return NextResponse.json({
    hasUrl: !!supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co',
    hasKey: !!supabaseAnonKey && supabaseAnonKey !== 'placeholder-key',
    urlPrefix: supabaseUrl?.substring(0, 20) + '...',
    keyPrefix: supabaseAnonKey?.substring(0, 20) + '...'
  })
}
