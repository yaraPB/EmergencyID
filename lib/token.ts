const TOKEN_KEY = 'eid_owner_token'

export function getOwnerToken(): string {
  if (typeof window === 'undefined') return ''

  let token = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(TOKEN_KEY, token)
  }
  return token
}

export function getBaseUrl(): string {
  // Priority: 
  // 1. Environment variable (for production)
  // 2. Current origin (for local browser)
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (typeof window !== 'undefined') return window.location.origin
  return 'http://localhost:3000'
}

export function isLocalhost(): boolean {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

