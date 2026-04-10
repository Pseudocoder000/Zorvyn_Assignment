const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || ''

const buildUrl = (path) => {
  if (!API_BASE) return path
  return `${API_BASE.replace(/\/+$/, '')}${path}`
}

const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options)
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(body?.message || body?.error || response.statusText || 'Request failed')
  }

  return body
}

export const loginRequest = async (email, password) => {
  return fetchJson(buildUrl('/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
}

export const signupRequest = async (name, email, password) => {
  return fetchJson(buildUrl('/auth/signup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
}
