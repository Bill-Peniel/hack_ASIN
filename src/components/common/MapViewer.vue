<template>
  <div :id="mapId" :style="{ height: height }" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: 'Propriété'
  },
  height: {
    type: String,
    default: '300px'
  },
  zoom: {
    type: Number,
    default: 15
  },
  interactive: {
    type: Boolean,
    default: true
  }
})

const mapId = ref(`map-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
let map = null
let marker = null

const initializeMap = () => {
  if (typeof L === 'undefined') {
    console.error('Leaflet is not loaded')
    return
  }

  try {
    // Initialize map
    map = L.map(mapId.value, {
      scrollWheelZoom: props.interactive,
      dragging: props.interactive,
      touchZoom: props.interactive,
      doubleClickZoom: props.interactive,
      boxZoom: props.interactive,
      keyboard: props.interactive,
      tap: props.interactive
    }).setView([props.latitude, props.longitude], props.zoom)

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map)

    // Add marker
    marker = L.marker([props.latitude, props.longitude])
      .addTo(map)
      .bindPopup(props.title)
      .openPopup()

    // Custom marker icon for property
    const propertyIcon = L.divIcon({
      className: 'custom-marker',
      html: '<i class="fas fa-map-marker-alt" style="color: #8B4513; font-size: 24px;"></i>',
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    })

    marker.setIcon(propertyIcon)

  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

const updateMapLocation = () => {
  if (map && marker) {
    const newLatLng = [props.latitude, props.longitude]
    map.setView(newLatLng, props.zoom)
    marker.setLatLng(newLatLng)
    marker.bindPopup(props.title)
  }
}

// Watch for prop changes
watch(() => [props.latitude, props.longitude], updateMapLocation)
watch(() => props.title, () => {
  if (marker) {
    marker.bindPopup(props.title)
  }
})

onMounted(() => {
  // Wait for DOM to be ready and Leaflet to be loaded
  setTimeout(initializeMap, 100)
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
    marker = null
  }
})
</script>

<style scoped>
.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #dee2e6;
}

:deep(.leaflet-container) {
  font-family: inherit;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 8px;
}

:deep(.leaflet-popup-content) {
  margin: 10px 15px;
  font-weight: 600;
  color: #333;
}

:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
  background-color: rgba(255, 255, 255, 0.8);
}

/* Loading state */
.map-container:empty::before {
  content: 'Chargement de la carte...';
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  background-color: #f8f9fa;
}
</style>
