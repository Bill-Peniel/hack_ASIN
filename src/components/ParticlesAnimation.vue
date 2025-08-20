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
  const particleCount = 1000 // Optimized count
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Position - spread particles in a more flat distribution
    positions[i3] = (Math.random() - 0.5) * 800      // x
    positions[i3 + 1] = (Math.random() - 0.5) * 600  // y
    positions[i3 + 2] = (Math.random() - 0.5) * 100  // z (shallow)

    // Store original positions
    originalPositions.push({
      x: positions[i3],
      y: positions[i3 + 1],
      z: positions[i3 + 2]
    })

    // Colors - green to cyan gradient
    const hue = 0.3 + Math.random() * 0.2 // Green to cyan
    const color = new THREE.Color().setHSL(hue, 0.8, 0.6)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }

  particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // Simple point material
  particleMaterial = new THREE.PointsMaterial({
    size: 4,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  })

  particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)

  console.log('Particles created:', particleCount)
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
    // Gentle rotation
    particleSystem.rotation.y += 0.001
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