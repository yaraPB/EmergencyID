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
  return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin
}
