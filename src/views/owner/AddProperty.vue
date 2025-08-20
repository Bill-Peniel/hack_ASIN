<template>
  <div class="add-property">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">Ajouter une propriété</h1>
        <p class="text-muted">Enregistrez votre propriété foncière sur la plateforme</p>
      </div>
      <router-link to="/owner/properties" class="btn btn-outline-secondary">
        <i class="fas fa-arrow-left me-2"></i>Retour
      </router-link>
    </div>

    <div class="card">
      <div class="card-body">
        <form @submit.prevent="submitProperty">
          <!-- Step 1: Basic Information -->
          <div class="step-section" v-show="currentStep === 1">
            <h5 class="step-title">
              <i class="fas fa-info-circle me-2"></i>
              Informations de base
            </h5>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="title" class="form-label">Titre de la propriété *</label>
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  v-model="form.title"
                  required
                  placeholder="Ex: Terrain résidentiel à Cocody"
                >
              </div>
              <div class="col-md-6 mb-3">
                <label for="type" class="form-label">Type de propriété *</label>
                <select class="form-select" id="type" v-model="form.type" required>
                  <option value="">Sélectionnez un type</option>
                  <option value="terrain_nu">Terrain nu</option>
                  <option value="terrain_avec_batiment">Terrain avec bâtiment</option>
                  <option value="maison">Maison</option>
                  <option value="appartement">Appartement</option>
                  <option value="commercial">Local commercial</option>
                  <option value="agricole">Terrain agricole</option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="area" class="form-label">Surface (m²) *</label>
                <input
                  type="number"
                  class="form-control"
                  id="area"
                  v-model="form.area"
                  required
                  min="1"
                  placeholder="Ex: 500"
                >
              </div>
              <div class="col-md-6 mb-3">
                <label for="price" class="form-label">Prix estimé (FCFA)</label>
                <input
                  type="number"
                  class="form-control"
                  id="price"
                  v-model="form.price"
                  min="1000"
                  step="1000"
                  placeholder="Ex: 5000000"
                >
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="description"
                v-model="form.description"
                rows="4"
                placeholder="Décrivez votre propriété..."
              ></textarea>
            </div>
          </div>

          <!-- Step 2: Location -->
          <div class="step-section" v-show="currentStep === 2">
            <h5 class="step-title">
              <i class="fas fa-map-marker-alt me-2"></i>
              Localisation
            </h5>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="region" class="form-label">Région *</label>
                <select class="form-select" id="region" v-model="form.location.region" required>
                  <option value="">Sélectionnez une région</option>
                  <option value="Abidjan">Abidjan</option>
                  <option value="Yamoussoukro">Yamoussoukro</option>
                  <option value="Bouaké">Bouaké</option>
                  <option value="San-Pedro">San-Pedro</option>
                  <option value="Korhogo">Korhogo</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label for="city" class="form-label">Ville/Commune *</label>
                <input
                  type="text"
                  class="form-control"
                  id="city"
                  v-model="form.location.city"
                  required
                  placeholder="Ex: Cocody"
                >
              </div>
            </div>
            
            <div class="mb-3">
              <label for="address" class="form-label">Adresse complète *</label>
              <input
                type="text"
                class="form-control"
                id="address"
                v-model="form.location.address"
                required
                placeholder="Ex: Rue des Jardins, Riviera Golf"
              >
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="latitude" class="form-label">Latitude *</label>
                <input
                  type="number"
                  class="form-control"
                  id="latitude"
                  v-model="form.location.coordinates.lat"
                  required
                  step="any"
                  placeholder="Ex: 5.3364"
                >
              </div>
              <div class="col-md-6 mb-3">
                <label for="longitude" class="form-label">Longitude *</label>
                <input
                  type="number"
                  class="form-control"
                  id="longitude"
                  v-model="form.location.coordinates.lng"
                  required
                  step="any"
                  placeholder="Ex: -4.0267"
                >
              </div>
            </div>
            
            <!-- Map Preview -->
            <div class="mb-3">
              <label class="form-label">Aperçu sur la carte</label>
              <MapViewer 
                v-if="hasValidCoordinates"
                :latitude="parseFloat(form.location.coordinates.lat)"
                :longitude="parseFloat(form.location.coordinates.lng)"
                :title="form.title || 'Votre propriété'"
                height="300px"
              />
              <div v-else class="map-placeholder">
                <i class="fas fa-map fa-3x text-muted mb-3"></i>
                <p class="text-muted">Entrez les coordonnées GPS pour voir l'aperçu</p>
              </div>
            </div>
            
            <div class="alert alert-info">
              <i class="fas fa-info-circle me-2"></i>
              <strong>Comment obtenir les coordonnées GPS ?</strong><br>
              Utilisez Google Maps, cliquez droit sur votre propriété et sélectionnez les coordonnées affichées.
            </div>
          </div>

          <!-- Step 3: Documents -->
          <div class="step-section" v-show="currentStep === 3">
            <h5 class="step-title">
              <i class="fas fa-file-upload me-2"></i>
              Documents
            </h5>
            
            <div class="alert alert-warning">
              <i class="fas fa-exclamation-triangle me-2"></i>
              Téléchargez vos documents de propriété pour une validation plus rapide.
            </div>
            
            <DocumentUpload 
              @files-selected="onDocumentsSelected"
              :accepted-types="['pdf', 'jpg', 'jpeg', 'png']"
              :max-size="5"
            />
            
            <div class="uploaded-docs mt-3" v-if="form.documents.length > 0">
              <h6>Documents téléchargés :</h6>
              <div class="list-group">
                <div class="list-group-item" v-for="doc in form.documents" :key="doc.id">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <i class="fas fa-file me-2"></i>
                      {{ doc.name }}
                      <small class="text-muted">({{ formatFileSize(doc.size) }})</small>
                    </div>
                    <button 
                      type="button" 
                      class="btn btn-sm btn-outline-danger"
                      @click="removeDocument(doc.id)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Buttons -->
          <div class="step-navigation">
            <button 
              type="button" 
              class="btn btn-outline-secondary" 
              @click="prevStep" 
              v-if="currentStep > 1"
            >
              <i class="fas fa-arrow-left me-2"></i>Précédent
            </button>
            
            <div class="ms-auto">
              <button 
                type="button" 
                class="btn btn-primary" 
                @click="nextStep" 
                v-if="currentStep < 3"
              >
                Suivant<i class="fas fa-arrow-right ms-2"></i>
              </button>
              
              <button 
                type="submit" 
                class="btn btn-success" 
                v-if="currentStep === 3"
                :disabled="loading"
              >
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-check me-2"></i>
                Enregistrer la propriété
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- Step Indicator -->
    <div class="step-indicator">
      <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <div class="step-number">1</div>
        <div class="step-label">Informations</div>
      </div>
      <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <div class="step-number">2</div>
        <div class="step-label">Localisation</div>
      </div>
      <div class="step" :class="{ active: currentStep >= 3 }">
        <div class="step-number">3</div>
        <div class="step-label">Documents</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import MapViewer from '../../components/common/MapViewer.vue'
