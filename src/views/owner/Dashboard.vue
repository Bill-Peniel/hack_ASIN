<template>
  <div class="owner-dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">Tableau de bord Propriétaire</h1>
        <p class="text-muted">Bienvenue, {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</p>
      </div>
      <router-link to="/owner/add-property" class="btn btn-primary">
        <i class="fas fa-plus me-2"></i>Ajouter une propriété
      </router-link>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-primary text-white">
          <div class="stats-icon">
            <i class="fas fa-home"></i>
          </div>
          <div class="stats-content">
            <h3>{{ myProperties.length }}</h3>
            <p>Mes Propriétés</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-success text-white">
          <div class="stats-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="stats-content">
            <h3>{{ validatedProperties.length }}</h3>
            <p>Validées</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-warning text-white">
          <div class="stats-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stats-content">
            <h3>{{ pendingProperties.length }}</h3>
            <p>En attente</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-info text-white">
          <div class="stats-icon">
            <i class="fas fa-shopping-cart"></i>
          </div>
          <div class="stats-content">
            <h3>{{ propertiesForSale.length }}</h3>
            <p>En vente</p>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <!-- Recent Properties -->
      <div class="col-md-8">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">
              <i class="fas fa-home me-2"></i>
              Mes Propriétés Récentes
            </h5>
            <router-link to="/owner/properties" class="btn btn-sm btn-outline-primary">
              Voir toutes
            </router-link>
          </div>
          <div class="card-body">
            <div class="property-list">
              <div 
                class="property-item" 
                v-for="property in recentProperties" 
                :key="property.id"
                @click="$router.push(`/owner/property/${property.id}`)"
              >
                <div class="property-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="property-info">
                  <h6 class="mb-1">{{ property.title }}</h6>
                  <p class="mb-1 text-muted">{{ property.location.city }}, {{ property.location.region }}</p>
                  <small class="text-muted">{{ property.area }} m² • {{ property.type }}</small>
                </div>
                <div class="property-status">
                  <span class="badge" :class="getStatusBadgeClass(property.status)">
                    {{ getStatusLabel(property.status) }}
                  </span>
                  <div class="property-actions mt-2">
                    <button class="btn btn-sm btn-outline-primary me-1">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary">
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="myProperties.length === 0" class="text-center py-4">
              <i class="fas fa-home fa-3x text-muted mb-3"></i>
              <h6 class="text-muted">Aucune propriété enregistrée</h6>
              <p class="text-muted mb-3">Commencez par ajouter votre première propriété</p>
              <router-link to="/owner/add-property" class="btn btn-primary">
                <i class="fas fa-plus me-2"></i>Ajouter une propriété
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Alerts and Notifications -->
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-bell me-2"></i>
              Alertes
            </h5>
          </div>
          <div class="card-body">
            <div class="alert-list">
              <div class="alert-item" v-for="alert in alerts" :key="alert.id">
                <div class="alert-icon" :class="alert.iconClass">
                  <i :class="alert.icon"></i>
                </div>
                <div class="alert-content">
                  <p class="mb-1">{{ alert.message }}</p>
                  <small class="text-muted">{{ formatTime(alert.time) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-lightning-bolt me-2"></i>
              Actions Rapides
            </h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link to="/owner/add-property" class="btn btn-outline-primary">
                <i class="fas fa-plus me-2"></i>Ajouter une propriété
              </router-link>
              <router-link to="/owner/properties" class="btn btn-outline-secondary">
                <i class="fas fa-list me-2"></i>Gérer mes propriétés
              </router-link>
              <router-link to="/chat" class="btn btn-outline-info">
                <i class="fas fa-comments me-2"></i>Messages
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
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useChatStore } from '../../stores/chat'

const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const chatStore = useChatStore()

// Computed properties
const myProperties = computed(() => 
  propertiesStore.getPropertiesByOwner(authStore.user?.id || '')
)

const recentProperties = computed(() => 
  myProperties.value.slice(-3).reverse()
)

const validatedProperties = computed(() => 
  myProperties.value.filter(p => p.status === 'valide')
)

const pendingProperties = computed(() => 
  myProperties.value.filter(p => p.status === 'en_attente_validation')
)

const propertiesForSale = computed(() => 
  myProperties.value.filter(p => p.status === 'disponible')
)

const unreadMessages = computed(() => 
  chatStore.getUnreadCount(authStore.user?.id || '')
)

// Mock alerts
const alerts = ref([
  {
    id: 1,
    message: "Changement détecté sur votre terrain (Cocody)",
    time: new Date(Date.now() - 30 * 60 * 1000),
    icon: "fas fa-satellite",
    iconClass: "bg-warning"
  },
  {
    id: 2,
    message: "Nouveau message d'un acheteur intéressé",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: "fas fa-message",
    iconClass: "bg-info"
  },
  {
    id: 3,
    message: "Votre propriété à Bingerville a été validée",
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: "fas fa-check-circle",
    iconClass: "bg-success"
  }
])

const getStatusLabel = (status) => {
  const labels = {
    'en_attente_validation': 'En attente',
    'valide': 'Validée',
    'rejete': 'Rejetée',
    'disponible': 'En vente'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'en_attente_validation': 'bg-warning',
    'valide': 'bg-success',
    'rejete': 'bg-danger',
    'disponible': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

const formatTime = (time) => {
  const now = new Date()
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 60) {
    return `Il y a ${diffMins} min`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`
  } else {
    return time.toLocaleDateString()
  }
}
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

.property-list {
  max-height: 400px;
  overflow-y: auto;
}

.property-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.property-item:hover {
  background-color: #f8f9fa;
  margin: 0 -15px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
}

.property-item:last-child {
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

.property-info {
  flex: 1;
}

.property-info h6 {
  color: #333;
  font-weight: 600;
}

.property-status {
  text-align: right;
}

.property-actions {
  display: none;
}

.property-item:hover .property-actions {
  display: block;
}

.alert-list {
  max-height: 300px;
  overflow-y: auto;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.alert-content {
  flex: 1;
}

.bg-primary { background-color: #8B4513 !important; }
</style>
