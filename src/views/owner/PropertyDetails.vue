<template>
  <div class="property-details" v-if="property">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">{{ property.title }}</h1>
        <p class="text-muted">{{ property.location.address }}, {{ property.location.city }}</p>
      </div>
      <div class="d-flex gap-2">
        <span class="badge fs-6" :class="getStatusBadgeClass(property.status)">
          {{ getStatusLabel(property.status) }}
        </span>
        <router-link to="/owner/properties" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Retour
        </router-link>
      </div>
    </div>

    <div class="row">
      <!-- Main Content -->
      <div class="col-lg-8">
        <!-- Property Info -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-info-circle me-2"></i>
              Informations de la propriété
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tr>
                    <th>Type:</th>
                    <td>{{ property.type }}</td>
                  </tr>
                  <tr>
                    <th>Surface:</th>
                    <td>{{ property.area }} m²</td>
                  </tr>
                  <tr>
                    <th>Prix:</th>
                    <td>{{ property.price ? formatPrice(property.price) : 'Non défini' }}</td>
                  </tr>
                </table>
              </div>
              <div class="col-md-6">
                <table class="table table-borderless">
                  <tr>
                    <th>Région:</th>
                    <td>{{ property.location.region }}</td>
                  </tr>
                  <tr>
                    <th>Ville:</th>
                    <td>{{ property.location.city }}</td>
                  </tr>
                  <tr>
                    <th>Coordonnées GPS:</th>
                    <td>{{ property.location.coordinates.lat }}, {{ property.location.coordinates.lng }}</td>
                  </tr>
                </table>
              </div>
            </div>
            <div v-if="property.description">
              <h6>Description:</h6>
              <p class="text-muted">{{ property.description }}</p>
            </div>
          </div>
        </div>

        <!-- Map -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-map-marker-alt me-2"></i>
              Localisation
            </h5>
          </div>
          <div class="card-body p-0">
            <MapViewer 
              :latitude="property.location.coordinates.lat"
              :longitude="property.location.coordinates.lng"
              :title="property.title"
              height="400px"
            />
          </div>
        </div>

        <!-- AI Validation Results -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-robot me-2"></i>
              Validation IA des documents
            </h5>
          </div>
          <div class="card-body">
            <div v-if="property.status === 'valide'" class="alert alert-success">
              <i class="fas fa-check-circle me-2"></i>
              <strong>Documents validés avec succès</strong>
              <ul class="mt-2 mb-0">
                <li>Titre foncier : Validé ✓</li>
                <li>Certificat de propriété : Validé ✓</li>
                <li>Plan cadastral : Validé ✓</li>
                <li>Cohérence des informations : 98%</li>
              </ul>
            </div>
            <div v-else-if="property.status === 'en_attente_validation'" class="alert alert-warning">
              <i class="fas fa-clock me-2"></i>
              <strong>Validation en cours...</strong>
              <p class="mb-0 mt-2">Votre propriété est en cours d'analyse par notre système IA. Vous recevrez une notification dès que la validation sera terminée.</p>
            </div>
            <div v-else-if="property.status === 'rejete'" class="alert alert-danger">
              <i class="fas fa-times-circle me-2"></i>
              <strong>Documents rejetés</strong>
              <p class="mb-0 mt-2">Veuillez vérifier et corriger vos documents puis les soumettre à nouveau.</p>
            </div>
          </div>
        </div>

        <!-- Satellite Monitoring -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-satellite me-2"></i>
              Surveillance satellite
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h6>Image actuelle</h6>
                <div class="satellite-image bg-success text-white">
                  <i class="fas fa-satellite-dish fa-2x mb-2"></i>
                  <p class="mb-0">Image satellite récente</p>
                  <small>{{ formatDate(new Date()) }}</small>
                </div>
              </div>
              <div class="col-md-6">
                <h6>Image précédente</h6>
                <div class="satellite-image bg-info text-white">
                  <i class="fas fa-satellite-dish fa-2x mb-2"></i>
                  <p class="mb-0">Image satellite antérieure</p>
                  <small>{{ formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) }}</small>
                </div>
              </div>
            </div>
            <div class="alert alert-info mt-3">
              <i class="fas fa-info-circle me-2"></i>
              <strong>Analyse de changement :</strong> 
              <span v-if="property.changeDetected" class="text-warning">
                Changement détecté - Vérification recommandée
              </span>
              <span v-else class="text-success">
                Aucun changement significatif détecté
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Actions -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Actions</h5>
          </div>
          <div class="card-body">
            <div class="d-grid gap-2">
              <button 
                v-if="property.status === 'valide' && !property.forSale"
                class="btn btn-success"
                @click="putForSale"
              >
                <i class="fas fa-shopping-cart me-2"></i>Mettre en vente
              </button>
              <button 
                v-if="property.forSale"
                class="btn btn-warning"
                @click="removeFromSale"
              >
                <i class="fas fa-ban me-2"></i>Retirer de la vente
              </button>
              <button class="btn btn-outline-primary">
                <i class="fas fa-edit me-2"></i>Modifier
              </button>
              <button class="btn btn-outline-secondary">
                <i class="fas fa-download me-2"></i>Télécharger le rapport
              </button>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-file-alt me-2"></i>
              Documents
            </h5>
          </div>
          <div class="card-body">
            <div v-if="property.documents && property.documents.length > 0">
              <div class="document-item" v-for="doc in property.documents" :key="doc.id">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <i class="fas fa-file-pdf text-danger me-2"></i>
                    {{ doc.name }}
                  </div>
                  <button class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-download"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="text-muted text-center py-3">
              <i class="fas fa-file-alt fa-2x mb-2"></i>
              <p>Aucun document uploadé</p>
              <button class="btn btn-sm btn-outline-primary">
                <i class="fas fa-upload me-2"></i>Ajouter des documents
              </button>
            </div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-history me-2"></i>
              Historique
            </h5>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker bg-primary">
                  <i class="fas fa-plus"></i>
                </div>
                <div class="timeline-content">
                  <h6>Propriété créée</h6>
                  <small class="text-muted">{{ formatDate(property.createdAt) }}</small>
                </div>
              </div>
              <div class="timeline-item" v-if="property.validatedAt">
                <div class="timeline-marker bg-success">
                  <i class="fas fa-check"></i>
                </div>
                <div class="timeline-content">
                  <h6>Validée par IA</h6>
                  <small class="text-muted">{{ formatDate(property.validatedAt) }}</small>
                </div>
              </div>
              <div class="timeline-item" v-if="property.forSale">
                <div class="timeline-marker bg-info">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="timeline-content">
                  <h6>Mise en vente</h6>
                  <small class="text-muted">{{ formatDate(property.updatedAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

  <div v-else class="text-center py-5">
    <i class="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
    <h5 class="text-muted">Propriété non trouvée</h5>
    <router-link to="/owner/properties" class="btn btn-primary">
      <i class="fas fa-arrow-left me-2"></i>Retour à mes propriétés
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertiesStore } from '../../stores/properties'
import MapViewer from '../../components/common/MapViewer.vue'

const route = useRoute()
const router = useRouter()
const propertiesStore = usePropertiesStore()

const property = ref(null)
const saleForm = ref({
  price: '',
  description: ''
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const putForSale = () => {
  saleForm.value = {
    price: property.value.price || '',
    description: property.value.description || ''
  }
  const modal = new bootstrap.Modal(document.getElementById('saleModal'))
  modal.show()
}

const confirmSale = () => {
  propertiesStore.putPropertyForSale(property.value.id, saleForm.value)
  property.value = propertiesStore.getPropertyById(route.params.id)
  
  const modal = bootstrap.Modal.getInstance(document.getElementById('saleModal'))
  modal.hide()
}

const removeFromSale = () => {
  if (confirm('Êtes-vous sûr de vouloir retirer cette propriété de la vente ?')) {
    propertiesStore.updateProperty(property.value.id, {
      status: 'valide',
      forSale: false
    })
    property.value = propertiesStore.getPropertyById(route.params.id)
  }
}

onMounted(() => {
  property.value = propertiesStore.getPropertyById(route.params.id)
})
</script>

<style scoped>
.satellite-image {
  height: 150px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.document-item {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
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
  margin-bottom: 20px;
  position: relative;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 15px;
  top: 35px;
  bottom: -20px;
  width: 2px;
  background-color: #dee2e6;
}

.timeline-marker {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-right: 15px;
}

.timeline-content h6 {
  margin-bottom: 5px;
  font-weight: 600;
}
</style>
