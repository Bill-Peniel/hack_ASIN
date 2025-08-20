<template>
  <div class="buyer-dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">Tableau de bord Acheteur</h1>
        <p class="text-muted">Bienvenue, {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
      </div>
      <router-link to="/buyer/marketplace" class="btn btn-primary">
        <i class="fas fa-search me-2"></i>Parcourir les propriétés
      </router-link>
    </div>

    <!-- Quick Search -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          <i class="fas fa-search me-2"></i>
          Recherche rapide
        </h5>
        <form @submit.prevent="performQuickSearch" class="row g-3">
          <div class="col-md-3">
            <select class="form-select" v-model="quickSearch.region">
              <option value="">Toutes les régions</option>
              <option value="Abidjan">Abidjan</option>
              <option value="Yamoussoukro">Yamoussoukro</option>
              <option value="Bouaké">Bouaké</option>
              <option value="San-Pedro">San-Pedro</option>
              <option value="Korhogo">Korhogo</option>
            </select>
          </div>
          <div class="col-md-3">
            <select class="form-select" v-model="quickSearch.type">
              <option value="">Tous les types</option>
              <option value="terrain_nu">Terrain nu</option>
              <option value="terrain_avec_batiment">Terrain avec bâtiment</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="commercial">Local commercial</option>
            </select>
          </div>
          <div class="col-md-3">
            <input
              type="number"
              class="form-control"
              placeholder="Budget max (FCFA)"
              v-model="quickSearch.maxPrice"
              step="1000000"
            >
          </div>
          <div class="col-md-3">
            <button type="submit" class="btn btn-primary w-100">
              <i class="fas fa-search me-2"></i>Rechercher
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-primary text-white">
          <div class="stats-icon">
            <i class="fas fa-home"></i>
          </div>
          <div class="stats-content">
            <h3>{{ availableProperties.length }}</h3>
            <p>Propriétés Disponibles</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-success text-white">
          <div class="stats-icon">
            <i class="fas fa-heart"></i>
          </div>
          <div class="stats-content">
            <h3>{{ favorites.length }}</h3>
            <p>Favoris</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-info text-white">
          <div class="stats-icon">
            <i class="fas fa-comments"></i>
          </div>
          <div class="stats-content">
            <h3>{{ activeChats.length }}</h3>
            <p>Conversations</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-warning text-white">
          <div class="stats-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="stats-content">
            <h3>{{ viewHistory.length }}</h3>
            <p>Vues Récentes</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Recent Properties -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="fas fa-clock me-2"></i>
              Propriétés Récemment Ajoutées
            </h5>
            <router-link to="/buyer/marketplace" class="btn btn-sm btn-outline-primary">
              Voir tout
            </router-link>
          </div>
          <div class="card-body">
            <div class="row">
              <div 
                class="col-md-6 mb-3" 
                v-for="property in recentProperties" 
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
            
            <div v-if="recentProperties.length === 0" class="text-center py-4">
              <i class="fas fa-home fa-3x text-muted mb-3"></i>
              <h6 class="text-muted">Aucune propriété récente</h6>
              <p class="text-muted mb-3">Explorez notre marketplace pour découvrir des propriétés</p>
              <router-link to="/buyer/marketplace" class="btn btn-primary">
                <i class="fas fa-search me-2"></i>Explorer les propriétés
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Favorites -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-heart me-2"></i>
              Mes Favoris
            </h5>
          </div>
          <div class="card-body">
            <div v-if="favorites.length > 0">
              <div 
                class="favorite-item"
                v-for="property in favorites.slice(0, 3)" 
                :key="property.id"
                @click="viewProperty(property.id)"
              >
                <div class="d-flex align-items-center">
                  <div class="property-icon me-3">
                    <i class="fas fa-map-marker-alt"></i>
                  </div>
                  <div class="flex-grow-1">
                    <h6 class="mb-1">{{ property.title }}</h6>
                    <small class="text-muted">{{ property.location.city }}, {{ property.location.region }}</small>
                    <div class="fw-bold text-primary">{{ formatPrice(property.price) }}</div>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3" v-if="favorites.length > 3">
                <button class="btn btn-sm btn-outline-primary">
                  Voir tous les favoris ({{ favorites.length }})
                </button>
              </div>
            </div>
            <div v-else class="text-center text-muted py-3">
              <i class="fas fa-heart fa-2x mb-2"></i>
              <p>Aucun favori</p>
            </div>
          </div>
        </div>

        <!-- Recent Messages -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-comments me-2"></i>
              Messages récents
            </h5>
          </div>
          <div class="card-body">
            <div v-if="recentMessages.length > 0">
              <div 
                class="message-item"
                v-for="message in recentMessages" 
                :key="message.id"
              >
                <div class="d-flex align-items-start">
                  <div class="avatar me-3">
                    {{ getOwnerInitials(message.senderId) }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <h6 class="mb-1">{{ getOwnerName(message.senderId) }}</h6>
                      <small class="text-muted">{{ formatTime(message.timestamp) }}</small>
                    </div>
                    <p class="mb-0 text-muted">{{ truncateMessage(message.content) }}</p>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3">
                <router-link to="/chat" class="btn btn-sm btn-outline-primary">
                  Voir toutes les conversations
                </router-link>
              </div>
            </div>
            <div v-else class="text-center text-muted py-3">
              <i class="fas fa-comments fa-2x mb-2"></i>
              <p>Aucun message</p>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-bolt me-2"></i>
              Actions Rapides
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/buyer/marketplace" class="btn btn-outline-primary">
                <i class="fas fa-search me-2"></i>Rechercher des propriétés
              </router-link>
              <button class="btn btn-outline-secondary" @click="showSavedSearches">
                <i class="fas fa-bookmark me-2"></i>Recherches sauvegardées
              </button>
              <router-link to="/chat" class="btn btn-outline-info">
                <i class="fas fa-comments me-2"></i>Mes conversations
                <span class="badge bg-danger ms-2" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
              </router-link>
              <router-link to="/profile" class="btn btn-outline-secondary">
                <i class="fas fa-user me-2"></i>Mon profil
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useChatStore } from '../../stores/chat'
import { useUsersStore } from '../../stores/users'
import PropertyCard from '../../components/common/PropertyCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const chatStore = useChatStore()
const usersStore = useUsersStore()

const quickSearch = ref({
  region: '',
  type: '',
  maxPrice: ''
})

// Mock favorites and view history
const favorites = ref([])
const viewHistory = ref([])

const availableProperties = computed(() => 
  propertiesStore.getAvailableProperties()
)

const recentProperties = computed(() => 
  availableProperties.value
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
)

const activeChats = computed(() => 
  chatStore.getUserChats(authStore.user?.id || '')
)

const recentMessages = computed(() => {
  const userChats = activeChats.value
  const messages = []
  
  userChats.forEach(chat => {
    const chatMessages = chatStore.getChatMessages(chat.id)
    if (chatMessages.length > 0) {
      const lastMessage = chatMessages[chatMessages.length - 1]
      if (lastMessage.senderId !== authStore.user?.id) {
        messages.push(lastMessage)
      }
    }
  })
  
  return messages
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 3)
})

