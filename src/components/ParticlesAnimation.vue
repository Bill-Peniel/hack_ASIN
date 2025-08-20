<template>
  <div ref="container" class="particles-3d-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer
let particleSystem, particleGeometry, particleMaterial
let animationId

const mouse = { x: 0, y: 0 }
const originalPositions = []
let mouseWorldPos = new THREE.Vector3()

// Coordonnées simplifiées de la carte du Bénin
const beninMapPoints = [
  // Frontière ouest (avec le Togo)
  { x: -1, y: 1 }, { x: -1, y: 0.8 }, { x: -0.9, y: 0.6 }, { x: -0.8, y: 0.4 },
  { x: -0.7, y: 0.2 }, { x: -0.6, y: 0 }, { x: -0.5, y: -0.2 }, { x: -0.4, y: -0.4 },
  { x: -0.3, y: -0.6 }, { x: -0.2, y: -0.8 }, { x: -0.1, y: -1 },
  
  // Côte atlantique (sud)
  { x: -0.1, y: -1 }, { x: 0.1, y: -1 }, { x: 0.3, y: -0.95 }, { x: 0.5, y: -0.9 },
  { x: 0.7, y: -0.85 }, { x: 0.9, y: -0.8 },
  
  // Frontière est (avec le Nigeria)
  { x: 0.9, y: -0.8 }, { x: 1, y: -0.6 }, { x: 1.1, y: -0.4 }, { x: 1.2, y: -0.2 },
  { x: 1.1, y: 0 }, { x: 1, y: 0.2 }, { x: 0.9, y: 0.4 }, { x: 0.8, y: 0.6 },
  
  // Frontière nord (avec le Niger et le Burkina Faso)
  { x: 0.8, y: 0.8 }, { x: 0.6, y: 1 }, { x: 0.4, y: 1.1 }, { x: 0.2, y: 1.2 },
  { x: 0, y: 1.1 }, { x: -0.2, y: 1.05 }, { x: -0.4, y: 1.02 }, { x: -0.6, y: 1.01 },
  { x: -0.8, y: 1.005 }, { x: -1, y: 1 },
  
  // Points intérieurs pour density
  { x: -0.5, y: 0.5 }, { x: -0.3, y: 0.3 }, { x: -0.1, y: 0.1 }, { x: 0.1, y: -0.1 },
  { x: 0.3, y: -0.3 }, { x: 0.5, y: -0.5 }, { x: 0.7, y: -0.1 }, { x: 0.5, y: 0.3 },
  { x: 0.3, y: 0.5 }, { x: 0.1, y: 0.7 }, { x: -0.1, y: 0.8 }, { x: -0.3, y: 0.6 },
  { x: -0.5, y: 0.8 }, { x: -0.7, y: 0.9 }, { x: 0.6, y: 0.1 }, { x: 0.8, y: 0.3 },
  
  // Villes principales
  { x: 0.2, y: -0.7 }, // Porto-Novo (capitale)
  { x: 0.1, y: -0.6 }, // Cotonou (économique)
  { x: -0.2, y: 0.8 }, // Parakou (centre)
  { x: 0.5, y: 0.9 }, // Natitingou (nord-ouest)
  { x: 0.8, y: 0.7 }, // Kandi (nord-est)
]

const initThreeJS = () => {
  if (!container.value) return

  try {
    // Scene setup
    scene = new THREE.Scene()
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
      75, 
      container.value.clientWidth / container.value.clientHeight, 
      0.1, 
      1000
    )
    camera.position.z = 300

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.value.clientWidth, container.value.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.value.appendChild(renderer.domElement)

    // Create particle system
    createParticles()
    
    // Event listeners
    container.value.addEventListener('mousemove', onMouseMove, false)
    container.value.addEventListener('mouseleave', resetParticles, false)
    window.addEventListener('resize', onWindowResize, false)

    // Start animation loop
    animate()
    
    console.log('Three.js initialized successfully')
  } catch (error) {
    console.error('Error initializing Three.js:', error)
  }
}

