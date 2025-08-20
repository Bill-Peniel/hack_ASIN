<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <i class="fas fa-map-marked-alt"></i>
          <span>Foncier Intelligent</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">Fonctionnalités</a>
          <a href="#about" class="nav-link">À propos</a>
          <a href="#contact" class="nav-link">Contact</a>
          <router-link to="/login" class="login-btn">
            <i class="fas fa-sign-in-alt"></i>
            Connexion
          </router-link>
        </div>
        <div class="mobile-menu" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>

    <!-- Hero Section with Animated Map Particles -->
    <section class="hero-section">
      <div class="particles-container" ref="particlesContainer">
        <!-- Particules générées dynamiquement -->
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="title-line">Révolutionnez</span>
            <span class="title-line gradient-text">Votre Gestion</span>
            <span class="title-line">Foncière</span>
          </h1>
          <p class="hero-description">
            Plateforme intelligente de gestion foncière en Côte d'Ivoire. 
            Validation IA, surveillance satellite, marketplace sécurisé.
          </p>
          <div class="hero-actions">
            <router-link to="/login" class="cta-primary">
              <span>Commencer Maintenant</span>
              <i class="fas fa-arrow-right"></i>
            </router-link>
            <button class="cta-secondary" @click="scrollToFeatures">
              <i class="fas fa-play"></i>
              Voir la démo
            </button>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="floating-card property-card">
            <div class="card-header">
              <i class="fas fa-home"></i>
              <span>Propriété Validée</span>
            </div>
            <div class="card-body">
              <div class="property-info">
                <h4>Villa Moderne Cocody</h4>
                <p>500m² • 4 chambres</p>
                <div class="price">125,000,000 FCFA</div>
              </div>
            </div>
          </div>
          
          <div class="floating-card ai-card">
            <div class="card-header">
              <i class="fas fa-robot"></i>
              <span>IA Validation</span>
            </div>
            <div class="validation-progress">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: aiProgress + '%' }"></div>
              </div>
              <span class="progress-text">{{ Math.round(aiProgress) }}% validé</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="scroll-indicator" @click="scrollToFeatures">
        <div class="scroll-arrow"></div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Fonctionnalités Avancées</h2>
          <p class="section-description">
            Une suite complète d'outils pour moderniser la gestion foncière
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.id">
            <div class="feature-icon">
              <i :class="feature.icon"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in stats" :key="stat.id">
            <div class="stat-number" ref="statNumbers" :data-target="stat.number">0</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Prêt à Révolutionner Votre Gestion Foncière ?</h2>
          <p class="cta-description">
            Rejoignez des milliers de propriétaires et acheteurs qui font confiance à notre plateforme
          </p>
          <div class="cta-actions">
            <router-link to="/login" class="cta-primary large">
              Créer un Compte Gratuitement
              <i class="fas fa-arrow-right"></i>
            </router-link>
            <a href="#contact" class="cta-secondary large">
              Nous Contacter
              <i class="fas fa-phone"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <i class="fas fa-map-marked-alt"></i>
              <span>Foncier Intelligent</span>
            </div>
            <p>Modernisation de la gestion foncière en Côte d'Ivoire</p>
          </div>
          
          <div class="footer-links">
            <div class="link-group">
              <h4>Plateforme</h4>
              <a href="#features">Fonctionnalités</a>
              <a href="#about">À propos</a>
              <router-link to="/login">Connexion</router-link>
            </div>
            
            <div class="link-group">
              <h4>Support</h4>
              <a href="#help">Aide</a>
              <a href="#contact">Contact</a>
              <a href="#legal">Mentions légales</a>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; 2025 Plateforme Foncier Intelligent. Tous droits réservés.</p>
          <p>Hackathon IA 2025 ASIN & ANDF</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const particlesContainer = ref(null)
const statNumbers = ref([])
const aiProgress = ref(0)

