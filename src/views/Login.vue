<template>
    <div class="auth-container">
      <!-- Cylindres décoratifs repositionnés -->
      <div class="cylinder cylinder-1"></div>
      <div class="cylinder cylinder-2"></div>
      <div class="cylinder cylinder-3"></div>
      <div class="cylinder cylinder-4"></div>

      <div
        class="auth-box"
        :class="{ 'register-active': !isLogin }"
        id="container"
      >
        <!-- Formulaire de connexion -->
        <div class="form-container sign-in-container">
          <form @submit.prevent="handleLogin">
            <h1 class="form-title">Connexion</h1>
            <input 
              type="email" 
              placeholder="Email" 
              v-model="login.email" 
              required 
            />
            <input 
              type="password" 
              placeholder="Mot de passe" 
              v-model="login.password" 
              required 
            />
            <a href="#" class="forgot-link">Mot de passe oublié?</a>
            
            <!-- Error message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <!-- Demo accounts info -->
            <div class="demo-info">
              <small>Comptes demo:</small>
              <small>Admin: admin@demo.com / admin123</small>
              <small>Propriétaire: owner@demo.com / owner123</small>
              <small>Acheteur: buyer@demo.com / buyer123</small>
            </div>
            
            <button type="submit" :disabled="loading" class="auth-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>
        </div>

        <!-- Formulaire d'inscription -->
        <div class="form-container sign-up-container">
          <form @submit.prevent="handleRegister">
            <h1 class="form-title">Créer un compte</h1>
            
            <div class="name-row">
              <input 
                type="text" 
                placeholder="Prénom" 
                v-model="register.firstName" 
                required 
              />
              <input 
                type="text" 
                placeholder="Nom" 
                v-model="register.lastName" 
                required 
              />
            </div>
            
            <input 
              type="email" 
              placeholder="Email" 
              v-model="register.email" 
              required 
            />
            
            <input 
              type="tel" 
              placeholder="Téléphone" 
              v-model="register.phone" 
              required 
            />
            
            <select v-model="register.role" required>
              <option value="">Sélectionnez votre profil</option>
              <option value="proprietaire">Propriétaire</option>
              <option value="acheteur">Acheteur</option>
            </select>
            
            <input 
              type="password" 
              placeholder="Mot de passe (min. 6 caractères)" 
              v-model="register.password" 
              required 
              minlength="6"
            />
            
            <input 
              type="password" 
              placeholder="Confirmer le mot de passe" 
              v-model="register.confirmPassword" 
              required 
            />
            
            <!-- Error message -->
            <div v-if="error" class="error-message">
              {{ error }}
            </div>
            
            <button type="submit" :disabled="loading" class="auth-btn">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </form>
        </div>

        <!-- Overlay avec panneaux animés -->
        <div class="overlay-container">
          <div class="overlay">
            <div class="overlay-panel overlay-left">
              <div class="overlay-content">
                <h1>Bienvenue !</h1>
                <p>Déjà inscrit ? Connecte-toi avec ton compte</p>
                <button class="ghost-btn" @click="switchPanel(true)" :disabled="isAnimating">
                  Connexion
                </button>
              </div>
            </div>
            <div class="overlay-panel overlay-right">
              <div class="overlay-content">
                <h1>Salut !</h1>
                <p>Pas encore de compte ? Inscris-toi maintenant</p>
                <button class="ghost-btn" @click="switchPanel(false)" :disabled="isAnimating">
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue";
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const isLogin = ref(true);
  const isAnimating = ref(false);
  const error = ref('');
  const loading = ref(false);

  const login = ref({ 
    email: "", 
    password: "" 
  });
  
  const register = ref({
    firstName: "", 
    lastName: "", 
    email: "", 
    phone: "",
    role: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = async () => {
    error.value = ''
    loading.value = true
    
    try {
      const success = await authStore.login(login.value.email, login.value.password)
      if (success) {
        switch (authStore.user.role) {
          case 'admin':
            router.push('/admin/dashboard')
            break
          case 'proprietaire':
            router.push('/owner/dashboard')
            break
          case 'acheteur':
            router.push('/buyer/dashboard')
            break
          default:
            router.push('/')
        }
      } else {
        error.value = 'Email ou mot de passe incorrect'
      }
    } catch (err) {
      error.value = 'Erreur de connexion. Veuillez réessayer.'
    } finally {
      loading.value = false
    }
  }

  const handleRegister = async () => {
    error.value = ''
    
    if (register.value.password !== register.value.confirmPassword) {
      error.value = 'Les mots de passe ne correspondent pas'
      return
    }
    
    if (register.value.password.length < 6) {
      error.value = 'Le mot de passe doit contenir au moins 6 caractères'
      return
    }
    
    loading.value = true
    
    try {
      const success = await authStore.register({
        firstName: register.value.firstName,
        lastName: register.value.lastName,
        email: register.value.email,
        phone: register.value.phone,
        role: register.value.role,
        password: register.value.password,
        status: 'en_attente_validation'
      })
      
      if (success) {
        switch (authStore.user.role) {
          case 'proprietaire':
            router.push('/owner/dashboard')
            break
          case 'acheteur':
            router.push('/buyer/dashboard')
            break
          default:
            router.push('/')
        }
      }
    } catch (err) {
      error.value = 'Erreur lors de la création du compte. Veuillez réessayer.'
    } finally {
      loading.value = false
    }
  }

  const switchPanel = async (newLoginState) => {
    if (isAnimating.value) return;

    isAnimating.value = true;
    error.value = '';

    const overlayPanels = document.querySelectorAll('.overlay-panel');
    overlayPanels.forEach(panel => panel.classList.add('morphing'));

    setTimeout(() => {
      isLogin.value = newLoginState;
    }, 200);

    setTimeout(() => {
      overlayPanels.forEach(panel => panel.classList.remove('morphing'));
      isAnimating.value = false;
    }, 600);
  };
  </script>

  <style scoped>
  /* Container principal - Design Desktop First */
  .auth-container {
    background: linear-gradient(135deg, #dddcff 0%, #6ef0a9 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .auth-box {
    position: relative;
    width: 768px;
    height: 480px;
    background: #fff;
    border-radius: 25px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    z-index: 10;
  }

  /* Cylindres décoratifs optimisés pour desktop */
  .cylinder {
    position: absolute;
    border-radius: 50px;
    background: linear-gradient(135deg, 
      rgba(164, 255, 247, 0.6), 
      rgba(97, 230, 168, 0.5), 
      rgba(43, 192, 130, 0.4)
    );
    z-index: 1;
  }

  .cylinder-1 {
    width: 120px;
    height: 250px;
    top: 15%;
    left: 12%;
    transform: rotate(-45deg);
  }

  .cylinder-2 {
    width: 200px;
    height: 400px;
    top: -5%;
    right: 15%;
    transform: rotate(-45deg);
    box-shadow: 0 0 0 25px rgba(255, 208, 253, 0.2);
  }

  .cylinder-3 {
    width: 140px;
    height: 280px;
    bottom: 20%;
    left: 8%;
    transform: rotate(-45deg);
  }

  .cylinder-4 {
    width: 160px;
    height: 300px;
    bottom: 15%;
    right: 12%;
    transform: rotate(-45deg);
  }

  /* Form containers */
  .form-container {
    position: absolute;
    top: 0;
    height: 100%;
    width: 50%;
    transition: all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .sign-in-container {
    left: 0;
    z-index: 2;
  }

  .sign-up-container {
    left: 0;
    opacity: 0;
    z-index: 1;
    transform: translateX(-100%);
  }

  /* Animation states */
  .register-active .sign-in-container {
    transform: translateX(100%);
    opacity: 0;
  }

  .register-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  }

  /* Forms styling */
  form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 30px 40px;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .form-title {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }

  input, select {
    background: #f5f5f5;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
    color: #333;
    font-size: 14px;
  }

  input:focus, select:focus {
    outline: none;
    background: #e9e9e9;
    transform: scale(1.02);
  }

  .name-row {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  .name-row input {
    flex: 1;
  }

  .forgot-link {
    font-weight: 600;
    color: #666;
    text-decoration: none;
    margin: 10px 0;
    font-size: 14px;
  }

  .forgot-link:hover {
    color: #46e569;
  }

  .auth-btn {
    border-radius: 20px;
    border: none;
    background: linear-gradient(135deg, #46e569, #32b363);
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
  }

  .auth-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .auth-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(70, 229, 105, 0.3);
  }

  .ghost-btn {
    border-radius: 20px;
    border: 2px solid #fff;
    background: transparent;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .ghost-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  /* Error styling */
  .error-message {
    background: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px;
    border-radius: 6px;
    margin: 10px 0;
    font-size: 13px;
    width: 100%;
  }

  /* Demo info */
  .demo-info {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 6px;
    margin: 10px 0;
    text-align: left;
    width: 100%;
  }

  .demo-info small {
    display: block;
    font-size: 11px;
    color: #666;
    margin: 2px 0;
  }

  .demo-info small:first-child {
    font-weight: 600;
    color: #333;
  }

  /* Loading spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Overlay system */
  .overlay-container {
    position: absolute;
    top: 0;
    left: 50%;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 100;
  }

  .register-active .overlay-container {
    transform: translateX(-100%);
  }

  .overlay {
    position: relative;
    width: 200%;
    height: 100%;
    left: -100%;
    transform: translateX(0);
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
  }

  .register-active .overlay {
    transform: translateX(50%);
  }

  .overlay-panel {
    position: relative;
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 0 40px;
    text-align: center;
    color: #fff;
    overflow: hidden;
    transition: border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .overlay-left {
    background: linear-gradient(135deg, #24972e 0%, #63f199 50%, #13a126 100%);
    border-radius: 0 120px 120px 0;
  }

  .overlay-right {
    background: linear-gradient(315deg, #0b6317 0%, #59da8a 50%, #196820 100%);
    border-radius: 120px 0 0 120px;
  }

  .register-active .overlay-left {
    border-radius: 0 120px 120px 0;
  }

  .register-active .overlay-right {
    border-radius: 120px 0 0 120px;
  }

  .overlay-panel.morphing {
    border-radius: 0 !important;
    transition: border-radius 0.2s ease-out !important;
  }

  .overlay-content {
    position: relative;
    z-index: 2;
  }

  .overlay h1 {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .overlay p {
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.5;
    opacity: 0.95;
  }

  /* Responsive breakpoints */
  @media (max-width: 768px) {
    .auth-box {
      width: 95vw;
      height: 500px;
      max-width: 400px;
    }

    .cylinder {
      display: none;
    }

    .overlay-left, .overlay-right {
      border-radius: 0 80px 80px 0;
    }

    .overlay-right {
      border-radius: 80px 0 0 80px;
    }

    form {
      padding: 20px 25px;
    }

    .form-title {
      font-size: 24px;
    }

    .overlay h1 {
      font-size: 26px;
    }

    .overlay p {
      font-size: 14px;
    }
  }

  @media (max-width: 480px) {
    .auth-container {
      padding: 20px;
    }

    .auth-box {
      width: 100%;
      height: 450px;
      border-radius: 20px;
    }

    .overlay-left, .overlay-right {
      border-radius: 0 50px 50px 0;
    }

    .overlay-right {
      border-radius: 50px 0 0 50px;
    }

    form {
      padding: 15px 20px;
    }

    input, select {
      padding: 10px 12px;
    }

    .auth-btn, .ghost-btn {
      padding: 10px 30px;
      font-size: 11px;
    }
  }
  </style>