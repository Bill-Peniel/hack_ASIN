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

    <!-- Hero Section with 3D Particles Animation -->
    <section class="hero-section">
      <ParticlesAnimation />
      
      <div class="hero-content">
        <div class="hero-text" data-aos="fade-right" data-aos-duration="1000">
          <h1 class="hero-title">
            <span class="title-line animate-slide-up" data-delay="0">Révolutionnez</span>
            <span class="title-line gradient-text animate-slide-up" data-delay="200">Votre Gestion</span>
            <span class="title-line animate-slide-up" data-delay="400">Foncière</span>
          </h1>
          <p class="hero-description animate-fade-in" data-delay="600">
            Plateforme intelligente de gestion foncière en Côte d'Ivoire. 
            Validation IA, surveillance satellite, marketplace sécurisé.
          </p>
          <div class="hero-actions animate-fade-in" data-delay="800">
            <router-link to="/login" class="cta-primary modern-btn">
              <span class="btn-text">Commencer Maintenant</span>
              <i class="fas fa-arrow-right btn-icon"></i>
              <div class="btn-ripple"></div>
            </router-link>
            <button class="cta-secondary modern-btn" @click="scrollToFeatures">
              <i class="fas fa-play btn-icon"></i>
              <span class="btn-text">Voir la démo</span>
              <div class="btn-ripple"></div>
            </button>
          </div>
        </div>
        
        <div class="hero-visual" data-aos="fade-left" data-aos-duration="1200">
          <div class="floating-card property-card modern-card" data-tilt>
            <div class="card-glow"></div>
            <div class="card-header">
              <i class="fas fa-home pulse-icon"></i>
              <span>Propriété Validée</span>
              <div class="status-indicator validated"></div>
            </div>
            <div class="card-body">
              <div class="property-info">
                <h4>Villa Moderne Cocody</h4>
                <p>500m² • 4 chambres</p>
                <div class="price animate-counter">125,000,000 FCFA</div>
              </div>
            </div>
          </div>
          
          <div class="floating-card ai-card modern-card" data-tilt>
            <div class="card-glow ai-glow"></div>
            <div class="card-header">
              <i class="fas fa-robot spin-on-hover"></i>
              <span>IA Validation</span>
              <div class="ai-indicator active"></div>
            </div>
            <div class="validation-progress">
              <div class="progress-bar modern-progress">
                <div class="progress-fill animated-progress" :style="{ width: aiProgress + '%' }"></div>
                <div class="progress-shine"></div>
              </div>
              <span class="progress-text">{{ Math.round(aiProgress) }}% validé</span>
            </div>
          </div>
          
          <!-- Nouvel élément décoratif -->
          <div class="floating-elements">
            <div class="float-element" v-for="n in 6" :key="n" :style="getFloatingElementStyle(n)"></div>
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
          <div 
            class="feature-card modern-feature-card" 
            v-for="(feature, index) in features" 
            :key="feature.id"
            :data-aos="'fade-up'"
            :data-aos-delay="index * 100"
            :data-aos-duration="800"
          >
            <div class="feature-icon modern-icon">
              <div class="icon-bg"></div>
              <i :class="feature.icon"></i>
              <div class="icon-shine"></div>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-hover-overlay"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div 
            class="stat-item modern-stat-item" 
            v-for="(stat, index) in stats" 
            :key="stat.id"
            :data-aos="'zoom-in'"
            :data-aos-delay="index * 150"
          >
            <div class="stat-icon">
              <i :class="getStatIcon(stat.id)"></i>
            </div>
            <div class="stat-number" ref="statNumbers" :data-target="stat.number">0</div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-bg-effect"></div>
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

    <!-- About Section -->
    <section id="about" class="about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text" data-aos="fade-right" data-aos-duration="1000">
            <h2 class="section-title">À Propos de Notre Plateforme</h2>
            <p class="section-description">
              Plateforme Foncier Intelligent révolutionne la gestion immobilière en Côte d'Ivoire 
              grâce à des technologies de pointe et une approche centrée sur la transparence.
            </p>
            
            <div class="about-features">
              <div class="about-feature" v-for="aboutFeature in aboutFeatures" :key="aboutFeature.id">
                <div class="about-feature-icon">
                  <i :class="aboutFeature.icon"></i>
                </div>
                <div class="about-feature-content">
                  <h4>{{ aboutFeature.title }}</h4>
                  <p>{{ aboutFeature.description }}</p>
                </div>
              </div>
            </div>
            
            <div class="about-stats">
              <div class="about-stat">
                <span class="stat-value">2025</span>
                <span class="stat-desc">Année de création</span>
              </div>
              <div class="about-stat">
                <span class="stat-value">100%</span>
                <span class="stat-desc">Sécurisé</span>
              </div>
              <div class="about-stat">
                <span class="stat-value">24/7</span>
                <span class="stat-desc">Support</span>
              </div>
            </div>
          </div>
          
          <div class="about-visual" data-aos="fade-left" data-aos-duration="1200">
            <div class="about-image">
              <div class="about-card modern-about-card">
                <div class="card-header">
                  <i class="fas fa-shield-alt"></i>
                  <span>Sécurité Blockchain</span>
                </div>
                <div class="security-indicators">
                  <div class="security-item" v-for="n in 4" :key="n">
                    <div class="security-dot"></div>
                    <span>Couche {{ n }} validée</span>
                  </div>
                </div>
              </div>
              
              <div class="about-card modern-about-card tech-card">
                <div class="card-header">
                  <i class="fas fa-brain"></i>
                  <span>IA Avancée</span>
                </div>
                <div class="tech-progress">
                  <div class="tech-item" v-for="tech in techProgress" :key="tech.name">
                    <span>{{ tech.name }}</span>
                    <div class="progress-bar mini-progress">
                      <div class="progress-fill" :style="{ width: tech.progress + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Contactez-Nous</h2>
          <p class="section-description">
            Une question ? Un projet ? Notre équipe est là pour vous accompagner
          </p>
        </div>
        
        <div class="contact-content">
          <div class="contact-info" data-aos="fade-right" data-aos-duration="800">
            <div class="contact-item" v-for="contactInfo in contactInfos" :key="contactInfo.id">
              <div class="contact-icon">
                <i :class="contactInfo.icon"></i>
              </div>
              <div class="contact-details">
                <h4>{{ contactInfo.title }}</h4>
                <p>{{ contactInfo.description }}</p>
                <span class="contact-value">{{ contactInfo.value }}</span>
              </div>
            </div>
            
            <div class="social-links">
              <h4>Suivez-nous</h4>
              <div class="social-icons">
                <a href="#" class="social-link" v-for="social in socialLinks" :key="social.name">
                  <i :class="social.icon"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div class="contact-form-wrapper" data-aos="fade-left" data-aos-duration="800">
            <form class="contact-form modern-form" @submit.prevent="submitContactForm">
              <div class="form-row">
                <div class="form-group">
                  <input 
                    type="text" 
                    id="firstName" 
                    v-model="contactForm.firstName" 
                    required
                    class="form-input"
                    placeholder=" "
                  >
                  <label for="firstName" class="form-label">Prénom</label>
                </div>
                <div class="form-group">
                  <input 
                    type="text" 
                    id="lastName" 
                    v-model="contactForm.lastName" 
                    required
                    class="form-input"
                    placeholder=" "
                  >
                  <label for="lastName" class="form-label">Nom</label>
                </div>
              </div>
              
              <div class="form-group">
                <input 
                  type="email" 
                  id="email" 
                  v-model="contactForm.email" 
                  required
                  class="form-input"
                  placeholder=" "
                >
                <label for="email" class="form-label">Email</label>
              </div>
              
              <div class="form-group">
                <input 
                  type="tel" 
                  id="phone" 
                  v-model="contactForm.phone" 
                  class="form-input"
                  placeholder=" "
                >
                <label for="phone" class="form-label">Téléphone</label>
              </div>
              
              <div class="form-group">
                <select 
                  id="subject" 
                  v-model="contactForm.subject" 
                  required
                  class="form-select"
                >
                  <option value="">Choisir un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="support">Support technique</option>
                  <option value="partnership">Partenariat</option>
                  <option value="demo">Demande de démo</option>
                </select>
                <label for="subject" class="form-label">Sujet</label>
              </div>
              
              <div class="form-group">
                <textarea 
                  id="message" 
                  v-model="contactForm.message" 
                  required
                  class="form-textarea"
                  rows="5"
                  placeholder=" "
                ></textarea>
                <label for="message" class="form-label">Message</label>
              </div>
              
              <button type="submit" class="submit-btn modern-btn" :disabled="isSubmitting">
                <span v-if="!isSubmitting">Envoyer le Message</span>
                <span v-else>Envoi en cours...</span>
                <i class="fas fa-paper-plane" v-if="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" v-else></i>
                <div class="btn-ripple"></div>
              </button>
            </form>
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
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ParticlesAnimation from '../components/ParticlesAnimation.vue'

