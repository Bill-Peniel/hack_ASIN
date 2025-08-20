<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <i class="fas fa-map-marked-alt me-2"></i>
        Foncier Intelligent
      </router-link>
      
      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="notificationsDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <i class="fas fa-bell"></i>
              <span class="badge bg-danger ms-1" v-if="unreadNotifications > 0">
                {{ unreadNotifications }}
              </span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end notifications-dropdown">
              <li class="dropdown-header">
                <i class="fas fa-bell me-2"></i>
                Notifications
              </li>
              <div v-if="notifications.length > 0">
                <li v-for="notification in notifications" :key="notification.id">
                  <a class="dropdown-item" href="#" @click.prevent="markAsRead(notification)">
                    <div class="notification-item">
                      <i :class="notification.icon" class="me-2"></i>
                      <div class="notification-content">
                        <div class="notification-text">{{ notification.message }}</div>
                        <small class="text-muted">{{ formatTime(notification.time) }}</small>
                      </div>
                    </div>
                  </a>
                </li>
              </div>
              <li v-else>
                <span class="dropdown-item-text text-muted">Aucune notification</span>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item text-center" href="#" @click.prevent="clearAllNotifications">
                  <small>Tout marquer comme lu</small>
                </a>
              </li>
            </ul>
          </li>
          
          <li class="nav-item" v-if="authStore.isAuthenticated">
            <router-link to="/chat" class="nav-link position-relative">
              <i class="fas fa-comments"></i>
              <span class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill" 
                    v-if="unreadMessages > 0">
                {{ unreadMessages }}
              </span>
            </router-link>
          </li>
          
          <li class="nav-item dropdown" v-if="authStore.isAuthenticated">
            <a 
              class="nav-link dropdown-toggle" 
              href="#" 
              id="userDropdown" 
              role="button" 
              data-bs-toggle="dropdown"
            >
              <div class="user-avatar me-2">{{ userInitials }}</div>
              {{ authStore.user?.firstName }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-user me-2"></i>Mon profil
                </router-link>
              </li>
              <li>
                <router-link 
                  :to="getDashboardRoute()" 
                  class="dropdown-item"
                >
                  <i class="fas fa-tachometer-alt me-2"></i>Tableau de bord
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a class="dropdown-item" href="#" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>Se déconnecter
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useChatStore } from '../../stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

// Mock notifications for demo
const notifications = ref([
  {
    id: 1,
    message: "Nouvelle propriété ajoutée dans votre région",
    time: new Date(Date.now() - 15 * 60 * 1000),
    icon: "fas fa-home text-primary",
    read: false
  },
  {
    id: 2,
    message: "Votre propriété a reçu une nouvelle vue",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    icon: "fas fa-eye text-info",
    read: false
  },
  {
    id: 3,
    message: "Changement détecté via satellite sur votre terrain",
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    icon: "fas fa-satellite text-warning",
    read: false
  }
])

const userInitials = computed(() => {
  const user = authStore.user
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'
})

const unreadNotifications = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const unreadMessages = computed(() => 
  authStore.user ? chatStore.getUnreadCount(authStore.user.id) : 0
)

const getDashboardRoute = () => {
  const role = authStore.user?.role
  switch (role) {
    case 'admin': return '/admin/dashboard'
    case 'proprietaire': return '/owner/dashboard'
    case 'acheteur': return '/buyer/dashboard'
    default: return '/'
  }
}

const formatTime = (time) => {
  const now = new Date()
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 60) {
    return `Il y a ${diffMins}min`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`
  } else {
    return time.toLocaleDateString('fr-FR')
  }
}

const markAsRead = (notification) => {
  notification.read = true
}

const clearAllNotifications = () => {
  notifications.value.forEach(n => n.read = true)
}

const logout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Simulate receiving new notifications for different user roles
  if (authStore.user?.role === 'proprietaire') {
    setTimeout(() => {
      notifications.value.unshift({
        id: Date.now(),
        message: "Nouveau message d'un acheteur intéressé",
        time: new Date(),
        icon: "fas fa-message text-success",
        read: false
      })
    }, 10000) // After 10 seconds
  }
})
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1030;
}

.navbar-brand {
  font-weight: bold;
  font-size: 1.3rem;
}

.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: bold;
}

.notifications-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 5px 0;
}

.notification-content {
  flex: 1;
}

.notification-text {
  font-size: 0.9rem;
  line-height: 1.3;
}

.dropdown-item:hover .notification-item {
  background: none;
}

.nav-link {
  transition: all 0.2s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.dropdown-menu {
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  border: none;
}

.dropdown-item {
  padding: 10px 20px;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-header {
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  padding: 10px 20px;
  font-weight: 600;
  color: #495057;
}

@media (max-width: 991.98px) {
  .notifications-dropdown {
    width: 300px;
  }
  
  .navbar-collapse {
    background-color: rgba(139, 69, 19, 0.95);
    border-radius: 8px;
    margin-top: 10px;
    padding: 10px;
  }
}
</style>
