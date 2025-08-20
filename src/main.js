import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/styles.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Global error handler
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err, info)
}

app.mount('#app')
