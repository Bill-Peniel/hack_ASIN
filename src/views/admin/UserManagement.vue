<template>
  <div class="user-management">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Gestion des Utilisateurs</h1>
      <div class="d-flex gap-2">
        <select class="form-select" v-model="filterRole" style="width: auto;">
          <option value="">Tous les rôles</option>
          <option value="proprietaire">Propriétaires</option>
          <option value="acheteur">Acheteurs</option>
        </select>
        <select class="form-select" v-model="filterStatus" style="width: auto;">
          <option value="">Tous les statuts</option>
          <option value="actif">Actifs</option>
          <option value="en_attente_validation">En attente</option>
          <option value="suspendu">Suspendus</option>
        </select>
      </div>
    </div>

    <!-- Users Table -->
    <div class="card">
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Date d'inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <div class="d-flex align-items-center">
                    <div class="avatar me-3">
                      {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                    </div>
                    <div>
                      <div class="fw-semibold">{{ user.firstName }} {{ user.lastName }}</div>
                      <small class="text-muted">{{ user.phone }}</small>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td>
                  <span class="badge" :class="getRoleBadgeClass(user.role)">
                    {{ getRoleLabel(user.role) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(user.status)">
                    {{ getStatusLabel(user.status) }}
                  </span>
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td>
                  <div class="dropdown">
                    <button 
                      class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                      type="button" 
                      data-bs-toggle="dropdown"
                    >
                      Actions
                    </button>
                    <ul class="dropdown-menu">
                      <li v-if="user.status === 'en_attente_validation'">
                        <button 
                          class="dropdown-item text-success" 
                          @click="validateUser(user.id)"
                        >
                          <i class="fas fa-check me-2"></i>Valider
                        </button>
                      </li>
                      <li v-if="user.status === 'actif'">
                        <button 
                          class="dropdown-item text-warning" 
                          @click="suspendUser(user.id)"
                        >
                          <i class="fas fa-pause me-2"></i>Suspendre
                        </button>
                      </li>
                      <li v-if="user.status === 'suspendu'">
                        <button 
                          class="dropdown-item text-success" 
                          @click="reactivateUser(user.id)"
                        >
                          <i class="fas fa-play me-2"></i>Réactiver
                        </button>
                      </li>
                      <li><hr class="dropdown-divider"></li>
                      <li>
                        <button 
                          class="dropdown-item text-primary" 
                          @click="viewUserDetails(user)"
                        >
                          <i class="fas fa-eye me-2"></i>Voir détails
                        </button>
                      </li>
                      <li>
                        <button 
                          class="dropdown-item text-danger" 
                          @click="confirmDeleteUser(user)"
                        >
                          <i class="fas fa-trash me-2"></i>Supprimer
                        </button>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredUsers.length === 0" class="text-center py-4">
          <i class="fas fa-users fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Aucun utilisateur trouvé</h5>
          <p class="text-muted">Aucun utilisateur ne correspond aux critères de filtrage.</p>
        </div>
      </div>
    </div>

    <!-- User Details Modal -->
    <div class="modal fade" id="userDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de l'utilisateur</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedUser">
            <div class="row">
              <div class="col-md-6">
                <h6>Informations personnelles</h6>
                <table class="table table-sm">
                  <tr>
                    <th>Nom complet:</th>
                    <td>{{ selectedUser.firstName }} {{ selectedUser.lastName }}</td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{{ selectedUser.email }}</td>
                  </tr>
                  <tr>
                    <th>Téléphone:</th>
                    <td>{{ selectedUser.phone }}</td>
                  </tr>
                  <tr>
                    <th>Rôle:</th>
                    <td>
                      <span class="badge" :class="getRoleBadgeClass(selectedUser.role)">
                        {{ getRoleLabel(selectedUser.role) }}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <h6>Informations système</h6>
                <table class="table table-sm">
                  <tr>
                    <th>Statut:</th>
                    <td>
                      <span class="badge" :class="getStatusBadgeClass(selectedUser.status)">
                        {{ getStatusLabel(selectedUser.status) }}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th>Date d'inscription:</th>
                    <td>{{ formatDate(selectedUser.createdAt) }}</td>
                  </tr>
                  <tr>
                    <th>Dernière mise à jour:</th>
                    <td>{{ formatDate(selectedUser.updatedAt) }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUsersStore } from '../../stores/users'

const usersStore = useUsersStore()

const filterRole = ref('')
const filterStatus = ref('')
const selectedUser = ref(null)

const filteredUsers = computed(() => {
  let users = usersStore.getAllUsers()
  
  if (filterRole.value) {
    users = users.filter(user => user.role === filterRole.value)
  }
  
  if (filterStatus.value) {
    users = users.filter(user => user.status === filterStatus.value)
  }
  
  return users
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
    'en_attente_validation': 'En attente',
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

const validateUser = (userId) => {
  usersStore.validateUser(userId)
}

const suspendUser = (userId) => {
  usersStore.suspendUser(userId)
}

const reactivateUser = (userId) => {
  usersStore.updateUserStatus(userId, 'actif')
}

const viewUserDetails = (user) => {
  selectedUser.value = user
  const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'))
  modal.show()
}

const confirmDeleteUser = (user) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
    usersStore.deleteUser(user.id)
  }
}
</script>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.table th {
  border-top: none;
  font-weight: 600;
  color: #666;
  background-color: #f8f9fa;
}

.dropdown-toggle::after {
  margin-left: 8px;
}
</style>
