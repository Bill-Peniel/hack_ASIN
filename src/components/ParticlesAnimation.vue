<template>
  <div ref="container" class="particles-3d-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, mouse, raycaster, intersectedParticle
let particleSystem, particleGeometry, particleMaterial
let animationId

const mouse3D = new THREE.Vector2()
const originalColors = []
const originalPositions = []

const initThreeJS = () => {
  if (!container.value) return

  // Scene setup
  scene = new THREE.Scene()
  
  // Camera setup
  camera = new THREE.PerspectiveCamera(
    75, 
    container.value.clientWidth / container.value.clientHeight, 
    0.1, 
    1000
  )
  camera.position.z = 500

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(container.value.clientWidth, container.value.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setClearColor(0x000000, 0)
  container.value.appendChild(renderer.domElement)

  // Raycaster for mouse interaction
  raycaster = new THREE.Raycaster()
  mouse = new THREE.Vector2()

  // Create particle system
  createParticles()
  
  // Event listeners
  container.value.addEventListener('mousemove', onMouseMove, false)
  container.value.addEventListener('click', onMouseClick, false)
  window.addEventListener('resize', onWindowResize, false)

  // Start animation loop
  animate()
}

const createParticles = () => {
  const particleCount = 2000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const color = new THREE.Color()

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Position - create a more organic distribution
    const radius = Math.random() * 600 + 100
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) 
    positions[i3 + 2] = radius * Math.cos(phi)

    // Store original positions
    originalPositions.push({
      x: positions[i3],
      y: positions[i3 + 1],
      z: positions[i3 + 2]
    })

    // Colors - gradient from green to blue
    const mixRatio = Math.random()
    color.setHSL(0.3 + mixRatio * 0.3, 0.8, 0.6) // Green to cyan gradient
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    // Store original colors
    originalColors.push({ r: color.r, g: color.g, b: color.b })

    // Sizes
    sizes[i] = Math.random() * 8 + 2
  }

  particleGeometry = new THREE.BufferGeometry()
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // Particle shader material for better performance and effects
  particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      mousePos: { value: new THREE.Vector2(0, 0) },
      mouseRadius: { value: 100.0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      varying float vDistanceToMouse;
      uniform float time;
      uniform vec2 mousePos;
      uniform float mouseRadius;
      
      void main() {
        vColor = color;
        
        vec3 pos = position;
        
        // Wave animation
        pos.z += sin(time * 0.002 + position.x * 0.01) * 20.0;
        pos.y += cos(time * 0.001 + position.z * 0.01) * 15.0;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        
        // Calculate distance to mouse for interaction
        vec2 screenPos = (mvPosition.xy / mvPosition.w) * 0.5 + 0.5;
        vDistanceToMouse = distance(screenPos, mousePos);
        
        gl_Position = projectionMatrix * mvPosition;
        
        // Size based on distance and mouse proximity
        float mouseEffect = 1.0 + (1.0 - smoothstep(0.0, mouseRadius * 0.01, vDistanceToMouse)) * 2.0;
        gl_PointSize = size * mouseEffect * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDistanceToMouse;
      uniform vec2 mousePos;
      uniform float mouseRadius;
      
      void main() {
        // Create circular particles
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        // Mouse interaction glow effect
        float mouseGlow = 1.0 - smoothstep(0.0, mouseRadius * 0.01, vDistanceToMouse);
        vec3 glowColor = vec3(1.0, 1.0, 1.0) * mouseGlow * 0.5;
        
        // Smooth circular shape with glow
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        vec3 finalColor = vColor + glowColor;
        
        gl_FragColor = vec4(finalColor, alpha * (0.6 + mouseGlow * 0.4));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  particleSystem = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particleSystem)
}

const onMouseMove = (event) => {
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

  // Update shader uniforms
  if (particleMaterial) {
    particleMaterial.uniforms.mousePos.value.set(
      (mouse.x + 1) * 0.5,
      (mouse.y + 1) * 0.5
    )
  }

  // Repulsion effect
  raycaster.setFromCamera(mouse, camera)
  
  if (particleSystem) {
    const positions = particleGeometry.attributes.position.array
    const mouseWorldPos = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera)
    
    for (let i = 0; i < positions.length; i += 3) {
      const particlePos = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2])
      const distance = particlePos.distanceTo(mouseWorldPos)
      
      if (distance < 150) {
        const force = (150 - distance) / 150
        const direction = particlePos.clone().sub(mouseWorldPos).normalize()
        
        positions[i] = originalPositions[i / 3].x + direction.x * force * 50
        positions[i + 1] = originalPositions[i / 3].y + direction.y * force * 50
        positions[i + 2] = originalPositions[i / 3].z + direction.z * force * 30
      } else {
        // Return to original position
        const returnSpeed = 0.05
        positions[i] += (originalPositions[i / 3].x - positions[i]) * returnSpeed
        positions[i + 1] += (originalPositions[i / 3].y - positions[i + 1]) * returnSpeed
        positions[i + 2] += (originalPositions[i / 3].z - positions[i + 2]) * returnSpeed
      }
    }
    
    particleGeometry.attributes.position.needsUpdate = true
  }
}

const onMouseClick = (event) => {
  // Create explosion effect at click position
  const rect = container.value.getBoundingClientRect()
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  
  createExplosionEffect(mouse)
}

const createExplosionEffect = (clickPos) => {
  const explosionGeometry = new THREE.BufferGeometry()
  const explosionCount = 50
  const positions = new Float32Array(explosionCount * 3)
  const velocities = []
  
  const clickWorldPos = new THREE.Vector3(clickPos.x, clickPos.y, 0).unproject(camera)
  
  for (let i = 0; i < explosionCount; i++) {
    const i3 = i * 3
    positions[i3] = clickWorldPos.x
    positions[i3 + 1] = clickWorldPos.y
    positions[i3 + 2] = clickWorldPos.z
    
    // Random velocity for explosion
    velocities.push({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 10
    })
  }
  
  explosionGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  const explosionMaterial = new THREE.PointsMaterial({
    color: 0x46e569,
    size: 5,
    transparent: true,
    opacity: 1
  })
  
  const explosionParticles = new THREE.Points(explosionGeometry, explosionMaterial)
  scene.add(explosionParticles)
  
  // Animate explosion
  let explosionTime = 0
  const animateExplosion = () => {
    explosionTime += 16
    const positions = explosionGeometry.attributes.position.array
    
    for (let i = 0; i < explosionCount; i++) {
      const i3 = i * 3
      positions[i3] += velocities[i].x
      positions[i3 + 1] += velocities[i].y
      positions[i3 + 2] += velocities[i].z
      
      velocities[i].y -= 0.5 // Gravity
    }
    
    explosionGeometry.attributes.position.needsUpdate = true
    explosionMaterial.opacity = Math.max(0, 1 - explosionTime / 1000)
    
    if (explosionTime < 1000) {
      requestAnimationFrame(animateExplosion)
    } else {
      scene.remove(explosionParticles)
    }
  }
  
  animateExplosion()
}

const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  if (particleSystem && particleMaterial) {
    // Update time uniform for wave animation
    particleMaterial.uniforms.time.value = Date.now()
    
    // Gentle rotation
    particleSystem.rotation.y += 0.0005
    particleSystem.rotation.x += 0.0002
  }
  
  renderer.render(scene, camera)
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
    container.value.removeEventListener('click', onMouseClick)
    window.removeEventListener('resize', onWindowResize)
    
    if (renderer.domElement.parentNode) {
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