import DocumentUpload from '../../components/common/DocumentUpload.vue'

const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()

const currentStep = ref(1)
const loading = ref(false)

const form = ref({
  title: '',
  type: '',
  area: '',
  price: '',
  description: '',
  location: {
    region: '',
    city: '',
    address: '',
    coordinates: {
      lat: '',
      lng: ''
    }
  },
  documents: []
})

const hasValidCoordinates = computed(() => {
  return form.value.location.coordinates.lat && 
         form.value.location.coordinates.lng &&
         !isNaN(parseFloat(form.value.location.coordinates.lat)) &&
         !isNaN(parseFloat(form.value.location.coordinates.lng))
})

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const onDocumentsSelected = (files) => {
  files.forEach(file => {
    form.value.documents.push({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    })
  })
}

const removeDocument = (docId) => {
  const index = form.value.documents.findIndex(doc => doc.id === docId)
  if (index !== -1) {
    form.value.documents.splice(index, 1)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const submitProperty = async () => {
  loading.value = true
  
  try {
    const propertyData = {
      ...form.value,
      ownerId: authStore.user?.id,
      location: {
        ...form.value.location,
        coordinates: {
          lat: parseFloat(form.value.location.coordinates.lat),
          lng: parseFloat(form.value.location.coordinates.lng)
        }
      },
      area: parseFloat(form.value.area),
      price: form.value.price ? parseFloat(form.value.price) : undefined
    }
    
    const newProperty = await propertiesStore.addProperty(propertyData)
    
    // Redirect to property details
    router.push(`/owner/property/${newProperty.id}`)
  } catch (error) {
    console.error('Error adding property:', error)
    alert('Erreur lors de l\'enregistrement de la propriété')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.step-section {
  margin-bottom: 2rem;
}

.step-title {
  color: #8B4513;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #8B4513;
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
}

.step-indicator {
  position: fixed;
  top: 120px;
  right: 20px;
  z-index: 1000;
  background: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 0.9rem;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  color: #6c757d;
  font-weight: bold;
  font-size: 0.8rem;
}

.step.active .step-number {
  background-color: #8B4513;
  color: white;
}

.step.completed .step-number {
  background-color: #28a745;
  color: white;
}

.step-label {
  color: #6c757d;
}

.step.active .step-label {
  color: #8B4513;
  font-weight: 600;
}

.map-placeholder {
  height: 300px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.uploaded-docs .list-group-item {
  border: none;
  background-color: #f8f9fa;
  margin-bottom: 5px;
  border-radius: 5px;
}

.btn-primary {
  background-color: #8B4513;
  border-color: #8B4513;
}

.btn-primary:hover {
  background-color: #7A4012;
  border-color: #7A4012;
}

@media (max-width: 768px) {
  .step-indicator {
    position: relative;
    top: auto;
    right: auto;
    margin-bottom: 20px;
  }
  
  .step {
    flex-direction: column;
    text-align: center;
    gap: 5px;
  }
}
</style>
