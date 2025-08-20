<template>
  <div class="property-validation">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Validation des Propriétés</h1>
      <div class="d-flex gap-2">
        <select class="form-select" v-model="filterStatus" style="width: auto;">
          <option value="">Tous les statuts</option>
          <option value="en_attente_validation">En attente</option>
          <option value="valide">Validées</option>
          <option value="rejete">Rejetées</option>
        </select>
      </div>
    </div>

    <!-- Properties Grid -->
    <div class="row">
      <div class="col-md-6 col-lg-4 mb-4" v-for="property in filteredProperties" :key="property.id">
        <div class="card property-card">
          <div class="position-relative">
            <div class="property-image">
              <i class="fas fa-map-marker-alt fa-3x text-muted"></i>
            </div>
            <span class="badge position-absolute top-0 end-0 m-2" :class="getStatusBadgeClass(property.status)">
              {{ getStatusLabel(property.status) }}
            </span>
          </div>
          
          <div class="card-body">
            <h6 class="card-title">{{ property.title }}</h6>
            <p class="card-text text-muted small mb-2">
              <i class="fas fa-map-marker-alt me-1"></i>
              {{ property.location.city }}, {{ property.location.region }}
            </p>
            <p class="card-text small mb-3">
              <strong>Type:</strong> {{ property.type }}<br>
              <strong>Surface:</strong> {{ property.area }} m²<br>
              <strong>Propriétaire:</strong> {{ getOwnerName(property.ownerId) }}
            </p>
            
            <div class="d-flex gap-2">
              <button 
                class="btn btn-sm btn-outline-primary" 
                @click="viewPropertyDetails(property)"
              >
                <i class="fas fa-eye me-1"></i>Détails
              </button>
              <button 
                v-if="property.status === 'en_attente_validation'" 
                class="btn btn-sm btn-success" 
                @click="validateProperty(property.id, true)"
              >
                <i class="fas fa-check me-1"></i>Valider
              </button>
              <button 
                v-if="property.status === 'en_attente_validation'" 
                class="btn btn-sm btn-danger" 
                @click="validateProperty(property.id, false)"
              >
                <i class="fas fa-times me-1"></i>Rejeter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProperties.length === 0" class="text-center py-5">
      <i class="fas fa-home fa-3x text-muted mb-3"></i>
      <h5 class="text-muted">Aucune propriété trouvée</h5>
      <p class="text-muted">Aucune propriété ne correspond aux critères de filtrage.</p>
    </div>

    <!-- Property Details Modal -->
    <div class="modal fade" id="propertyDetailsModal" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Détails de la propriété</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body" v-if="selectedProperty">
            <div class="row">
              <div class="col-md-8">
                <h6>Informations de la propriété</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <th>Titre:</th>
                      <td>{{ selectedProperty.title }}</td>
                    </tr>
                    <tr>
                      <th>Type:</th>
                      <td>{{ selectedProperty.type }}</td>
                    </tr>
                    <tr>
                      <th>Surface:</th>
                      <td>{{ selectedProperty.area }} m²</td>
                    </tr>
                    <tr>
                      <th>Localisation:</th>
                      <td>{{ selectedProperty.location.address }}, {{ selectedProperty.location.city }}, {{ selectedProperty.location.region }}</td>
                    </tr>
                    <tr>
                      <th>Coordonnées GPS:</th>
                      <td>{{ selectedProperty.location.coordinates.lat }}, {{ selectedProperty.location.coordinates.lng }}</td>
                    </tr>
                    <tr>
                      <th>Description:</th>
                      <td>{{ selectedProperty.description }}</td>
                    </tr>
                  </tbody>
                </table>

                <!-- AI Validation Results -->
                <h6 class="mt-4">Résultats de validation IA</h6>
                <div class="ai-validation-results">
                  <div class="alert alert-success">
                    <i class="fas fa-robot me-2"></i>
                    <strong>Validation automatique des documents :</strong>
                    <ul class="mb-0 mt-2">
                      <li>Titre foncier : Validé ✓</li>
                      <li>Certificat de propriété : Validé ✓</li>
                      <li>Plan cadastral : Validé ✓</li>
                    </ul>
                  </div>
                </div>

                <!-- Satellite Monitoring -->
                <h6 class="mt-4">Surveillance satellite</h6>
                <div class="satellite-monitoring">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="satellite-image">
                        <h7>Image actuelle</h7>
                        <div class="mock-satellite-image bg-success">
                          <i class="fas fa-satellite-dish fa-2x text-white"></i>
                          <p class="text-white mt-2">Image satellite courante</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="satellite-image">
                        <h7>Image précédente</h7>
                        <div class="mock-satellite-image bg-info">
                          <i class="fas fa-satellite-dish fa-2x text-white"></i>
                          <p class="text-white mt-2">Image satellite antérieure</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="alert alert-info mt-3">
                    <i class="fas fa-satellite me-2"></i>
                    <strong>Analyse de changement :</strong> Aucun changement significatif détecté
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <h6>Propriétaire</h6>
                <div class="owner-info">
                  <div class="avatar-lg mb-3">
                    {{ getOwnerInitials(selectedProperty.ownerId) }}
                  </div>
                  <h6>{{ getOwnerName(selectedProperty.ownerId) }}</h6>
                  <p class="text-muted">{{ getOwnerEmail(selectedProperty.ownerId) }}</p>
                </div>

                <h6 class="mt-4">Documents</h6>
                <div class="documents-list">
                  <div class="document-item" v-for="doc in selectedProperty.documents" :key="doc.id">
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    {{ doc.name }}
                    <button class="btn btn-sm btn-outline-primary ms-2">
                      <i class="fas fa-download"></i>
                    </button>
                  </div>
                  <div v-if="selectedProperty.documents?.length === 0" class="text-muted">
                    Aucun document uploadé
                  </div>
                </div>

                <h6 class="mt-4">Historique</h6>
                <div class="timeline">
                  <div class="timeline-item">
                    <i class="fas fa-plus text-primary"></i>
                    <div>
                      <strong>Propriété créée</strong>
                      <br>
                      <small class="text-muted">{{ formatDate(selectedProperty.createdAt) }}</small>
                    </div>
                  </div>
                  <div class="timeline-item" v-if="selectedProperty.validatedAt">
                    <i class="fas fa-check text-success"></i>
                    <div>
                      <strong>Validée</strong>
                      <br>
                      <small class="text-muted">{{ formatDate(selectedProperty.validatedAt) }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Fermer
            </button>
            <button 
              v-if="selectedProperty?.status === 'en_attente_validation'" 
              type="button" 
              class="btn btn-danger" 
              @click="validateProperty(selectedProperty.id, false)"
            >
              <i class="fas fa-times me-1"></i>Rejeter
            </button>
            <button 
              v-if="selectedProperty?.status === 'en_attente_validation'" 
              type="button" 
              class="btn btn-success" 
              @click="validateProperty(selectedProperty.id, true)"
            >
              <i class="fas fa-check me-1"></i>Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePropertiesStore } from '../../stores/properties'