const statNumbers = ref([])
const aiProgress = ref(0)
const isAnimating = ref(false)
const isSubmitting = ref(false)

// Formulaire de contact
const contactForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
})

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

// Données pour la section À propos
const aboutFeatures = [
  {
    id: 1,
    icon: 'fas fa-eye',
    title: 'Transparence',
    description: 'Toutes les transactions sont transparentes et vérifiables'
  },
  {
    id: 2,
    icon: 'fas fa-users',
    title: 'Communauté',
    description: 'Une communauté active de plus de 10,000 utilisateurs'
  },
  {
    id: 3,
    icon: 'fas fa-award',
    title: 'Excellence',
    description: 'Reconnu pour notre innovation dans le secteur immobilier'
  }
]

const techProgress = [
  { name: 'Machine Learning', progress: 95 },
  { name: 'Blockchain', progress: 88 },
  { name: 'Computer Vision', progress: 92 },
  { name: 'Data Analytics', progress: 90 }
]

// Données pour la section Contact
const contactInfos = [
  {
    id: 1,
    icon: 'fas fa-map-marker-alt',
    title: 'Adresse',
    description: 'Siège social',
    value: 'Abidjan, Plateau - Côte d\'Ivoire'
  },
  {
    id: 2,
    icon: 'fas fa-phone',
    title: 'Téléphone',
    description: 'Disponible 24/7',
    value: '+225 XX XX XX XX XX'
  },
  {
    id: 3,
    icon: 'fas fa-envelope',
    title: 'Email',
    description: 'Réponse sous 24h',
    value: 'contact@foncier-intelligent.ci'
  },
  {
    id: 4,
    icon: 'fas fa-clock',
    title: 'Horaires',
    description: 'Lun - Ven',
    value: '8h00 - 18h00 GMT'
  }
]

