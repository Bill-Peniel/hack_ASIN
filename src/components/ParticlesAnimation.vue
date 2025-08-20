<template>
  <div ref="container" class="particles-3d-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const container = ref(null)
let scene, camera, renderer, particles, mouse, raycaster
let particleSystem, particleGeometry, particleMaterial
let animationId

const mouse3D = new THREE.Vector2()
const originalColors = []
const originalPositions = []
const mouseTrail = []
const maxTrailLength = 10

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
  container.value.addEventListener('mouseleave', () => {
    // Reset all particles when mouse leaves
    if (particleSystem && particleGeometry) {
      const positions = particleGeometry.attributes.position.array
      const colors = particleGeometry.attributes.color.array
      
      for (let i = 0; i < originalPositions.length; i++) {
        const i3 = i * 3
        positions[i3] = originalPositions[i].x
        positions[i3 + 1] = originalPositions[i].y
        positions[i3 + 2] = originalPositions[i].z
        
        colors[i3] = originalColors[i].r
        colors[i3 + 1] = originalColors[i].g
        colors[i3 + 2] = originalColors[i].b
      }
      
      particleGeometry.attributes.position.needsUpdate = true
      particleGeometry.attributes.color.needsUpdate = true
    }
    // Clear mouse trail
    mouseTrail.length = 0
  }, false)
  window.addEventListener('resize', onWindowResize, false)

  // Start animation loop
  animate()
}

const createParticles = () => {
  const particleCount = 1500 // Reduced for better performance
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  const color = new THREE.Color()

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3

    // Position - create a more organic distribution
    const radius = Math.random() * 500 + 50
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) 
    positions[i3 + 2] = (radius * Math.cos(phi)) * 0.3 // Flatten Z for better interaction

    // Store original positions
    originalPositions.push({
      x: positions[i3],
      y: positions[i3 + 1],
      z: positions[i3 + 2]
    })

    // Colors - gradient from green to blue with more variety
    const mixRatio = Math.random()
    color.setHSL(0.25 + mixRatio * 0.35, 0.7 + Math.random() * 0.3, 0.5 + Math.random() * 0.3)
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b

    // Store original colors
    originalColors.push({ r: color.r, g: color.g, b: color.b })

    // Sizes with more variation
    sizes[i] = Math.random() * 6 + 3
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

  // Convert normalized mouse coordinates to 3D world position
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5)
  vector.unproject(camera)
  const mouseWorldPos = vector

  // Add current mouse position to trail
  mouseTrail.unshift({ x: mouseWorldPos.x, y: mouseWorldPos.y, z: mouseWorldPos.z, time: Date.now() })
  if (mouseTrail.length > maxTrailLength) {
    mouseTrail.pop()
  }

  // Update shader uniforms for visual effects
  if (particleMaterial) {
    particleMaterial.uniforms.mousePos.value.set(
      (mouse.x + 1) * 0.5,
      (mouse.y + 1) * 0.5
    )
    particleMaterial.uniforms.mouseRadius.value = 150.0
  }

  // Apply multiple interaction effects to particles
  if (particleSystem && particleGeometry) {
    const positions = particleGeometry.attributes.position.array
    const colors = particleGeometry.attributes.color.array
    
    for (let i = 0; i < originalPositions.length; i++) {
      const i3 = i * 3
      const originalPos = originalPositions[i]
      const currentPos = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2])
      
      // Calculate distance from particle to mouse
      const mouseDistance = currentPos.distanceTo(mouseWorldPos)
      const interactionRadius = 120
      
      let totalForceX = 0, totalForceY = 0, totalForceZ = 0
      let isInteracting = false
      
      // Main mouse interaction
      if (mouseDistance < interactionRadius) {
        isInteracting = true
        const force = (interactionRadius - mouseDistance) / interactionRadius
        const direction = currentPos.clone().sub(mouseWorldPos).normalize()
        
        // Mix of repulsion and attraction based on distance
        const repulsionZone = interactionRadius * 0.4
        if (mouseDistance < repulsionZone) {
          // Close particles repel
          const repulsionForce = force * 100
          totalForceX += direction.x * repulsionForce
          totalForceY += direction.y * repulsionForce
          totalForceZ += direction.z * repulsionForce * 0.5
        } else {
          // Distant particles are slightly attracted
          const attractionForce = force * 20
          totalForceX -= direction.x * attractionForce
          totalForceY -= direction.y * attractionForce
          totalForceZ -= direction.z * attractionForce * 0.3
        }
      }
      
      // Mouse trail following effect
      for (let j = 0; j < mouseTrail.length; j++) {
        const trailPoint = mouseTrail[j]
        const trailDistance = currentPos.distanceTo(new THREE.Vector3(trailPoint.x, trailPoint.y, trailPoint.z))
        const trailRadius = 80 - (j * 5) // Decreasing influence for older trail points
        
        if (trailDistance < trailRadius && trailRadius > 0) {
          const trailForce = ((trailRadius - trailDistance) / trailRadius) * (1 - j / maxTrailLength)
          const trailDirection = new THREE.Vector3(trailPoint.x, trailPoint.y, trailPoint.z).sub(currentPos).normalize()
          
          const followStrength = 15 * trailForce
          totalForceX += trailDirection.x * followStrength
          totalForceY += trailDirection.y * followStrength
          totalForceZ += trailDirection.z * followStrength * 0.2
          
          isInteracting = true
        }
      }
      
      // Apply forces and update positions
      if (isInteracting) {
        positions[i3] = originalPos.x + totalForceX
        positions[i3 + 1] = originalPos.y + totalForceY
        positions[i3 + 2] = originalPos.z + totalForceZ
        
        // Change color based on interaction intensity
        const intensity = Math.min(1, Math.sqrt(totalForceX * totalForceX + totalForceY * totalForceY) / 50)
        colors[i3] = originalColors[i].r + intensity * (1.0 - originalColors[i].r)
        colors[i3 + 1] = originalColors[i].g + intensity * (0.8 - originalColors[i].g)
        colors[i3 + 2] = originalColors[i].b + intensity * (0.2 - originalColors[i].b)
      } else {
        // Return to original position and color smoothly
        const returnSpeed = 0.06
        positions[i3] += (originalPos.x - positions[i3]) * returnSpeed
        positions[i3 + 1] += (originalPos.y - positions[i3 + 1]) * returnSpeed
        positions[i3 + 2] += (originalPos.z - positions[i3 + 2]) * returnSpeed
        
        // Return to original color
        const originalColor = originalColors[i]
        colors[i3] += (originalColor.r - colors[i3]) * returnSpeed
        colors[i3 + 1] += (originalColor.g - colors[i3 + 1]) * returnSpeed
        colors[i3 + 2] += (originalColor.b - colors[i3 + 2]) * returnSpeed
      }
    }
    
    particleGeometry.attributes.position.needsUpdate = true
    particleGeometry.attributes.color.needsUpdate = true
  }
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