const createParticles = () => {
  const particlesPerPoint = 15 // Particules par point de la carte
  const totalParticles = beninMapPoints.length * particlesPerPoint
  const positions = new Float32Array(totalParticles * 3)
  const colors = new Float32Array(totalParticles * 3)
  const sizes = new Float32Array(totalParticles)

  let particleIndex = 0

  // Créer des particules autour de chaque point de la carte du Bénin
  beninMapPoints.forEach((mapPoint, pointIndex) => {
    for (let i = 0; i < particlesPerPoint; i++) {
      const i3 = particleIndex * 3
      
      // Position basée sur les coordonnées de la carte avec variation aléatoire
      const scale = 200 // Taille de la carte
      const scatter = 25 // Dispersion autour des points
      
      positions[i3] = mapPoint.x * scale + (Math.random() - 0.5) * scatter
      positions[i3 + 1] = mapPoint.y * scale + (Math.random() - 0.5) * scatter
      positions[i3 + 2] = (Math.random() - 0.5) * 20 // Profondeur légère

      // Store original positions
      originalPositions.push({
        x: positions[i3],
        y: positions[i3 + 1],
        z: positions[i3 + 2]
      })

      // Couleurs - dégradé selon la position (nord-sud)
      const normalizedY = (mapPoint.y + 1.2) / 2.4 // Normaliser entre 0 et 1
      const hue = 0.25 + normalizedY * 0.25 // Du vert au cyan du sud au nord
      const saturation = 0.7 + Math.random() * 0.3
      const lightness = 0.5 + Math.random() * 0.3
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness)
      colors[i3] = color.r
      colors[i3 + 1] = color.g
      colors[i3 + 2] = color.b
      
      // Tailles variées - plus grandes pour les frontières
      const isBoader = pointIndex < 20 || pointIndex >= beninMapPoints.length - 8
      sizes[particleIndex] = isBoader ? 6 + Math.random() * 4 : 3 + Math.random() * 3
      
      particleIndex++
    }
  })

  particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // Matériau avec tailles variables
  particleMaterial = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  })

  particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)

  console.log('Particules créées pour la carte du Bénin:', totalParticles)
}

const onMouseMove = (event) => {
  if (!container.value) return
  
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Convert to world coordinates
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0)
  vector.unproject(camera)
  mouseWorldPos.copy(vector)

  updateParticles()
}

const updateParticles = () => {
  if (!particleSystem || !particleGeometry) return

  const positions = particleGeometry.attributes.position.array
  const interactionRadius = 100

  for (let i = 0; i < originalPositions.length; i++) {
    const i3 = i * 3
    const originalPos = originalPositions[i]
    
    // Calculate distance from particle to mouse
    const dx = originalPos.x - mouseWorldPos.x
    const dy = originalPos.y - mouseWorldPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance < interactionRadius) {
      // Repulsion effect
      const force = (interactionRadius - distance) / interactionRadius
      const angle = Math.atan2(dy, dx)
      
      const pushDistance = force * 60
      positions[i3] = originalPos.x + Math.cos(angle) * pushDistance
      positions[i3 + 1] = originalPos.y + Math.sin(angle) * pushDistance
    } else {
      // Return to original position
      const returnSpeed = 0.05
      positions[i3] += (originalPos.x - positions[i3]) * returnSpeed
      positions[i3 + 1] += (originalPos.y - positions[i3 + 1]) * returnSpeed
    }
  }
  
  particleGeometry.attributes.position.needsUpdate = true
}

const resetParticles = () => {
  if (!particleSystem || !particleGeometry) return
  
  const positions = particleGeometry.attributes.position.array
  
  for (let i = 0; i < originalPositions.length; i++) {
    const i3 = i * 3
    positions[i3] = originalPositions[i].x
    positions[i3 + 1] = originalPositions[i].y
    positions[i3 + 2] = originalPositions[i].z
  }
  
  particleGeometry.attributes.position.needsUpdate = true
}



const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (particleSystem) {
    // Rotation très subtile pour garder la forme reconnaissable
    particleSystem.rotation.y += 0.0005
    particleSystem.rotation.z = Math.sin(Date.now() * 0.0001) * 0.05 // Balancement léger
  }
  
  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

const onWindowResize = () => {
  if (!container.value) return
  
  camera.aspect = container.value.clientWidth / container.value.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
}

onMounted(() => {
  initThreeJS()
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  
  if (container.value && renderer) {
    container.value.removeEventListener('mousemove', onMouseMove)
    container.value.removeEventListener('mouseleave', resetParticles)
    window.removeEventListener('resize', onWindowResize)
    
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
    renderer.dispose()
  }
  
  // Cleanup Three.js objects
  if (particleGeometry) particleGeometry.dispose()
  if (particleMaterial) particleMaterial.dispose()
})
</script>

<style scoped>
.particles-3d-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.particles-3d-container canvas {
  display: block;
}
</style>