const unreadMessages = computed(() => 
  chatStore.getUnreadCount(authStore.user?.id || '')
)

const performQuickSearch = () => {
  const filters = {}
  if (quickSearch.value.region) filters.location = quickSearch.value.region
  if (quickSearch.value.type) filters.type = quickSearch.value.type
  if (quickSearch.value.maxPrice) filters.maxPrice = parseInt(quickSearch.value.maxPrice)
  
  router.push({
    path: '/buyer/marketplace',
    query: filters
  })
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

const getOwnerName = (userId) => {
  const user = usersStore.getUserById(userId)
  return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'
}

const getOwnerInitials = (userId) => {
  const user = usersStore.getUserById(userId)
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

const formatTime = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 60) {
    return `${diffMins}min`
  } else if (diffHours < 24) {
    return `${diffHours}h`
  } else {
    return time.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
  }
}

const truncateMessage = (message) => {
  return message.length > 50 ? message.substring(0, 50) + '...' : message
}

const showSavedSearches = () => {
  alert('Fonctionnalité des recherches sauvegardées à venir')
}

onMounted(() => {
  // Mock some favorites for demo
  const available = availableProperties.value
  if (available.length > 0) {
    favorites.value = available.slice(0, 2)
  }
})
</script>

<style scoped>
.stats-card {
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.stats-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stats-content h3 {
  margin: 0;
  font-size: 2rem;
  font-weight: bold;
}

.stats-content p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.favorite-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.favorite-item:hover {
  background-color: #f8f9fa;
  margin: 0 -15px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
}

.favorite-item:last-child {
  border-bottom: none;
}

.property-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.message-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.message-item:last-child {
  border-bottom: none;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.8rem;
}

.bg-primary { background-color: #8B4513 !important; }
</style>