const features = [
  {
    id: 1,
    icon: 'fas fa-robot',
    title: 'Validation IA',
    description: 'Intelligence artificielle pour valider automatiquement les documents fonciers'
  },
  {
    id: 2,
    icon: 'fas fa-satellite',
    title: 'Surveillance Satellite',
    description: 'Monitoring en temps réel des propriétés via imagerie satellite'
  },
  {
    id: 3,
    icon: 'fas fa-store',
    title: 'Marketplace Sécurisé',
    description: 'Plateforme de vente et achat avec transactions sécurisées'
  },
  {
    id: 4,
    icon: 'fas fa-comments',
    title: 'Chat Intégré',
    description: 'Communication directe entre propriétaires et acheteurs'
  },
  {
    id: 5,
    icon: 'fas fa-shield-alt',
    title: 'Blockchain Security',
    description: 'Sécurisation des transactions par technologie blockchain'
  },
  {
    id: 6,
    icon: 'fas fa-mobile-alt',
    title: 'Application Mobile',
    description: 'Accès mobile pour gérer vos propriétés partout'
  }
]

const stats = [
  { id: 1, number: 1250, label: 'Propriétés Enregistrées' },
  { id: 2, number: 850, label: 'Utilisateurs Actifs' },
  { id: 3, number: 95, label: '% Validation Réussie' },
  { id: 4, number: 24, label: 'Support 24/7' }
]

// Création des particules de carte
const createMapParticles = () => {
  if (!particlesContainer.value) return

  const container = particlesContainer.value
  const particleCount = 150

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div')
    particle.className = 'map-particle'
    
    // Position aléatoire
    particle.style.left = Math.random() * 100 + '%'
    particle.style.top = Math.random() * 100 + '%'
    
    // Taille aléatoire
    const size = Math.random() * 8 + 3
    particle.style.width = size + 'px'
    particle.style.height = size + 'px'
    
    // Animation delay aléatoire
    particle.style.animationDelay = Math.random() * 4 + 's'
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's'
    
    // Forme de territoire/région
    if (Math.random() > 0.7) {
      particle.classList.add('territory-particle')
    }
    
    // Interaction au survol
    particle.addEventListener('mouseenter', () => {
      particle.classList.add('dispersed')
      
      // Créer des mini-particules qui se dispersent
      for (let j = 0; j < 6; j++) {
        const miniParticle = document.createElement('div')
        miniParticle.className = 'mini-particle'
        
        const angle = (j / 6) * Math.PI * 2
        const distance = 30 + Math.random() * 20
        
        miniParticle.style.left = particle.offsetLeft + Math.cos(angle) * distance + 'px'
        miniParticle.style.top = particle.offsetTop + Math.sin(angle) * distance + 'px'
        
        container.appendChild(miniParticle)
        
        // Supprimer après animation
        setTimeout(() => {
          miniParticle.remove()
        }, 1000)
      }
    })
    
    particle.addEventListener('mouseleave', () => {
      setTimeout(() => {
        particle.classList.remove('dispersed')
      }, 500)
    })
    
    container.appendChild(particle)
  }
}

// Animation des stats
const animateStats = () => {
  statNumbers.value.forEach((el, index) => {
    const target = parseInt(el.dataset.target)
    const increment = target / 100
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        el.textContent = target.toLocaleString()
        clearInterval(timer)
      } else {
        el.textContent = Math.floor(current).toLocaleString()
      }
    }, 20)
  })
}

// Animation de la barre de progression IA
const animateAIProgress = () => {
  const interval = setInterval(() => {
    if (aiProgress.value < 98) {
      aiProgress.value += 0.5
    } else {
      clearInterval(interval)
    }
  }, 30)
}

const scrollToFeatures = () => {
  document.getElementById('features').scrollIntoView({ behavior: 'smooth' })
}

const toggleMobileMenu = () => {
  // Implémentation du menu mobile
}

onMounted(() => {
  createMapParticles()
  animateAIProgress()
  
  // Observer pour animer les stats quand ils sont visibles
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateStats()
        statsObserver.disconnect()
      }
    })
  })
  
  const statsSection = document.querySelector('.stats-section')
  if (statsSection) {
    statsObserver.observe(statsSection)
  }
})

onUnmounted(() => {
  // Cleanup if needed
})
</script>

<style scoped>
/* Base Styles */
.landing-page {
  width: 100%;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Navigation */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 15px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: bold;
  color: #2d3748;
}

