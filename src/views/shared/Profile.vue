<template>
  <div class="profile-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Mon Profil</h1>
      <button 
        class="btn btn-outline-secondary" 
        @click="editMode = !editMode"
        v-if="!editMode"
      >
        <i class="fas fa-edit me-2"></i>Modifier
      </button>
    </div>

    <div class="row">
      <!-- Profile Information -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-user me-2"></i>
              Informations personnelles
            </h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveProfile" v-if="editMode">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="firstName" class="form-label">Prénom *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="firstName"
                    v-model="profileForm.firstName"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="lastName" class="form-label">Nom *</label>
                  <input
                    type="text"
                    class="form-control"
                    id="lastName"
                    v-model="profileForm.lastName"
                    required
                  >
                </div>
              </div>
              
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="profileForm.email"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label">Téléphone *</label>
                  <input
                    type="tel"
                    class="form-control"
                    id="phone"
                    v-model="profileForm.phone"
                    required
                  >
                </div>
              </div>

              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="address" class="form-label">Adresse</label>
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    v-model="profileForm.address"
                    placeholder="Adresse complète"
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label for="city" class="form-label">Ville</label>
                  <input
                    type="text"
                    class="form-control"
                    id="city"
                    v-model="profileForm.city"
                    placeholder="Ville de résidence"
                  >
                </div>
              </div>

              <div class="mb-3">
                <label for="bio" class="form-label">Biographie</label>
                <textarea
                  class="form-control"
                  id="bio"
                  v-model="profileForm.bio"
                  rows="4"
                  placeholder="Parlez-nous de vous..."
                ></textarea>
              </div>

              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success">
                  <i class="fas fa-save me-2"></i>Sauvegarder
                </button>
                <button type="button" class="btn btn-outline-secondary" @click="cancelEdit">
                  <i class="fas fa-times me-2"></i>Annuler
                </button>
              </div>
            </form>

            <!-- Read-only view -->
            <div v-else>
              <div class="row">
                <div class="col-md-6">
                  <div class="info-item">
                    <strong>Prénom :</strong> {{ user?.firstName || 'Non renseigné' }}
                  </div>
                  <div class="info-item">
                    <strong>Email :</strong> {{ user?.email || 'Non renseigné' }}
                  </div>
                  <div class="info-item">
                    <strong>Adresse :</strong> {{ user?.address || 'Non renseignée' }}
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="info-item">
                    <strong>Nom :</strong> {{ user?.lastName || 'Non renseigné' }}
                  </div>
                  <div class="info-item">
                    <strong>Téléphone :</strong> {{ user?.phone || 'Non renseigné' }}
                  </div>
                  <div class="info-item">
                    <strong>Ville :</strong> {{ user?.city || 'Non renseignée' }}
                  </div>
                </div>
              </div>
              
              <div v-if="user?.bio" class="mt-3">
                <strong>Biographie :</strong>
                <p class="text-muted mt-2">{{ user.bio }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Information -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-cog me-2"></i>
              Informations du compte
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="info-item">
                  <strong>Rôle :</strong> 
                  <span class="badge" :class="getRoleBadgeClass(user?.role)">
                    {{ getRoleLabel(user?.role) }}
                  </span>
                </div>
                <div class="info-item">
                  <strong>Statut :</strong>
                  <span class="badge" :class="getStatusBadgeClass(user?.status)">
                    {{ getStatusLabel(user?.status) }}
                  </span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <strong>Membre depuis :</strong> {{ formatDate(user?.createdAt) }}
                </div>
                <div class="info-item">
                  <strong>Dernière mise à jour :</strong> {{ formatDate(user?.updatedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="card mt-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-shield-alt me-2"></i>
              Sécurité
            </h5>
          </div>
          <div class="card-body">
            <button class="btn btn-outline-primary me-2" @click="changePassword">
              <i class="fas fa-key me-2"></i>Changer le mot de passe
            </button>
            <button class="btn btn-outline-secondary" @click="enableTwoFA">
              <i class="fas fa-mobile-alt me-2"></i>Activer l'authentification à deux facteurs
            </button>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Profile Picture -->
        <div class="card mb-4">
          <div class="card-body text-center">
            <div class="profile-avatar mb-3">
              {{ userInitials }}
            </div>
            <h5>{{ user?.firstName }} {{ user?.lastName }}</h5>
            <p class="text-muted">{{ getRoleLabel(user?.role) }}</p>
            <button class="btn btn-outline-primary btn-sm">
              <i class="fas fa-camera me-2"></i>Changer la photo
            </button>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="card mb-4" v-if="user?.role !== 'admin'">
          <div class="card-header">
            <h6 class="card-title mb-0">Statistiques</h6>
          </div>
          <div class="card-body">
            <div v-if="user?.role === 'proprietaire'">
              <div class="stat-item">
                <div class="stat-value">{{ ownerStats.properties }}</div>
                <div class="stat-label">Propriétés</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ ownerStats.sales }}</div>
                <div class="stat-label">Ventes</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ ownerStats.messages }}</div>
                <div class="stat-label">Messages</div>
              </div>
            </div>
            
            <div v-else-if="user?.role === 'acheteur'">
              <div class="stat-item">
                <div class="stat-value">{{ buyerStats.favorites }}</div>
                <div class="stat-label">Favoris</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ buyerStats.views }}</div>
                <div class="stat-label">Propriétés vues</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ buyerStats.messages }}</div>
                <div class="stat-label">Messages</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="card">
          <div class="card-header">
            <h6 class="card-title mb-0">Actions rapides</h6>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <router-link 
                v-if="user?.role === 'proprietaire'" 
                to="/owner/dashboard" 
                class="btn btn-outline-primary"
              >
                <i class="fas fa-tachometer-alt me-2"></i>Mon tableau de bord
              </router-link>
              <router-link 
                v-else-if="user?.role === 'acheteur'" 
                to="/buyer/dashboard" 
                class="btn btn-outline-primary"
              >
                <i class="fas fa-tachometer-alt me-2"></i>Mon tableau de bord
              </router-link>
              <router-link 
                v-else-if="user?.role === 'admin'" 
                to="/admin/dashboard" 
                class="btn btn-outline-primary"
              >
                <i class="fas fa-tachometer-alt me-2"></i>Administration
              </router-link>
              
              <router-link to="/chat" class="btn btn-outline-info">
                <i class="fas fa-comments me-2"></i>Messages
              </router-link>
              
              <button class="btn btn-outline-secondary" @click="exportData">
                <i class="fas fa-download me-2"></i>Exporter mes données
              </button>
              
              <button class="btn btn-outline-danger" @click="deleteAccount">
                <i class="fas fa-trash me-2"></i>Supprimer le compte
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useChatStore } from '../../stores/chat'

