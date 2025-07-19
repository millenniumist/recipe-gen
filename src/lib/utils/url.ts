export const getBaseUrl = () => {
  // For production deployment
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