const socialLinks = [
  { name: 'Facebook', icon: 'fab fa-facebook-f' },
  { name: 'Twitter', icon: 'fab fa-twitter' },
  { name: 'LinkedIn', icon: 'fab fa-linkedin-in' },
  { name: 'Instagram', icon: 'fab fa-instagram' }
]

const stats = [
  { id: 1, number: 1250, label: 'Propriétés Enregistrées' },
  { id: 2, number: 850, label: 'Utilisateurs Actifs' },
  { id: 3, number: 95, label: '% Validation Réussie' },
  { id: 4, number: 24, label: 'Support 24/7' }
]


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

// Fonction pour soumettre le formulaire de contact
const submitContactForm = async () => {
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  try {
    // Simulation d'envoi du formulaire
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset du formulaire
    Object.keys(contactForm.value).forEach(key => {
      contactForm.value[key] = ''
    })
    
    // Notification de succès (vous pouvez ajouter une vraie notification)
    alert('Message envoyé avec succès ! Nous vous répondrons rapidement.')
  } catch (error) {
    alert('Erreur lors de l\'envoi du message. Veuillez réessayer.')
  } finally {
    isSubmitting.value = false
  }
}

// Nouvelles fonctions d'animation
const getFloatingElementStyle = (index) => {
  const positions = [
    { top: '20%', right: '15%', delay: '0s' },
    { top: '45%', right: '8%', delay: '1s' },
    { top: '70%', right: '20%', delay: '0.5s' },
    { top: '25%', right: '25%', delay: '1.5s' },
    { top: '55%', right: '2%', delay: '0.8s' },
    { top: '80%', right: '12%', delay: '2s' }
  ]
  return {
    top: positions[index - 1].top,
    right: positions[index - 1].right,
    animationDelay: positions[index - 1].delay
  }
}

const getStatIcon = (id) => {
  const icons = {
    1: 'fas fa-building',
    2: 'fas fa-users',
    3: 'fas fa-check-circle',
    4: 'fas fa-headset'
  }
  return icons[id] || 'fas fa-chart-line'
}

const initAnimations = () => {
  // Animation des éléments au scroll
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-slide-up, .animate-fade-in')
    elements.forEach(element => {
      const delay = parseInt(element.dataset.delay) || 0
      setTimeout(() => {
        element.classList.add('active')
      }, delay)
    })
  }
  
  // Effet tilt sur les cartes
  const initTilt = () => {
    const tiltElements = document.querySelectorAll('[data-tilt]')
    tiltElements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
      })
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)'
      })
    })
  }
  
  nextTick(() => {
    animateOnScroll()
    initTilt()
  })
}

