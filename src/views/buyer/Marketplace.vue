<template>
  <div class="marketplace">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">Marketplace</h1>
        <p class="text-muted">{{ filteredProperties.length }} propriété(s) disponible(s)</p>
      </div>
      <button class="btn btn-outline-primary" @click="showAdvancedSearch = !showAdvancedSearch">
        <i class="fas fa-sliders-h me-2"></i>
        {{ showAdvancedSearch ? 'Masquer' : 'Recherche avancée' }}
      </button>
    </div>

    <!-- Search Filters -->
    <div class="card mb-4" v-show="showAdvancedSearch">
      <div class="card-body">
        <form @submit.prevent="applyFilters" class="row g-3">
          <div class="col-md-3">
            <label class="form-label">Région</label>
            <select class="form-select" v-model="filters.region">
              <option value="">Toutes les régions</option>
              <option value="Abidjan">Abidjan</option>
              <option value="Yamoussoukro">Yamoussoukro</option>
              <option value="Bouaké">Bouaké</option>
              <option value="San-Pedro">San-Pedro</option>
              <option value="Korhogo">Korhogo</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Ville</label>
            <input
              type="text"
              class="form-control"
              placeholder="Ex: Cocody"
              v-model="filters.city"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Type de propriété</label>
            <select class="form-select" v-model="filters.type">
              <option value="">Tous les types</option>
              <option value="terrain_nu">Terrain nu</option>
              <option value="terrain_avec_batiment">Terrain avec bâtiment</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="commercial">Local commercial</option>
              <option value="agricole">Terrain agricole</option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label">Surface min (m²)</label>
            <input
              type="number"
              class="form-control"
              placeholder="Ex: 500"
              v-model="filters.minArea"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Prix min (FCFA)</label>
            <input
              type="number"
              class="form-control"
              placeholder="Ex: 1000000"
              v-model="filters.minPrice"
              step="100000"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Prix max (FCFA)</label>
            <input
              type="number"
              class="form-control"
              placeholder="Ex: 50000000"
              v-model="filters.maxPrice"
              step="100000"
            >
          </div>
          <div class="col-md-3">
            <label class="form-label">Tri par</label>
            <select class="form-select" v-model="sortBy">
              <option value="newest">Plus récent</option>
              <option value="oldest">Plus ancien</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
              <option value="area_asc">Surface croissante</option>
              <option value="area_desc">Surface décroissante</option>
            </select>
          </div>
          <div class="col-md-3 d-flex align-items-end">
            <button type="submit" class="btn btn-primary me-2">
              <i class="fas fa-search me-2"></i>Rechercher
            </button>
            <button type="button" class="btn btn-outline-secondary" @click="clearFilters">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Quick Filters -->
    <div class="quick-filters mb-4">
      <button 
        class="btn btn-sm me-2 mb-2"
        :class="filters.type === 'terrain_nu' ? 'btn-primary' : 'btn-outline-primary'"
        @click="quickFilter('type', 'terrain_nu')"
      >
        Terrains nus
      </button>
      <button 
        class="btn btn-sm me-2 mb-2"
        :class="filters.type === 'maison' ? 'btn-primary' : 'btn-outline-primary'"
        @click="quickFilter('type', 'maison')"
      >
        Maisons
      </button>
      <button 
        class="btn btn-sm me-2 mb-2"
        :class="filters.region === 'Abidjan' ? 'btn-primary' : 'btn-outline-primary'"
        @click="quickFilter('region', 'Abidjan')"
      >
        Abidjan
      </button>
      <button 
        class="btn btn-sm me-2 mb-2"
        :class="filters.maxPrice === 10000000 ? 'btn-primary' : 'btn-outline-primary'"
        @click="quickFilter('maxPrice', 10000000)"
      >
        < 10M FCFA
      </button>
      <button 
        class="btn btn-sm me-2 mb-2"
        :class="activeFilters.length === 0 ? 'btn-secondary' : 'btn-outline-secondary'"
        @click="clearFilters"
        :disabled="activeFilters.length === 0"
      >
        Effacer filtres
      </button>
    </div>

    <!-- Active Filters -->
    <div class="active-filters mb-3" v-if="activeFilters.length > 0">
      <small class="text-muted me-2">Filtres actifs:</small>
      <span 
        v-for="filter in activeFilters" 
        :key="filter.key"
        class="badge bg-secondary me-2"
      >
        {{ filter.label }}
        <button 
          class="btn-close btn-close-white ms-2" 
          @click="removeFilter(filter.key)"
          style="font-size: 0.6rem;"
        ></button>
      </span>
    </div>

    <!-- Properties Grid -->
    <div class="row" v-if="filteredProperties.length > 0">
      <div 
        class="col-md-6 col-lg-4 mb-4" 
        v-for="property in paginatedProperties" 
        :key="property.id"
      >
        <PropertyCard 
          :property="property" 
          :show-owner="true"
          @view="viewProperty"
          @contact="contactOwner"
          @favorite="toggleFavorite"
        />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <i class="fas fa-search fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Aucune propriété trouvée</h5>
      <p class="text-muted mb-3">Essayez de modifier vos critères de recherche</p>
      <button class="btn btn-outline-primary" @click="clearFilters">
        <i class="fas fa-times me-2"></i>Effacer tous les filtres
      </button>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="currentPage--" :disabled="currentPage === 1">
            Précédent
          </button>
        </li>
        <li 
          v-for="page in visiblePages" 
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="currentPage = page">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="currentPage++" :disabled="currentPage === totalPages">
            Suivant
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useChatStore } from '../../stores/chat'
import PropertyCard from '../../components/common/PropertyCard.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const chatStore = useChatStore()