const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const chatStore = useChatStore()

const editMode = ref(false)
const profileForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  bio: ''
})

const user = computed(() => authStore.user)

const userInitials = computed(() => 
  user.value ? `${user.value.firstName?.[0] || ''}${user.value.lastName?.[0] || ''}` : 'U'
)

const ownerStats = computed(() => {
  if (user.value?.role !== 'proprietaire') return {}
  
  const properties = propertiesStore.getPropertiesByOwner(user.value.id)
  const chats = chatStore.getUserChats(user.value.id)
  
  return {
    properties: properties.length,
    sales: properties.filter(p => p.status === 'vendu').length,
    messages: chats.length
  }
})

const buyerStats = computed(() => {
  if (user.value?.role !== 'acheteur') return {}
  
  const chats = chatStore.getUserChats(user.value.id)
  
  return {
    favorites: Math.floor(Math.random() * 10) + 1, // Mock data
    views: Math.floor(Math.random() * 50) + 10, // Mock data
    messages: chats.length
  }
})

const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Administrateur',
    'proprietaire': 'Propriétaire',
    'acheteur': 'Acheteur'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'admin': 'bg-danger',
    'proprietaire': 'bg-success',
    'acheteur': 'bg-primary'
  }
  return classes[role] || 'bg-secondary'
}

const getStatusLabel = (status) => {
  const labels = {
    'actif': 'Actif',
    'en_attente_validation': 'En attente de validation',
    'suspendu': 'Suspendu'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'actif': 'bg-success',
    'en_attente_validation': 'bg-warning',
    'suspendu': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const saveProfile = () => {
  authStore.updateProfile(profileForm.value)
  editMode.value = false
}

const cancelEdit = () => {
  loadProfileForm()
  editMode.value = false
}

const loadProfileForm = () => {
  if (user.value) {
    profileForm.value = {
      firstName: user.value.firstName || '',
      lastName: user.value.lastName || '',
      email: user.value.email || '',
      phone: user.value.phone || '',
      address: user.value.address || '',
      city: user.value.city || '',
      bio: user.value.bio || ''
    }
  }
}

const changePassword = () => {
  alert('Fonctionnalité de changement de mot de passe à venir')
}

const enableTwoFA = () => {
  alert('Fonctionnalité d\'authentification à deux facteurs à venir')
}

const exportData = () => {
  alert('Export des données utilisateur à venir')
}

const deleteAccount = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
    alert('Fonctionnalité de suppression de compte à venir')
  }
}

onMounted(() => {
  loadProfileForm()
})
</script>

<style scoped>
.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto;
}

.info-item {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f3f5;
}

.info-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.stat-item {
  text-align: center;
  padding: 15px 0;
  border-bottom: 1px solid #f1f3f5;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  text-transform: uppercase;
  margin-top: 5px;
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
</style>