onMounted(() => {
  animateAIProgress()
  initAnimations()
  
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

/* Statistiques modernes */
.modern-stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.modern-stat-item:hover {
  transform: translateY(-8px) scale(1.05);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #46e569, #32b363);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  transition: all 0.3s ease;
}

.modern-stat-item:hover .stat-icon {
  transform: scale(1.1) rotateY(360deg);
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.stat-icon i {
  font-size: 24px;
  color: white;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 800;
  color: #46e569;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(70, 229, 105, 0.3);
  transition: all 0.3s ease;
}

.modern-stat-item:hover .stat-number {
  color: white;
  text-shadow: 0 2px 15px rgba(255, 255, 255, 0.5);
}

.stat-label {
  font-size: 1.125rem;
  color: #cbd5e0;
  font-weight: 500;
  transition: color 0.3s ease;
}

.modern-stat-item:hover .stat-label {
  color: white;
}

.stat-bg-effect {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(70, 229, 105, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.modern-stat-item:hover .stat-bg-effect {
  opacity: 1;
  animation: rotateGlow 4s linear infinite;
}

@keyframes rotateGlow {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* About Section */
.about-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.about-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e2e8f0" stroke-width="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grid)"/></svg>') center/50px 50px;
  opacity: 0.3;
  pointer-events: none;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.about-features {
  margin: 40px 0;
}

.about-feature {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.about-feature:hover {
  transform: translateX(10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.about-feature-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #46e569, #32b363);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.about-feature-icon i {
  font-size: 24px;
  color: white;
}

.about-feature-content h4 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.about-feature-content p {
  margin: 0;
  color: #718096;
  line-height: 1.6;
}

.about-stats {
  display: flex;
  gap: 40px;
  margin-top: 40px;
}

.about-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 800;
  color: #46e569;
  margin-bottom: 8px;
}

.stat-desc {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.about-visual {
  position: relative;
}

.about-image {
  position: relative;
  height: 500px;
}

.modern-about-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modern-about-card:first-child {
  top: 0;
  left: 0;
  width: 280px;
  animation: cardFloat 6s ease-in-out infinite;
}

.tech-card {
  top: 200px;
  right: 0;
  width: 260px;
  animation: cardFloat 6s ease-in-out infinite 1s;
}

.security-indicators {
  margin-top: 20px;
}

.security-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 0.875rem;
  color: #4a5568;
}

.security-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #46e569;
  animation: pulse 2s ease-in-out infinite;
}

.tech-progress {
  margin-top: 20px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 0.875rem;
  color: #4a5568;
}

.mini-progress {
  width: 100px;
  height: 6px;
  margin-left: 15px;
}

/* Contact Section */
.contact-section {
  padding: 100px 0;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 50%, #1a202c 100%);
  color: white;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 80px;
  margin-top: 60px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 40px;
  padding: 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-5px);
}

.contact-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #46e569, #32b363);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon i {
  font-size: 24px;
  color: white;
}

.contact-details h4 {
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.contact-details p {
  margin: 0 0 8px 0;
  color: #a0aec0;
  font-size: 0.875rem;
}

.contact-value {
  font-weight: 600;
  color: #46e569;
}

.social-links {
  margin-top: 40px;
}

.social-links h4 {
  margin-bottom: 20px;
  color: #46e569;
}

.social-icons {
  display: flex;
  gap: 15px;
}

.social-link {
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: #46e569;
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(70, 229, 105, 0.3);
}

/* Formulaire moderne */
.contact-form-wrapper {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modern-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  position: relative;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #46e569;
  box-shadow: 0 0 0 3px rgba(70, 229, 105, 0.1);
  background: rgba(255, 255, 255, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-label {
  position: absolute;
  top: 16px;
  left: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
  background: transparent;
}

.form-input:focus + .form-label,
.form-input:not(:placeholder-shown) + .form-label,
.form-textarea:focus + .form-label,
.form-textarea:not(:placeholder-shown) + .form-label {
  top: -10px;
  left: 15px;
  font-size: 12px;
  color: #46e569;
  background: #2d3748;
  padding: 0 8px;
  border-radius: 4px;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background: #2d3748;
  color: white;
}

.submit-btn {
  background: linear-gradient(135deg, #46e569, #32b363);
  color: white;
  border: none;
  padding: 18px 40px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(70, 229, 105, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

/* Nouvelles animations modernes */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Couleurs d'accent animées */
@keyframes colorShift {
  0%, 100% { color: #46e569; }
  25% { color: #667eea; }
  50% { color: #f093fb; }
  75% { color: #764ba2; }
}

.gradient-text {
  background: linear-gradient(45deg, #46e569, #667eea, #f093fb, #764ba2);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

/* Effets de survol avancés pour la navigation */
.nav-link {
  position: relative;
  transition: color 0.3s ease;
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

/* Animations de scroll */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.animate-on-scroll.animated {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 50px;
  }
  
  .about-stats {
    justify-content: center;
    gap: 30px;
  }
  
  .about-image {
    height: 400px;
  }
  
  .contact-content {
    grid-template-columns: 1fr;
    gap: 50px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .contact-form-wrapper {
    padding: 30px 20px;
  }
  
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