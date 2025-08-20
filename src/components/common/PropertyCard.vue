<template>
  <div class="property-card" :class="{ 'card-sm': size === 'sm' }">
    <div class="card h-100">
      <div class="position-relative">
        <!-- Property Image -->
        <div class="property-image">
          <div class="image-placeholder">
            <i class="fas fa-home fa-2x text-muted"></i>
          </div>
          <!-- Property Type Badge -->
          <span class="badge position-absolute top-0 start-0 m-2" :class="getTypeBadgeClass(property.type)">
            {{ formatPropertyType(property.type) }}
          </span>
          <!-- Price Badge -->
          <span class="badge bg-primary position-absolute top-0 end-0 m-2" v-if="property.price">
            {{ formatPrice(property.price) }}
          </span>
          <!-- Status Badge -->
          <span class="badge position-absolute bottom-0 end-0 m-2" :class="getStatusBadgeClass(property.status)">
            {{ getStatusLabel(property.status) }}
          </span>
        </div>
      </div>
      
      <div class="card-body d-flex flex-column">
        <h6 class="card-title mb-2" :class="{ 'h7': size === 'sm' }">{{ property.title }}</h6>
        
        <div class="property-location mb-2">
          <i class="fas fa-map-marker-alt text-muted me-1"></i>
          <small class="text-muted">{{ property.location.city }}, {{ property.location.region }}</small>
        </div>
        
        <div class="property-details mb-3" :class="{ 'small': size === 'sm' }">
          <div class="detail-row">
            <span class="detail-label">Surface:</span>
            <span class="detail-value">{{ property.area }} m²</span>
          </div>
          <div class="detail-row" v-if="property.price">
            <span class="detail-label">Prix/m²:</span>
            <span class="detail-value">{{ formatPrice(property.price / property.area) }}/m²</span>
          </div>
        </div>
        
        <!-- Owner Info (if requested) -->
        <div v-if="showOwner" class="owner-info mb-3">
          <div class="d-flex align-items-center">
            <div class="owner-avatar me-2">
              {{ getOwnerInitials(property.ownerId) }}
            </div>
            <div class="owner-details">
              <small class="fw-semibold">{{ getOwnerName(property.ownerId) }}</small>
              <br>
              <small class="text-muted">Propriétaire</small>
            </div>
          </div>
        </div>
        
        <!-- AI Verification -->
        <div class="verification-status mb-3" v-if="property.status === 'valide'">
          <div class="d-flex align-items-center">
            <i class="fas fa-shield-check text-success me-2"></i>
            <small class="text-success fw-semibold">Vérifié par IA</small>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="mt-auto">
          <div class="btn-group w-100" :class="{ 'btn-group-sm': size === 'sm' }">
            <button 
              class="btn btn-primary flex-fill" 
              @click="$emit('view', property.id)"
            >
              <i class="fas fa-eye me-1"></i>
              {{ size === 'sm' ? 'Voir' : 'Voir détails' }}
            </button>
            <button 
              class="btn btn-outline-primary" 
              @click="$emit('contact', property)"
              :title="'Contacter ' + getOwnerName(property.ownerId)"
            >
              <i class="fas fa-comments"></i>
            </button>
            <button 
              class="btn btn-outline-danger" 
              @click="$emit('favorite', property)"
              :title="isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            >
              <i :class="isFavorite ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUsersStore } from '../../stores/users'

const props = defineProps({
  property: {
    type: Object,
    required: true
  },
  showOwner: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md', // 'sm' or 'md'
    validator: (value) => ['sm', 'md'].includes(value)
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view', 'contact', 'favorite'])

const usersStore = useUsersStore()

const getOwnerName = (ownerId) => {
  const user = usersStore.getUserById(ownerId)
  return user ? `${user.firstName} ${user.lastName}` : 'Propriétaire'
}

const getOwnerInitials = (ownerId) => {
  const user = usersStore.getUserById(ownerId)
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'P'
}

const formatPrice = (price) => {
  if (!price) return 'N/A'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatPropertyType = (type) => {
  const types = {
    'terrain_nu': 'Terrain nu',
    'terrain_avec_batiment': 'Avec bâtiment',
    'maison': 'Maison',
    'appartement': 'Appartement',
    'commercial': 'Commercial',
    'agricole': 'Agricole'
  }
  return types[type] || type
}

const getTypeBadgeClass = (type) => {
  const classes = {
    'terrain_nu': 'bg-secondary',
    'terrain_avec_batiment': 'bg-info',
    'maison': 'bg-success',
    'appartement': 'bg-warning',
    'commercial': 'bg-primary',
    'agricole': 'bg-success'
  }
  return classes[type] || 'bg-secondary'
}

const getStatusLabel = (status) => {
  const labels = {
    'disponible': 'Disponible',
    'en_attente_validation': 'En attente',
    'valide': 'Validée',
    'rejete': 'Rejetée'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'disponible': 'bg-success',
    'en_attente_validation': 'bg-warning',
    'valide': 'bg-info',
    'rejete': 'bg-danger'
  }
  return classes[status] || 'bg-secondary'
}
</script>

<style scoped>
.property-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.property-card:hover {
  transform: translateY(-2px);
}

.property-card .card {
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.property-card:hover .card {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.property-image {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  overflow: hidden;
}

.card-sm .property-image {
  height: 150px;
}

.image-placeholder {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #f8f9fa 25%, transparent 25%), 
              linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, #f8f9fa 75%), 
              linear-gradient(-45deg, transparent 75%, #f8f9fa 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}

.card-title {
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.h7 {
  font-size: 0.9rem;
}

.property-location {
  display: flex;
  align-items: center;
}

.property-details {
  border-top: 1px solid #f1f3f5;
  border-bottom: 1px solid #f1f3f5;
  padding: 8px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  color: #6c757d;
  font-size: 0.85rem;
}

.detail-value {
  font-weight: 600;
  color: #333;
  font-size: 0.85rem;
}

.owner-info {
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
}

.owner-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.7rem;
}

.owner-details {
  line-height: 1.2;
}

.verification-status {
  padding: 4px 0;
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

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
}

.badge {
  font-size: 0.7rem;
  padding: 4px 8px;
}

.bg-primary {
  background-color: #8B4513 !important;
}
</style>
