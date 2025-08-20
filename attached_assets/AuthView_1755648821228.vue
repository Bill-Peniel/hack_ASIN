<template>
    <div class="flex items-center justify-center min-h-screen my-background">

      <div class="cylinder1"></div>
      <div class="cylinder2"></div>
      <div class="cylinder3"></div>
      <div class="cylinder4"></div>

      <div
        class="relative bottom-16 right-96 w-[768px] max-w-full min-h-[480px] bg-white shadow-2xl rounded-3xl overflow-hidden"
        :class="{ 'right-panel-active': !isLogin }"
        id="container"
      >
        <!-- Formulaire de connexion -->
        <div class="form-container sign-in-container">
          <form @submit.prevent="handleLogin">
            <h1 class="text-2xl font-bold mb-4 text-slate-800">Connexion</h1>
            <input type="email" placeholder="Email" v-model="login.email" />
            <input type="password" placeholder="Mot de passe" v-model="login.password" />
            <a class="font-semibold text-slate-800 top-3 relative" href="#">Mot de passe oublié?</a>
            <button class="top-6 relative" type="submit">Se connecter</button>
          </form>
        </div>

        <!-- Formulaire d'inscription -->
        <div class="form-container sign-up-container">
          <form @submit.prevent="handleRegister">
            <h1 class="text-2xl font-bold mb-4 text-slate-800">Créer un compte</h1>
            <input type="text" placeholder="NPI" v-model="register.npi" />
            <input type="text" placeholder="Nom" v-model="register.name" />
            <input type="email" placeholder="Email" v-model="register.email" />
            <input type="password" placeholder="Mot de passe" v-model="register.password" />
            <select class="w-full p-3 border-none bg-[#eee] rounded-md text-black top-2 relative" name="Genre" id="gender">
              <option value="nothing">Sélectionnez un genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="othergender">Autre</option>
            </select>
            <button class="relative top-5" type="submit">S'inscrire</button>
          </form>
        </div>

        <!-- Overlay optimisé -->
        <div class="overlay-container">
          <div class="overlay">
            <!-- Panel gauche (visible quand isLogin = false) -->
            <div class="overlay-panel overlay-left">
              <div class="overlay-content">
                <h1>Bienvenue !</h1>
                <p>Déjà inscrit ? Connecte-toi avec ton compte</p>
                <button class="ghost" @click="switchPanel(true)">Connexion</button>
              </div>
            </div>
            <!-- Panel droit (visible quand isLogin = true) -->
            <div class="overlay-panel overlay-right">
              <div class="overlay-content">
                <h1>Salut !</h1>
                <p>Pas encore de compte ? Inscris-toi maintenant</p>
                <button class="ghost" @click="switchPanel(false)">S'inscrire</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from "vue";

  const isLogin = ref(true);
  const isAnimating = ref(false);

  const login = ref({ email: "", password: "" });
  const register = ref({npi: "", name: "", email: "", password: "" });

  const handleLogin = () => console.log("Tentative de connexion :", login.value);
  const handleRegister = () => console.log("Tentative d'inscription :", register.value);

  // Fonction pour gérer l'animation des bordures en 3 phases
  const switchPanel = async (newLoginState) => {
    if (isAnimating.value) return; // Éviter les animations multiples

    isAnimating.value = true;

    // Phase 1: Ajouter la classe morphing pour rendre rectangulaire (200ms)
    const overlayPanels = document.querySelectorAll('.overlay-panel');
    overlayPanels.forEach(panel => panel.classList.add('morphing'));

    // Phase 2: Après 200ms, changer l'état et déclencher le slide (400ms)
    setTimeout(() => {
      isLogin.value = newLoginState;
    }, 200);

    // Phase 3: Après 600ms total, retirer morphing pour les bordures finales (200ms)
    setTimeout(() => {
      overlayPanels.forEach(panel => panel.classList.remove('morphing'));
      isAnimating.value = false;
    }, 600);
  };
  </script>

  <style scoped>
  .my-background {
    background: linear-gradient(to right, #dddcff, #6ef0a9);
  }

  /* Formulaires */
  form {
    background: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 50px;
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  input {
    background: #eee;
    border: none;
    padding: 12px 15px;
    margin: 8px 0;
    width: 100%;
    border-radius: 8px;
    transition: all 0.3s ease;
    color: black;
  }

  input:focus {
    outline: none;
    background: #ddd;
    transform: scale(1.02);
  }

  button {
    border-radius: 20px;
    border: 1px solid #46e569;
    background-color: #46e569;
    color: #fff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  button:hover {
    background-color: #32b363;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(67, 56, 202, 0.3);
  }

  button:active {
    transform: translateY(0) scale(0.98);
  }

  button.ghost {
    background-color: transparent;
    border-color: #fff;
    color: #fff;
  }

  button.ghost:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
  }

  /* Container principal */
  #container {
    background-color: #fff;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 480px;
  }

  /* Form containers avec animations fluides */
  .form-container {
    position: absolute;
    top: 0;
    height: 105%;
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

  /* Animations des formulaires */
  #container.right-panel-active .sign-in-container {
    transform: translateX(100%);
    opacity: 0;
  }

  #container.right-panel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  }

  /* Container de l'overlay - Animation principale */
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

  #container.right-panel-active .overlay-container {
    transform: translateX(-100%);
  }

  /* Overlay principal */
  .overlay {
    position: relative;
    width: 200%;
    height: 100%;
    left: -100%;
    transform: translateX(0);
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
    display: flex;
  }

  #container.right-panel-active .overlay {
    transform: translateX(50%);
  }

  /* Panels avec animation synchronisée des bordures */
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
    /* Transition en 2 étapes : rapide vers rectangle, puis lente vers arrondi final */
    transition: border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
                border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0.4s;
  }

  /* Panel gauche - État initial : arrondi à droite (quand on voit la connexion) */
  .overlay-left {
    background: linear-gradient(135deg, #24972e 0%, #63f199 50%, #13a126 100%);
    border-radius: 0 150px 150px 0;
  }

  /* Panel droit - État initial : arrondi à gauche (quand on voit la connexion) */
  .overlay-right {
    background: linear-gradient(396deg, #0b6317 0%, #59da8a 50%, #196820 100%);
    border-radius: 150px 0 0 150px;
  }

  /* État final après animation : quand on voit l'inscription (isLogin = false) */
  #container.right-panel-active .overlay-left {
    /* Panel gauche visible → arrondi à droite (c'est celui qu'on voit !) */
    border-radius: 0 150px 150px 0;
    transition: border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
                border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0.4s;
  }

  #container.right-panel-active .overlay-right {
    /* Panel droit caché → pas visible, donc peu importe */
    border-radius: 150px 0 0 100px;
    transition: border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0s,
                border-radius 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) 0.4s;
  }

  /* Classe temporaire pour l'état rectangulaire (géré par JS) */
  .overlay-panel.morphing {
    border-radius: 0 !important;
    transition: border-radius 0.2s ease-out !important;
  }

  /* Contenu des panels */
  .overlay-content {
    transition: all 0.4s ease;
    transform: translateY(0);
    opacity: 1;
    position: relative;
    z-index: 2;
  }

  /* Animation du contenu lors du changement */
  #container.right-panel-active .overlay-left .overlay-content {
    animation: slideInLeft 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .overlay-right .overlay-content {
    animation: slideInRight 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  .cylinder1 {
    width: 150px;
    height: 300px;
    background: linear-gradient(rgb(164, 255, 247), rgb(97, 230, 168), rgba(43, 192, 130, 0.336));
    margin: 20px;
    position: relative;
    border-radius: 100px;
    transform: rotate(-45deg);
    bottom: 370px;
    left: 170px;
    z-index: 1;
  }

  .cylinder2 {
    width: 250px;
    height: 700px;
    background: linear-gradient(rgb(164, 255, 247), rgb(97, 230, 168), rgb(43, 192, 130, 0.336));
    margin: 20px;
    position: relative;
    border-radius: 100px;
    transform: rotate(-45deg);
    bottom: 250px;
    right: 280px;
    box-shadow: 0 0 0 30px rgba(255, 208, 253, 0.438);
    z-index: 1;
  }

  .cylinder3 {
    width: 180px;
    height: 300px;
    background: linear-gradient(rgb(164, 255, 247), rgb(97, 230, 168), rgb(43, 192, 130, 0.336));
    margin: 20px;
    position: relative;
    border-radius: 100px;
    transform: rotate(-45deg);
    bottom: -150px;
    right: 490px;
    z-index: 1;
  }

  .cylinder4 {
    width: 190px;
    height: 300px;
    background: linear-gradient(rgb(164, 255, 247), rgb(97, 230, 168), rgb(43, 192, 130, 0.336));
    margin: 20px;
    position: relative;
    border-radius: 100px;
    transform: rotate(-45deg);
    bottom: -300px;
    right: 230px;
    z-index: 1;
  }

  /* Keyframes pour les animations */
  @keyframes slideInLeft {
    0% {
      transform: translateX(-50px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideInRight {
    0% {
      transform: translateX(50px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Styles du texte */
  .overlay h1 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 15px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .overlay p {
    font-size: 16px;
    margin-bottom: 25px;
    line-height: 1.5;
    opacity: 0.9;
  }

  /* Effet de profondeur avec des ombres */
  .overlay-left::before,
  .overlay-right::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
  }

  .overlay-content {
    position: relative;
    z-index: 2;
  }

  /* Responsive */
  @media (max-width: 768px) {
    #container {
      width: 80%;
      min-height: 500px;
    }

    /* Bordures arrondies adaptées pour mobile */
    .overlay-left {
      border-radius: 0 150px 50px 0;
    }

    .overlay-right {
      border-radius: 150px 0 0 50px;
    }

    /* État final mobile */
    #container.right-panel-active .overlay-left {
      /* Panel gauche visible → arrondi à droite */
      border-radius: 0 150px 50px 0;
    }

    #container.right-panel-active .overlay-right {
      /* Panel droit caché → arrondi à gauche */
      border-radius: 50px 0 0 50px;
    }
  }
  </style>
