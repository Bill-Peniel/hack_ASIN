<template>
  <div class="admin-dashboard">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Tableau de bord Administrateur</h1>
      <div class="d-flex gap-2">
        <span class="badge bg-success">En ligne</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-primary text-white">
          <div class="stats-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stats-content">
            <h3>{{ totalUsers }}</h3>
            <p>Utilisateurs Total</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-success text-white">
          <div class="stats-icon">
            <i class="fas fa-home"></i>
          </div>
          <div class="stats-content">
            <h3>{{ totalProperties }}</h3>
            <p>Propriétés</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-warning text-white">
          <div class="stats-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stats-content">
            <h3>{{ pendingValidations }}</h3>
            <p>En attente</p>
          </div>
        </div>
      </div>
      <div class="col-md-3 mb-3">
        <div class="stats-card bg-info text-white">
          <div class="stats-icon">
            <i class="fas fa-exchange-alt"></i>
          </div>
          <div class="stats-content">
            <h3>{{ totalTransactions }}</h3>
            <p>Transactions</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-clock me-2"></i>
              Activités Récentes
            </h5>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div class="activity-item" v-for="activity in recentActivities" :key="activity.id">
                <div class="activity-icon" :class="activity.iconClass">
                  <i :class="activity.icon"></i>
                </div>
                <div class="activity-content">
                  <p class="mb-1">{{ activity.description }}</p>
                  <small class="text-muted">{{ formatTime(activity.time) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Actions Requises
            </h5>
          </div>
          <div class="card-body">
            <div class="list-group list-group-flush">
              <router-link 
                to="/admin/users" 
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <i class="fas fa-user-check me-2"></i>
                  Valider nouveaux utilisateurs
                </div>
                <span class="badge bg-primary rounded-pill">{{ pendingUsers }}</span>
              </router-link>
              
              <router-link 
                to="/admin/properties" 
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <i class="fas fa-home me-2"></i>
                  Valider propriétés
                </div>
                <span class="badge bg-warning rounded-pill">{{ pendingProperties }}</span>
              </router-link>
              
              <a href="#" class="list-group-item list-group-item-action">
                <div>
                  <i class="fas fa-flag me-2"></i>
                  Gérer les litiges
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-cogs me-2"></i>
              État du Système
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3">
                <div class="system-metric">
                  <h6>IA Validation</h6>
                  <div class="progress mb-2">
                    <div class="progress-bar bg-success" style="width: 98%"></div>
                  </div>
                  <small class="text-success">Opérationnel (98%)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="system-metric">
                  <h6>Surveillance Satellite</h6>
                  <div class="progress mb-2">
                    <div class="progress-bar bg-success" style="width: 95%"></div>
                  </div>
                  <small class="text-success">Opérationnel (95%)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="system-metric">
                  <h6>Système de Paiement</h6>
                  <div class="progress mb-2">
                    <div class="progress-bar bg-warning" style="width: 85%"></div>
                  </div>
                  <small class="text-warning">Maintenance (85%)</small>
                </div>
              </div>
              <div class="col-md-3">
                <div class="system-metric">
                  <h6>Base de Données</h6>
                  <div class="progress mb-2">
                    <div class="progress-bar bg-success" style="width: 100%"></div>
                  </div>
                  <small class="text-success">Opérationnel (100%)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUsersStore } from '../../stores/users'
import { usePropertiesStore } from '../../stores/properties'

const usersStore = useUsersStore()
const propertiesStore = usePropertiesStore()

// Computed stats
const totalUsers = computed(() => usersStore.getAllUsers().length)
const totalProperties = computed(() => propertiesStore.properties.length)
const pendingValidations = computed(() => 
  propertiesStore.properties.filter(p => p.status === 'en_attente_validation').length
)
const pendingUsers = computed(() => 
  usersStore.getAllUsers().filter(u => u.status === 'en_attente_validation').length
)
const pendingProperties = computed(() => pendingValidations.value)
const totalTransactions = ref(42) // Mock data

// Recent activities (mock data)
const recentActivities = ref([
  {
    id: 1,
    description: "Nouvelle propriété enregistrée par Jean Dupont",
    time: new Date(Date.now() - 30 * 60 * 1000),
    icon: "fas fa-home",
    iconClass: "bg-success"
  },
  {
    id: 2,
    description: "Utilisateur Marie Martin validé",
    time: new Date(Date.now() - 45 * 60 * 1000),
    icon: "fas fa-user-check",
    iconClass: "bg-primary"
  },
  {
    id: 3,
    description: "Changement détecté sur propriété #1234",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: "fas fa-satellite",
    iconClass: "bg-warning"
  },
  {
    id: 4,
    description: "Transaction complétée - 50,000 EUR",
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    icon: "fas fa-money-bill",
    iconClass: "bg-info"
  }
])

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

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.activity-content {
  flex: 1;
}

.system-metric {
  text-align: center;
  padding: 15px;
}

.system-metric h6 {
  margin-bottom: 10px;
  color: #666;
}

.bg-primary { background-color: #8B4513 !important; }
.bg-success { background-color: #28a745 !important; }
.bg-warning { background-color: #ffc107 !important; }
.bg-info { background-color: #17a2b8 !important; }
</style>
