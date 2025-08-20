<template>
  <div class="app">
    <Navbar v-if="authStore.isAuthenticated" />
    <div class="main-content" :class="{ 'with-sidebar': authStore.isAuthenticated }">
      <Sidebar v-if="authStore.isAuthenticated" />
      <div class="content-area" :class="{ 'authenticated': authStore.isAuthenticated }">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import Navbar from './components/layout/Navbar.vue'
import Sidebar from './components/layout/Sidebar.vue'

const authStore = useAuthStore()

onMounted(() => {
  // Initialize mock data on app start
  authStore.initializeMockSession()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  display: flex;
}

.content-area {
  flex: 1;
  padding: 0;
}

.content-area.authenticated {
  margin-left: 250px;
  padding: 20px;
}

.with-sidebar .content-area {
  margin-top: 60px;
}
</style>