const showAdvancedSearch = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

const filters = ref({
  region: '',
  city: '',
  type: '',
  minArea: '',
  maxArea: '',
  minPrice: '',
  maxPrice: ''
})

const sortBy = ref('newest')

// Mock favorites for demo
const favorites = ref([])

const filteredProperties = computed(() => {
  let properties = propertiesStore.getAvailableProperties()
  
  // Apply filters
  if (filters.value.region) {
    properties = properties.filter(p => 
      p.location.region.toLowerCase().includes(filters.value.region.toLowerCase())
    )
  }
  
  if (filters.value.city) {
    properties = properties.filter(p => 
      p.location.city.toLowerCase().includes(filters.value.city.toLowerCase())
    )
  }
  
  if (filters.value.type) {
    properties = properties.filter(p => p.type === filters.value.type)
  }
  
  if (filters.value.minArea) {
    properties = properties.filter(p => p.area >= parseInt(filters.value.minArea))
  }
  
  if (filters.value.maxArea) {
    properties = properties.filter(p => p.area <= parseInt(filters.value.maxArea))
  }
  
  if (filters.value.minPrice) {
    properties = properties.filter(p => p.price >= parseInt(filters.value.minPrice))
  }
  
  if (filters.value.maxPrice) {
    properties = properties.filter(p => p.price <= parseInt(filters.value.maxPrice))
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      break
    case 'oldest':
      properties.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'price_asc':
      properties.sort((a, b) => a.price - b.price)
      break
    case 'price_desc':
      properties.sort((a, b) => b.price - a.price)
      break
    case 'area_asc':
      properties.sort((a, b) => a.area - b.area)
      break
    case 'area_desc':
      properties.sort((a, b) => b.area - a.area)
      break
  }
  
  return properties
})

const totalPages = computed(() => 
  Math.ceil(filteredProperties.value.length / itemsPerPage)
)

const paginatedProperties = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProperties.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const activeFilters = computed(() => {
  const active = []
  
  if (filters.value.region) {
    active.push({ key: 'region', label: `Région: ${filters.value.region}` })
  }
  if (filters.value.city) {
    active.push({ key: 'city', label: `Ville: ${filters.value.city}` })
  }
  if (filters.value.type) {
    active.push({ key: 'type', label: `Type: ${filters.value.type}` })
  }
  if (filters.value.minPrice) {
    active.push({ key: 'minPrice', label: `Prix min: ${formatPrice(filters.value.minPrice)}` })
  }
  if (filters.value.maxPrice) {
    active.push({ key: 'maxPrice', label: `Prix max: ${formatPrice(filters.value.maxPrice)}` })
  }
  if (filters.value.minArea) {
    active.push({ key: 'minArea', label: `Surface min: ${filters.value.minArea}m²` })
  }
  
  return active
})

const quickFilter = (key, value) => {
  if (filters.value[key] === value) {
    filters.value[key] = ''
  } else {
    filters.value[key] = value
  }
  applyFilters()
}

const removeFilter = (key) => {
  filters.value[key] = ''
  applyFilters()
}

const clearFilters = () => {
  filters.value = {
    region: '',
    city: '',
    type: '',
    minArea: '',
    maxArea: '',
    minPrice: '',
    maxPrice: ''
  }
  currentPage.value = 1
}

const applyFilters = () => {
  currentPage.value = 1
  
  // Update URL with filters
  const query = {}
  Object.keys(filters.value).forEach(key => {
    if (filters.value[key]) {
      query[key] = filters.value[key]
    }
  })
  
  router.replace({ query })
}

const viewProperty = (propertyId) => {
  router.push(`/buyer/property/${propertyId}`)
}

const contactOwner = (property) => {
  const chat = chatStore.createChat(property.id, authStore.user?.id, property.ownerId)
  router.push(`/chat?chatId=${chat.id}`)
}

const toggleFavorite = (property) => {
  const index = favorites.value.findIndex(f => f.id === property.id)
  if (index === -1) {
    favorites.value.push(property)
  } else {
    favorites.value.splice(index, 1)
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

// Watch for route changes to apply filters from URL
watch(() => route.query, (newQuery) => {
  Object.keys(filters.value).forEach(key => {
    if (newQuery[key]) {
      filters.value[key] = newQuery[key]
    }
  })
}, { immediate: true })

// Reset to page 1 when filters change
watch(filteredProperties, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1
  }
})

onMounted(() => {
  // Load filters from URL query
  Object.keys(route.query).forEach(key => {
    if (filters.value.hasOwnProperty(key)) {
      filters.value[key] = route.query[key]
    }
  })
})
</script>

<style scoped>
.quick-filters {
  border-bottom: 1px solid #dee2e6;
  padding-bottom: 15px;
}

.active-filters {
  min-height: 30px;
}

.active-filters .badge {
  font-size: 0.8rem;
  padding: 8px 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.btn-primary {
  background-color: #8B4513;
  border-color: #8B4513;
}

.btn-primary:hover {
  background-color: #7A4012;
  border-color: #7A4012;
}

.btn-outline-primary {
  color: #8B4513;
  border-color: #8B4513;
}

.btn-outline-primary:hover {
  background-color: #8B4513;
  border-color: #8B4513;
}

.page-link {
  color: #8B4513;
}

.page-item.active .page-link {
  background-color: #8B4513;
  border-color: #8B4513;
}
</style>
