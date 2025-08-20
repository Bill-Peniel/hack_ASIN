import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUsers } from '../data/mockData'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (email, password) => {
    // Mock login - check against mock users
    const foundUser = mockUsers.find(u => u.email === email && u.password === password)
    if (foundUser) {
      user.value = { ...foundUser }
      delete user.value.password // Remove password from stored user
      isAuthenticated.value = true
      localStorage.setItem('user', JSON.stringify(user.value))
      return true
    }
    return false
  }

  const register = async (userData) => {
    // Mock registration
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    }
    mockUsers.push(newUser)
    
    // Auto-login after registration
    user.value = { ...newUser }
    delete user.value.password
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(user.value))
    return true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
  }

  const initializeMockSession = () => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  const updateProfile = (profileData) => {
    if (user.value) {
      user.value = { ...user.value, ...profileData }
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    initializeMockSession,
    updateProfile
  }
})
