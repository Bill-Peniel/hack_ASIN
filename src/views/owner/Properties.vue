<template>
  <div class="properties-management">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Mes Propriétés</h1>
      <div class="d-flex gap-2">
        <select class="form-select" v-model="filterStatus" style="width: auto;">
          <option value="">Tous les statuts</option>
          <option value="en_attente_validation">En attente</option>
          <option value="valide">Validées</option>
          <option value="disponible">En vente</option>
          <option value="rejete">Rejetées</option>
        </select>
        <router-link to="/owner/add-property" class="btn btn-primary">
          <i class="fas fa-plus me-2"></i>Ajouter
        </router-link>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="property in filteredProperties" :key="property.id">
        <div class="card property-card h-100">
          <div class="position-relative">
            <div class="property-image">
              <i class="fas fa-map-marker-alt fa-3x text-muted"></i>
            </div>
            <span class="badge position-absolute top-0 end-0 m-2" :class="getStatusBadgeClass(property.status)">
              {{ getStatusLabel(property.status) }}
            </span>
            <div class="property-actions position-absolute top-0 start-0 m-2">
              <div class="dropdown">
                <button 
                  class="btn btn-sm btn-dark dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i class="fas fa-cog"></i>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <router-link 
                      :to="`/owner/property/${property.id}`" 
                      class="dropdown-item"
                    >
                      <i class="fas fa-eye me-2"></i>Voir détails
                    </router-link>
                  </li>
                  <li v-if="property.status === 'valide' && !property.forSale">
                    <button 
                      class="dropdown-item" 
                      @click="putForSale(property)"
                    >
                      <i class="fas fa-shopping-cart me-2"></i>Mettre en vente
                    </button>
                  </li>
                  <li v-if="property.forSale">
                    <button 
                      class="dropdown-item" 
                      @click="removeFromSale(property)"
                    >
                      <i class="fas fa-ban me-2"></i>Retirer de la vente
                    </button>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <button 
                      class="dropdown-item text-danger" 
                      @click="confirmDelete(property)"
                    >
                      <i class="fas fa-trash me-2"></i>Supprimer
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">{{ property.title }}</h6>
            <p class="card-text text-muted small mb-2">
              <i class="fas fa-map-marker-alt me-1"></i>
              {{ property.location.city }}, {{ property.location.region }}
            </p>
            <p class="card-text small mb-3">
              <strong>Type:</strong> {{ property.type }}<br>
              <strong>Surface:</strong> {{ property.area }} m²<br>
              <span v-if="property.price">
                <strong>Prix:</strong> {{ formatPrice(property.price) }}
              </span>
            </p>
            
            <div class="mt-auto">
              <div class="d-flex gap-2 mb-2">
                <router-link 
                  :to="`/owner/property/${property.id}`" 
                  class="btn btn-sm btn-primary flex-fill"
                >
                  <i class="fas fa-eye me-1"></i>Détails
                </router-link>
                <button 
                  v-if="property.status === 'valide' && !property.forSale" 
                  class="btn btn-sm btn-success flex-fill" 
                  @click="putForSale(property)"
                >
                  <i class="fas fa-shopping-cart me-1"></i>Vendre
                </button>
              </div>
              
              <!-- Satellite Alert -->
              <div v-if="property.changeDetected" class="alert alert-warning alert-sm py-2">
                <i class="fas fa-exclamation-triangle me-1"></i>
                <small>Changement détecté via satellite</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProperties.length === 0" class="text-center py-5">
      <i class="fas fa-home fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Aucune propriété trouvée</h5>
      <p class="text-muted mb-3">
        <span v-if="filterStatus">Aucune propriété ne correspond au filtre sélectionné.</span>
        <span v-else>Vous n'avez pas encore enregistré de propriété.</span>
      </p>
      <router-link to="/owner/add-property" class="btn btn-primary" v-if="!filterStatus">
        <i class="fas fa-plus me-2"></i>Ajouter ma première propriété
      </router-link>
    </div>

    <!-- Sale Modal -->
    <div class="modal fade" id="saleModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Mettre en vente</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="confirmSale">
            <div class="modal-body">
              <div class="mb-3">
                <label for="salePrice" class="form-label">Prix de vente (FCFA)</label>
                <input
                  type="number"
                  class="form-control"
                  id="salePrice"
                  v-model="saleForm.price"
                  required
                  min="1000"
                  step="1000"
                >
              </div>
              <div class="mb-3">
                <label for="saleDescription" class="form-label">Description pour la vente</label>
                <textarea
                  class="form-control"
                  id="saleDescription"
                  v-model="saleForm.description"
                  rows="4"
                  placeholder="Décrivez votre propriété pour attirer les acheteurs..."
                ></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Annuler
              </button>
              <button type="submit" class="btn btn-success">
                <i class="fas fa-shopping-cart me-2"></i>Mettre en vente
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'

const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()

const filterStatus = ref('')
const selectedProperty = ref(null)
const saleForm = ref({
  price: '',
  description: ''
})

const myProperties = computed(() => 
  propertiesStore.getPropertiesByOwner(authStore.user?.id || '')
)

const filteredProperties = computed(() => {
  let properties = myProperties.value
  
  if (filterStatus.value) {
    properties = properties.filter(property => property.status === filterStatus.value)
  }
  
  return properties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

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

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

const putForSale = (property) => {
  selectedProperty.value = property
  saleForm.value = {
    price: property.price || '',
    description: property.description || ''
  }
  const modal = new bootstrap.Modal(document.getElementById('saleModal'))
  modal.show()
}

const confirmSale = () => {
  if (selectedProperty.value) {
    propertiesStore.putPropertyForSale(selectedProperty.value.id, saleForm.value)
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('saleModal'))
    modal.hide()
    
    selectedProperty.value = null
    saleForm.value = { price: '', description: '' }
  }
}

const removeFromSale = (property) => {
  if (confirm('Êtes-vous sûr de vouloir retirer cette propriété de la vente ?')) {
    propertiesStore.updateProperty(property.id, {
      status: 'valide',
      forSale: false
    })
  }
}

const confirmDelete = (property) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la propriété "${property.title}" ?`)) {
    const index = propertiesStore.properties.findIndex(p => p.id === property.id)
    if (index !== -1) {
      propertiesStore.properties.splice(index, 1)
    }
  }
}
</script>

<style scoped>
.property-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.property-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.property-image {
  height: 180px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dee2e6;
}

.property-actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.property-card:hover .property-actions {
  opacity: 1;
}

.alert-sm {
  font-size: 0.8rem;
}

.btn-primary {
  background-color: #8B4513;
  border-color: #8B4513;
}

.btn-primary:hover {
  background-color: #7A4012;
  border-color: #7A4012;
}

.dropdown-toggle::after {
  display: none;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.5rem;
}
</style>
