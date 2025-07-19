export const getBaseUrl = () => {
  // Check for Vercel deployment URL first
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  
  // For production deployment - hardcoded production URL
  if (process.env.NODE_ENV === 'production') {
    return 'https://recipe-generator-ten-brown.vercel.app'
  }
  
  // For development
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback
  return 'http://localhost:3000'
}

export const getCallbackUrl = () => {
  return `${getBaseUrl()}/auth/callback`
}

// Force production URL for OAuth (ignores localhost)
export const getProductionCallbackUrl = () => {
  return 'https://recipe-generator-ten-brown.vercel.app/auth/callback'
}
