import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockUsers } from '../data/mockData'

export const useUsersStore = defineStore('users', () => {
  const users = ref([...mockUsers])
  const loading = ref(false)

  const getAllUsers = () => {
    return users.value.map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  const getUserById = (id) => {
    const user = users.value.find(u => u.id === id)
    if (user) {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    }
    return null
  }

  const getUsersByRole = (role) => {
    return users.value.filter(u => u.role === role).map(user => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })
  }

  const updateUserStatus = (userId, status) => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.status = status
      user.updatedAt = new Date().toISOString()
    }
  }

  const validateUser = (userId) => {
    updateUserStatus(userId, 'actif')
  }

  const suspendUser = (userId) => {
    updateUserStatus(userId, 'suspendu')
  }

  const deleteUser = (userId) => {
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  const getPropertyOwners = () => {
    return getUsersByRole('proprietaire')
  }

  const getBuyers = () => {
    return getUsersByRole('acheteur')
  }

  return {
    users,
    loading,
    getAllUsers,
    getUserById,
    getUsersByRole,
    updateUserStatus,
    validateUser,
    suspendUser,
    deleteUser,
    getPropertyOwners,
    getBuyers
  }
})
