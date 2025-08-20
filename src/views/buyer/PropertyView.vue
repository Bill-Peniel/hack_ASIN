<template>
  <div class="property-view" v-if="property">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3">{{ property.title }}</h1>
        <p class="text-muted">{{ property.location.address }}, {{ property.location.city }}</p>
      </div>
      <div class="d-flex gap-2">
        <button 
          class="btn btn-outline-danger"
          :class="{ 'btn-danger text-white': isFavorite }"
          @click="toggleFavorite"
        >
          <i class="fas fa-heart me-2"></i>
          {{ isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
        </button>
        <router-link to="/buyer/marketplace" class="btn btn-outline-secondary">
          <i class="fas fa-arrow-left me-2"></i>Retour
        </router-link>
      </div>
    </div>

    <div class="row">
      <!-- Main Content -->
      <div class="col-lg-8">
        <!-- Property Images/Gallery -->
        <div class="card mb-4">
          <div class="card-body p-0">
            <div class="property-gallery">
              <div class="main-image bg-light d-flex align-items-center justify-content-center">
                <div class="text-center text-muted">
                  <i class="fas fa-image fa-3x mb-3"></i>
                  <h5>{{ property.title }}</h5>
                  <p>Photo principale à venir</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Property Details -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-info-circle me-2"></i>
              Détails de la propriété
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="detail-item">
                  <strong>Type :</strong> {{ formatPropertyType(property.type) }}
                </div>
                <div class="detail-item">
                  <strong>Surface :</strong> {{ property.area }} m²
                </div>
                <div class="detail-item">
                  <strong>Prix :</strong> 
                  <span class="text-primary fw-bold fs-5">{{ formatPrice(property.price) }}</span>
                </div>
                <div class="detail-item">
                  <strong>Région :</strong> {{ property.location.region }}
                </div>
              </div>
              <div class="col-md-6">
                <div class="detail-item">
                  <strong>Ville :</strong> {{ property.location.city }}
                </div>
                <div class="detail-item">
                  <strong>Coordonnées GPS :</strong><br>
                  <small class="text-muted">{{ property.location.coordinates.lat }}, {{ property.location.coordinates.lng }}</small>
                </div>
                <div class="detail-item">
                  <strong>Statut :</strong>
                  <span class="badge bg-success">Disponible</span>
                </div>
                <div class="detail-item">
                  <strong>Publié le :</strong> {{ formatDate(property.createdAt) }}
                </div>
              </div>
            </div>
            
            <div v-if="property.description" class="mt-3">
              <h6>Description :</h6>
              <p class="text-muted">{{ property.description }}</p>
            </div>
          </div>
        </div>

        <!-- Map Location -->
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

        <!-- AI Verification -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-shield-alt me-2"></i>
              Vérification IA
            </h5>
          </div>
          <div class="card-body">
            <div class="alert alert-success">
              <div class="d-flex align-items-center">
                <i class="fas fa-check-circle fa-2x me-3"></i>
                <div>
                  <h6 class="mb-1">Propriété vérifiée</h6>
                  <p class="mb-0">Cette propriété a été vérifiée par notre système IA et validée par nos administrateurs.</p>
                </div>
              </div>
            </div>
            <div class="row mt-3">
              <div class="col-md-4">
                <div class="verification-item">
                  <i class="fas fa-file-check text-success me-2"></i>
                  <span>Documents validés</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="verification-item">
                  <i class="fas fa-satellite text-success me-2"></i>
                  <span>Surveillance satellite</span>
                </div>
              </div>
              <div class="col-md-4">
                <div class="verification-item">
                  <i class="fas fa-gavel text-success me-2"></i>
                  <span>Légalement conforme</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Similar Properties -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-home me-2"></i>
              Propriétés similaires
            </h5>
          </div>
          <div class="card-body">
            <div class="row">
              <div 
                class="col-md-6 mb-3" 
                v-for="similar in similarProperties" 
                :key="similar.id"
              >
                <PropertyCard 
                  :property="similar" 
                  :show-owner="true"
                  size="sm"
                  @view="viewProperty"
                  @contact="contactOwner"
                />
              </div>
            </div>
            <div v-if="similarProperties.length === 0" class="text-center text-muted py-3">
              <i class="fas fa-home fa-2x mb-2"></i>
              <p>Aucune propriété similaire trouvée</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Owner Info -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-user me-2"></i>
              Propriétaire
            </h5>
          </div>
          <div class="card-body text-center">
            <div class="owner-avatar mb-3">
              {{ ownerInitials }}
            </div>
            <h6>{{ ownerName }}</h6>
            <p class="text-muted small">Membre depuis {{ formatDate(owner?.createdAt) }}</p>
            
            <div class="owner-stats mb-3">
              <div class="row">
                <div class="col">
                  <div class="stat-value">{{ ownerProperties.length }}</div>
                  <div class="stat-label">Propriétés</div>
                </div>
                <div class="col">
                  <div class="stat-value">4.8</div>
                  <div class="stat-label">Note</div>
                </div>
              </div>
            </div>
            
            <div class="d-grid gap-2">
              <button class="btn btn-primary" @click="contactOwner(property)">
                <i class="fas fa-comments me-2"></i>Contacter
              </button>
              <button class="btn btn-outline-primary" @click="viewOwnerProperties">
                <i class="fas fa-eye me-2"></i>Voir ses propriétés
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Actions -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-shopping-cart me-2"></i>
              Actions d'achat
            </h5>
          </div>
          <div class="card-body">
            <div class="price-display mb-3">
              <div class="current-price">
                {{ formatPrice(property.price) }}
              </div>
              <small class="text-muted">Prix de vente</small>
            </div>
            
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-lg" @click="initiatepurchase">
                <i class="fas fa-credit-card me-2"></i>Acheter maintenant
              </button>
              <button class="btn btn-outline-primary" @click="makeOffer">
                <i class="fas fa-handshake me-2"></i>Faire une offre
              </button>
              <button class="btn btn-outline-secondary" @click="scheduleVisit">
                <i class="fas fa-calendar me-2"></i>Planifier une visite
              </button>
            </div>
            
            <div class="payment-info mt-3">
              <small class="text-muted">
                <i class="fas fa-shield-alt me-1"></i>
                Paiement sécurisé via la plateforme
              </small>
            </div>
          </div>
        </div>

        <!-- Property Stats -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">
              <i class="fas fa-chart-bar me-2"></i>
              Statistiques
            </h5>
          </div>
          <div class="card-body">
            <div class="stat-row">
              <span>Vues :</span>
              <span class="fw-bold">{{ Math.floor(Math.random() * 100) + 20 }}</span>
            </div>
            <div class="stat-row">
              <span>Intéressés :</span>
              <span class="fw-bold">{{ Math.floor(Math.random() * 10) + 3 }}</span>
            </div>
            <div class="stat-row">
              <span>Prix/m² :</span>
              <span class="fw-bold">{{ formatPrice(property.price / property.area) }}/m²</span>
            </div>
            <div class="stat-row">
              <span>Dernière visite :</span>
              <span class="fw-bold">{{ formatDate(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal 
      v-if="showPaymentModal"
      :property="property"
      :amount="property.price"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
    />
  </div>

  <div v-else class="text-center py-5">
    <i class="fas fa-exclamation-triangle fa-3x text-muted mb-3"></i>
    <h5 class="text-muted">Propriété non trouvée</h5>
    <router-link to="/buyer/marketplace" class="btn btn-primary">
      <i class="fas fa-arrow-left me-2"></i>Retour au marketplace
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { usePropertiesStore } from '../../stores/properties'
import { useChatStore } from '../../stores/chat'
import { useUsersStore } from '../../stores/users'
import MapViewer from '../../components/common/MapViewer.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'
import PaymentModal from '../../components/common/PaymentModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const propertiesStore = usePropertiesStore()
const chatStore = useChatStore()
const usersStore = useUsersStore()

const property = ref(null)
const showPaymentModal = ref(false)

// Mock favorites
const favorites = ref([])

const isFavorite = computed(() => 
  favorites.value.some(f => f.id === property.value?.id)
)

const owner = computed(() => 
  property.value ? usersStore.getUserById(property.value.ownerId) : null
)

const ownerName = computed(() => 
  owner.value ? `${owner.value.firstName} ${owner.value.lastName}` : 'Propriétaire'
)

const ownerInitials = computed(() => 
  owner.value ? `${owner.value.firstName?.[0] || ''}${owner.value.lastName?.[0] || ''}` : 'P'
)

const ownerProperties = computed(() => 
  property.value ? propertiesStore.getPropertiesByOwner(property.value.ownerId) : []
)

const similarProperties = computed(() => {
  if (!property.value) return []
  
  return propertiesStore.getAvailableProperties()
    .filter(p => 
      p.id !== property.value.id &&
      (p.type === property.value.type || p.location.region === property.value.location.region)
    )
    .slice(0, 4)
})

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

const formatPropertyType = (type) => {
  const types = {
    'terrain_nu': 'Terrain nu',
    'terrain_avec_batiment': 'Terrain avec bâtiment',
    'maison': 'Maison',
    'appartement': 'Appartement',
    'commercial': 'Local commercial',
    'agricole': 'Terrain agricole'
  }
  return types[type] || type
}

const toggleFavorite = () => {
  const index = favorites.value.findIndex(f => f.id === property.value.id)
  if (index === -1) {
    favorites.value.push(property.value)
  } else {
    favorites.value.splice(index, 1)
  }
}

const contactOwner = (prop) => {
  const chat = chatStore.createChat(prop.id, authStore.user?.id, prop.ownerId)
  router.push(`/chat?chatId=${chat.id}`)
}

const viewOwnerProperties = () => {
  router.push({
    path: '/buyer/marketplace',
    query: { owner: property.value.ownerId }
  })
}

const viewProperty = (propertyId) => {
  router.push(`/buyer/property/${propertyId}`)
}

const initiateePurchase = () => {
  showPaymentModal.value = true
}

const makeOffer = () => {
  const offerAmount = prompt(`Entrez votre offre pour cette propriété (Prix demandé: ${formatPrice(property.value.price)})`)
  if (offerAmount && !isNaN(offerAmount)) {
    alert(`Votre offre de ${formatPrice(parseInt(offerAmount))} a été transmise au propriétaire.`)
    // In a real app, this would create a formal offer
  }
}

const scheduleVisit = () => {
  alert('Fonctionnalité de planification de visite à venir. Le propriétaire sera contacté pour organiser une visite.')
}

const handlePaymentSuccess = () => {
  alert('Félicitations! Votre achat a été finalisé avec succès.')
  router.push('/buyer/dashboard')
}

onMounted(() => {
  property.value = propertiesStore.getPropertyById(route.params.id)
  
  // Mock some favorites for demo
  if (property.value && Math.random() > 0.7) {
    favorites.value.push(property.value)
  }
})
</script>

<style scoped>
.property-gallery .main-image {
  height: 400px;
  border-radius: 8px;
  border: 2px dashed #dee2e6;
}

.detail-item {
  margin-bottom: 15px;
}

.verification-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.owner-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto;
}

.owner-stats {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: uppercase;
}

.price-display {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #8B4513;
}

.current-price {
  font-size: 2rem;
  font-weight: bold;
  color: #8B4513;
}

.payment-info {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #dee2e6;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
}

.stat-row:last-child {
  border-bottom: none;
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
