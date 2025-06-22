import axios from 'axios'
import { getToken, setToken, removeToken } from '@/lib/token.ts'

const baseUrl = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  res => res,
  async (error) => {
    const originalRequest = error.config
    // if 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh access token
        const { data } = await axios.post('/api/refresh-token', {}, {
          withCredentials: true // important to send refresh token cookie
        })

        const newAccessToken = data.accessToken
        setToken(newAccessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshErr) {
        // Refresh failed → logout user
        console.log("Failed")
        removeToken()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api