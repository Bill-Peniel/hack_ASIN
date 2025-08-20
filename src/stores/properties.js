import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockProperties } from '../data/mockData'

export const usePropertiesStore = defineStore('properties', () => {
  const properties = ref([...mockProperties])
  const loading = ref(false)

  const getPropertiesByOwner = (ownerId) => {
    return properties.value.filter(p => p.ownerId === ownerId)
  }

  const getAvailableProperties = () => {
    return properties.value.filter(p => p.status === 'disponible')
  }

  const getPropertyById = (id) => {
    return properties.value.find(p => p.id === id)
  }

  const addProperty = async (propertyData) => {
    loading.value = true
    try {
      const newProperty = {
        id: Date.now().toString(),
        ...propertyData,
        createdAt: new Date().toISOString(),
        status: 'en_attente_validation',
        documents: propertyData.documents || [],
        satelliteImages: {
          current: '/api/mock/satellite/current.jpg',
          previous: '/api/mock/satellite/previous.jpg',
          changeDetected: false
        }
      }
      properties.value.push(newProperty)
      return newProperty
    } finally {
      loading.value = false
    }
  }

  const updateProperty = (id, updates) => {
    const index = properties.value.findIndex(p => p.id === id)
    if (index !== -1) {
      properties.value[index] = { ...properties.value[index], ...updates }
    }
  }

  const validateProperty = (id, isValid) => {
    updateProperty(id, { 
      status: isValid ? 'valide' : 'rejete',
      validatedAt: new Date().toISOString()
    })
  }

  const putPropertyForSale = (id, saleData) => {
    updateProperty(id, {
      status: 'disponible',
      price: saleData.price,
      description: saleData.description,
      forSale: true
    })
  }

  const searchProperties = (filters) => {
    let results = properties.value.filter(p => p.status === 'disponible')
    
    if (filters.location) {
      results = results.filter(p => 
        p.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.location.region.toLowerCase().includes(filters.location.toLowerCase())
      )
    }
    
    if (filters.minPrice) {
      results = results.filter(p => p.price >= filters.minPrice)
    }
    
    if (filters.maxPrice) {
      results = results.filter(p => p.price <= filters.maxPrice)
    }
    
    if (filters.type) {
      results = results.filter(p => p.type === filters.type)
    }
    
    return results
  }

  return {
    properties,
    loading,
    getPropertiesByOwner,
    getAvailableProperties,
    getPropertyById,
    addProperty,
    updateProperty,
    validateProperty,
    putPropertyForSale,
    searchProperties
  }
})
