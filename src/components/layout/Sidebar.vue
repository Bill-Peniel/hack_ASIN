<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="user-info">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <h6 class="mb-0">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h6>
          <small class="text-muted">{{ getRoleLabel(authStore.user?.role) }}</small>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <!-- Admin Navigation -->
      <div v-if="authStore.user?.role === 'admin'">
        <div class="nav-section">
          <h6 class="nav-section-title">Administration</h6>
          <router-link to="/admin/dashboard" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </router-link>
          <router-link to="/admin/users" class="nav-link">
            <i class="fas fa-users"></i>
            <span>Gestion utilisateurs</span>
            <span class="badge bg-primary ms-auto" v-if="pendingUsers > 0">{{ pendingUsers }}</span>
          </router-link>
          <router-link to="/admin/properties" class="nav-link">
            <i class="fas fa-home"></i>
            <span>Validation propriétés</span>
            <span class="badge bg-warning ms-auto" v-if="pendingProperties > 0">{{ pendingProperties }}</span>
          </router-link>
        </div>
      </div>

      <!-- Owner Navigation -->
      <div v-if="authStore.user?.role === 'proprietaire'">
        <div class="nav-section">
          <h6 class="nav-section-title">Mes Propriétés</h6>
          <router-link to="/owner/dashboard" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </router-link>
          <router-link to="/owner/properties" class="nav-link">
            <i class="fas fa-list"></i>
            <span>Mes propriétés</span>
            <span class="badge bg-success ms-auto">{{ ownerProperties.length }}</span>
          </router-link>
          <router-link to="/owner/add-property" class="nav-link">
            <i class="fas fa-plus"></i>
            <span>Ajouter propriété</span>
          </router-link>
        </div>
      </div>

      <!-- Buyer Navigation -->
      <div v-if="authStore.user?.role === 'acheteur'">
        <div class="nav-section">
          <h6 class="nav-section-title">Recherche</h6>
          <router-link to="/buyer/dashboard" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            <span>Tableau de bord</span>
          </router-link>
          <router-link to="/buyer/marketplace" class="nav-link">
            <i class="fas fa-store"></i>
            <span>Marketplace</span>
            <span class="badge bg-info ms-auto">{{ availableProperties.length }}</span>
          </router-link>
        </div>
      </div>

      <!-- Common Navigation -->
      <div class="nav-section">
        <h6 class="nav-section-title">Communication</h6>
        <router-link to="/chat" class="nav-link">
          <i class="fas fa-comments"></i>
          <span>Messages</span>
          <span class="badge bg-danger ms-auto" v-if="unreadMessages > 0">{{ unreadMessages }}</span>
        </router-link>
      </div>

      <div class="nav-section">
        <h6 class="nav-section-title">Compte</h6>
        <router-link to="/profile" class="nav-link">
          <i class="fas fa-user"></i>
          <span>Mon profil</span>
        </router-link>
        <a href="#" class="nav-link" @click.prevent="logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Se déconnecter</span>
        </a>
      </div>
    </nav>

    <!-- System Status -->
    <div class="sidebar-footer">
      <div class="system-status">
        <div class="status-item">
          <i class="fas fa-circle text-success"></i>
          <span>Système opérationnel</span>
        </div>
        <div class="status-item">
          <i class="fas fa-satellite text-success"></i>
          <span>Surveillance active</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useUsersStore } from '../../stores/users'
import { useChatStore } from '../../stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const usersStore = useUsersStore()
const chatStore = useChatStore()

const userInitials = computed(() => {
  const user = authStore.user
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'
})

const ownerProperties = computed(() => 
  authStore.user ? propertiesStore.getPropertiesByOwner(authStore.user.id) : []
)

const availableProperties = computed(() => 
  propertiesStore.getAvailableProperties()
)

const pendingUsers = computed(() => 
  usersStore.getAllUsers().filter(u => u.status === 'en_attente_validation').length
)

const pendingProperties = computed(() => 
  propertiesStore.properties.filter(p => p.status === 'en_attente_validation').length
)

const unreadMessages = computed(() => 
  authStore.user ? chatStore.getUnreadCount(authStore.user.id) : 0
)

const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Administrateur',
    'proprietaire': 'Propriétaire',
    'acheteur': 'Acheteur'
  }
  return labels[role] || role
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  width: 250px;
  height: calc(100vh - 60px);
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  overflow-y: auto;
  z-index: 1020;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
}

.user-details h6 {
  color: white;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 0;
}

.nav-section {
  margin-bottom: 10px;
}

.nav-section-title {
  padding: 15px 20px 10px 20px;
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  letter-spacing: 0.5px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border-left-color: #8B4513;
}

.nav-link.router-link-active {
  background-color: rgba(139, 69, 19, 0.2);
  color: white;
  border-left-color: #8B4513;
}

.nav-link i {
  width: 20px;
  margin-right: 12px;
  text-align: center;
}

.nav-link span {
  flex: 1;
}

.nav-link .badge {
  font-size: 0.7rem;
  padding: 2px 6px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(0, 0, 0, 0.1);
}

.system-status {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
}

.status-item i {
  font-size: 0.6rem;
}

/* Scrollbar styling */
.sidebar::-webkit-scrollbar {
  width: 4px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
}
</style>