import { useUsersStore } from '../../stores/users'

const propertiesStore = usePropertiesStore()
const usersStore = useUsersStore()

const filterStatus = ref('')
const selectedProperty = ref(null)

const filteredProperties = computed(() => {
  let properties = propertiesStore.properties
  
  if (filterStatus.value) {
    properties = properties.filter(property => property.status === filterStatus.value)
  }
  
  return properties
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

const getOwnerName = (ownerId) => {
  const user = usersStore.getUserById(ownerId)
  return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'
}

const getOwnerEmail = (ownerId) => {
  const user = usersStore.getUserById(ownerId)
  return user?.email || 'Email inconnu'
}

const getOwnerInitials = (ownerId) => {
  const user = usersStore.getUserById(ownerId)
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'UK'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const viewPropertyDetails = (property) => {
  selectedProperty.value = property
  const modal = new bootstrap.Modal(document.getElementById('propertyDetailsModal'))
  modal.show()
}

const validateProperty = (propertyId, isValid) => {
  propertiesStore.validateProperty(propertyId, isValid)
  
  // Close modal if open
  const modal = bootstrap.Modal.getInstance(document.getElementById('propertyDetailsModal'))
  if (modal) {
    modal.hide()
  }
}
</script>

<style scoped>
.property-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.property-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.property-image {
  height: 150px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #dee2e6;
}

.avatar-lg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0 auto;
}

.documents-list {
  max-height: 200px;
  overflow-y: auto;
}

.document-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.document-item:last-child {
  border-bottom: none;
}

.timeline {
  position: relative;
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px 0;
  border-left: 2px solid #dee2e6;
  margin-left: 10px;
  padding-left: 20px;
  position: relative;
}

.timeline-item i {
  position: absolute;
  left: -10px;
  background: white;
  padding: 5px;
  border-radius: 50%;
  border: 2px solid #dee2e6;
}

.ai-validation-results .alert {
  border-left: 4px solid #28a745;
}

.mock-satellite-image {
  height: 150px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.satellite-monitoring .alert {
  border-left: 4px solid #17a2b8;
}
</style>
