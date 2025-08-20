import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Views
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'

// Admin views
import AdminDashboard from '../views/admin/Dashboard.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import PropertyValidation from '../views/admin/PropertyValidation.vue'

// Owner views
import OwnerDashboard from '../views/owner/Dashboard.vue'
import Properties from '../views/owner/Properties.vue'
import AddProperty from '../views/owner/AddProperty.vue'
import PropertyDetails from '../views/owner/PropertyDetails.vue'

// Buyer views
import BuyerDashboard from '../views/buyer/Dashboard.vue'
import Marketplace from '../views/buyer/Marketplace.vue'
import PropertyView from '../views/buyer/PropertyView.vue'

// Shared views
import Chat from '../views/shared/Chat.vue'
import Profile from '../views/shared/Profile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // Admin routes
  {
    path: '/admin',
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard
      },
      {
        path: 'users',
        name: 'UserManagement',
        component: UserManagement
      },
      {
        path: 'properties',
        name: 'PropertyValidation',
        component: PropertyValidation
      }
    ]
  },
  // Owner routes
  {
    path: '/owner',
    meta: { requiresAuth: true, role: 'proprietaire' },
    children: [
      {
        path: 'dashboard',
        name: 'OwnerDashboard',
        component: OwnerDashboard
      },
      {
        path: 'properties',
        name: 'Properties',
        component: Properties
      },
      {
        path: 'add-property',
        name: 'AddProperty',
        component: AddProperty
      },
      {
        path: 'property/:id',
        name: 'PropertyDetails',
        component: PropertyDetails
      }
    ]
  },
  // Buyer routes
  {
    path: '/buyer',
    meta: { requiresAuth: true, role: 'acheteur' },
    children: [
      {
        path: 'dashboard',
        name: 'BuyerDashboard',
        component: BuyerDashboard
      },
      {
        path: 'marketplace',
        name: 'Marketplace',
        component: Marketplace
      },
      {
        path: 'property/:id',
        name: 'PropertyView',
        component: PropertyView
      }
    ]
  },
  // Shared routes
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.role && authStore.user?.role !== to.meta.role) {
    // Redirect to appropriate dashboard if wrong role
    switch (authStore.user?.role) {
      case 'admin': next('/admin/dashboard'); break
      case 'proprietaire': next('/owner/dashboard'); break
      case 'acheteur': next('/buyer/dashboard'); break
      default: next('/login')
    }
  } else {
    next()
  }
})

export default router