.nav-logo i {
  color: #46e569;
  font-size: 28px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link:hover {
  color: #46e569;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: #46e569;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.login-btn {
  background: linear-gradient(135deg, #46e569, #32b363);
  color: white !important;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(70, 229, 105, 0.3);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 4px;
  cursor: pointer;
}

.mobile-menu span {
  width: 25px;
  height: 3px;
  background: #2d3748;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 100px 20px 50px;
  overflow: hidden;
}

.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.map-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: float 4s ease-in-out infinite;
  transition: all 0.3s ease;
  pointer-events: auto;
  cursor: pointer;
}

.territory-particle {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  background: rgba(70, 229, 105, 0.4);
}

.map-particle.dispersed {
  opacity: 0.3;
  transform: scale(0.5);
}

.mini-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: disperse 1s ease-out forwards;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes disperse {
  0% { 
    opacity: 1; 
    transform: scale(1); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0) translateY(-30px); 
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hero-text {
  color: white;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
}

.title-line {
  display: block;
}

.gradient-text {
  background: linear-gradient(135deg, #46e569, #32b363);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.cta-primary {
  background: linear-gradient(135deg, #46e569, #32b363);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.cta-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(70, 229, 105, 0.4);
}

.cta-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 16px;
  text-decoration: none;
}

.cta-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.hero-visual {
  position: relative;
}

.floating-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  animation: cardFloat 6s ease-in-out infinite;
  margin-bottom: 30px;
}

.floating-card:nth-child(2) {
  animation-delay: 1s;
  margin-left: 40px;
}

@keyframes cardFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  color: #2d3748;
  font-weight: 600;
}

.card-header i {
  color: #46e569;
  font-size: 20px;
}

.property-info h4 {
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 18px;
}

.property-info p {
  color: #718096;
  margin-bottom: 12px;
}

.price {
  color: #46e569;
  font-size: 20px;
  font-weight: 700;
}

.validation-progress {
  color: #2d3748;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #46e569, #32b363);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  font-weight: 600;
  color: #46e569;
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
  z-index: 2;
}

.scroll-arrow {
  width: 30px;
  height: 30px;
  border-right: 3px solid white;
  border-bottom: 3px solid white;
  transform: rotate(45deg);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: rotate(45deg) translateY(0); }
  40% { transform: rotate(45deg) translateY(-10px); }
  60% { transform: rotate(45deg) translateY(-5px); }
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Features Section */
.features-section {
  padding: 100px 0;
  background: #f7fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 80px;
}

.section-title {
  font-size: 3rem;
  font-weight: 800;
  color: #2d3748;
  margin-bottom: 20px;
}

.section-description {
  font-size: 1.25rem;
  color: #718096;
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #46e569, #32b363);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.feature-icon i {
  font-size: 32px;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
}

.feature-description {
  color: #718096;
  line-height: 1.6;
}

/* Stats Section */
.stats-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #2d3748, #4a5568);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  text-align: center;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #46e569;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 1.125rem;
  color: #cbd5e0;
}

/* CTA Section */
.cta-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
}

.cta-description {
  font-size: 1.25rem;
  margin-bottom: 40px;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.large {
  padding: 20px 40px;
  font-size: 18px;
}

/* Footer */
.footer {
  background: #1a202c;
  color: white;
  padding: 60px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand {
  max-width: 400px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.footer-logo i {
  color: #46e569;
  font-size: 28px;
}

.footer-brand p {
  color: #a0aec0;
  line-height: 1.6;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
}

.link-group h4 {
  color: #46e569;
  margin-bottom: 20px;
  font-size: 18px;
}

.link-group a {
  display: block;
  color: #a0aec0;
  text-decoration: none;
  margin-bottom: 12px;
  transition: color 0.3s ease;
}

.link-group a:hover {
  color: #46e569;
}

.footer-bottom {
  border-top: 1px solid #2d3748;
  padding-top: 20px;
  text-align: center;
  color: #718096;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu {
    display: flex;
  }
  
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 40px;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 80px 15px 40px;
  }
  
  .container {
    padding: 0 15px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>