<template>
  <div class="chat-page">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="h3">Messages</h1>
      <div class="chat-stats">
        <span class="badge bg-info me-2">{{ userChats.length }} conversation(s)</span>
        <span class="badge bg-danger" v-if="unreadCount > 0">{{ unreadCount }} non lu(s)</span>
      </div>
    </div>

    <div class="row h-75">
      <!-- Chat List -->
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-header">
            <h6 class="card-title mb-0">
              <i class="fas fa-comments me-2"></i>
              Conversations
            </h6>
          </div>
          <div class="card-body p-0">
            <div class="chat-list">
              <div 
                v-for="chat in userChats" 
                :key="chat.id"
                class="chat-item"
                :class="{ active: activeChat?.id === chat.id }"
                @click="selectChat(chat)"
              >
                <div class="d-flex align-items-start">
                  <div class="avatar me-3">
                    {{ getOtherUserInitials(chat) }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                      <h6 class="mb-1">{{ getOtherUserName(chat) }}</h6>
                      <small class="text-muted">{{ formatTime(chat.lastMessageTime) }}</small>
                    </div>
                    <p class="mb-1 text-muted">{{ getPropertyTitle(chat.propertyId) }}</p>
                    <p class="mb-0 small">{{ chat.lastMessage || 'Aucun message' }}</p>
                    <span 
                      v-if="getUnreadMessagesCount(chat.id) > 0" 
                      class="badge bg-danger badge-sm"
                    >
                      {{ getUnreadMessagesCount(chat.id) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-if="userChats.length === 0" class="text-center text-muted p-4">
              <i class="fas fa-comments fa-3x mb-3"></i>
              <h6>Aucune conversation</h6>
              <p class="small">Vos conversations apparaîtront ici</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Chat Window -->
      <div class="col-md-8">
        <div class="card h-100">
          <div v-if="activeChat" class="card-header">
            <div class="d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <div class="avatar me-3">
                  {{ getOtherUserInitials(activeChat) }}
                </div>
                <div>
                  <h6 class="mb-0">{{ getOtherUserName(activeChat) }}</h6>
                  <small class="text-muted">
                    <i class="fas fa-home me-1"></i>
                    {{ getPropertyTitle(activeChat.propertyId) }}
                  </small>
                </div>
              </div>
              <div class="chat-actions">
                <button class="btn btn-sm btn-outline-primary me-2" @click="viewProperty(activeChat.propertyId)">
                  <i class="fas fa-eye me-1"></i>Voir propriété
                </button>
                <button class="btn btn-sm btn-outline-secondary" @click="clearChat">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="activeChat" class="card-body d-flex flex-column p-0">
            <!-- Messages -->
            <div class="messages-container flex-grow-1" ref="messagesContainer">
              <div 
                v-for="message in activeChatMessages" 
                :key="message.id"
                class="message"
                :class="{ 'message-sent': message.senderId === currentUserId }"
              >
                <div class="message-content">
                  <p class="mb-1">{{ message.content }}</p>
                  <small class="message-time">
                    {{ formatTime(message.timestamp) }}
                    <i v-if="message.senderId === currentUserId && message.read" class="fas fa-check-double text-primary ms-1"></i>
                  </small>
                </div>
              </div>
              
              <div v-if="activeChatMessages.length === 0" class="text-center text-muted p-4">
                <i class="fas fa-comment fa-2x mb-2"></i>
                <p>Commencez votre conversation</p>
              </div>
            </div>
            
            <!-- Message Input -->
            <div class="message-input-area">
              <form @submit.prevent="sendMessage" class="d-flex gap-2">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Tapez votre message..."
                  v-model="newMessage"
                  :disabled="!activeChat"
                >
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="!newMessage.trim() || !activeChat"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
          
          <div v-else class="card-body d-flex align-items-center justify-content-center">
            <div class="text-center text-muted">
              <i class="fas fa-comments fa-4x mb-3"></i>
              <h5>Sélectionnez une conversation</h5>
              <p>Choisissez une conversation dans la liste pour commencer à discuter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useChatStore } from '../../stores/chat'
import { useUsersStore } from '../../stores/users'
import { usePropertiesStore } from '../../stores/properties'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const usersStore = useUsersStore()
const propertiesStore = usePropertiesStore()

const activeChat = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

const currentUserId = computed(() => authStore.user?.id || '')

const userChats = computed(() => 
  chatStore.getUserChats(currentUserId.value)
    .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
)

const activeChatMessages = computed(() => 
  activeChat.value ? chatStore.getChatMessages(activeChat.value.id) : []
)

const unreadCount = computed(() => 
  chatStore.getUnreadCount(currentUserId.value)
)

const selectChat = (chat) => {
  activeChat.value = chat
  chatStore.markAsRead(chat.id, currentUserId.value)
  
  // Update URL
  router.replace({ query: { chatId: chat.id } })
  
  // Scroll to bottom
  nextTick(() => {
    scrollToBottom()
  })
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !activeChat.value) return
  
  chatStore.sendMessage(
    activeChat.value.id,
    currentUserId.value,
    newMessage.value.trim()
  )
  
  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })
}

const getOtherUserName = (chat) => {
  const otherUserId = chat.participants.find(id => id !== currentUserId.value)
  const user = usersStore.getUserById(otherUserId)
  return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'
}

const getOtherUserInitials = (chat) => {
  const otherUserId = chat.participants.find(id => id !== currentUserId.value)
  const user = usersStore.getUserById(otherUserId)
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'
}

const getPropertyTitle = (propertyId) => {
  const property = propertiesStore.getPropertyById(propertyId)
  return property ? property.title : 'Propriété inconnue'
}

const getUnreadMessagesCount = (chatId) => {
  const messages = chatStore.getChatMessages(chatId)
  return messages.filter(msg => 
    msg.senderId !== currentUserId.value && !msg.read
  ).length
}

const viewProperty = (propertyId) => {
  const userRole = authStore.user?.role
  if (userRole === 'acheteur') {
    router.push(`/buyer/property/${propertyId}`)
  } else if (userRole === 'proprietaire') {
    router.push(`/owner/property/${propertyId}`)
  }
}

const clearChat = () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette conversation ?')) {
    // In a real app, this would delete the chat
    alert('Fonctionnalité à implémenter')
  }
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) {
    return 'À l\'instant'
  } else if (diffMins < 60) {
    return `${diffMins}min`
  } else if (diffHours < 24) {
    return `${diffHours}h`
  } else if (diffDays < 7) {
    return `${diffDays}j`
  } else {
    return time.toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages and auto-scroll
watch(activeChatMessages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

onMounted(() => {
  // Select chat from URL query if provided
  if (route.query.chatId) {
    const chat = userChats.value.find(c => c.id === route.query.chatId)
    if (chat) {
      selectChat(chat)
    }
  } else if (userChats.value.length > 0) {
    // Select first chat by default
    selectChat(userChats.value[0])
  }
})
</script>

<style scoped>
.chat-page {
  height: calc(100vh - 140px);
}

.chat-list {
  max-height: 600px;
  overflow-y: auto;
}

.chat-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-item:hover {
  background-color: #f8f9fa;
}

.chat-item.active {
  background-color: #e3f2fd;
  border-right: 3px solid #8B4513;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #8B4513;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.messages-container {
  height: 400px;
  overflow-y: auto;
  padding: 15px;
  background-color: #f8f9fa;
}

.message {
  margin-bottom: 15px;
}

.message-sent {
  text-align: right;
}

.message-content {
  display: inline-block;
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  background-color: white;
  border: 1px solid #dee2e6;
}

.message-sent .message-content {
  background-color: #8B4513;
  color: white;
  border-color: #8B4513;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-input-area {
  padding: 15px;
  border-top: 1px solid #dee2e6;
  background-color: white;
}

.chat-stats .badge {
  font-size: 0.8rem;
}

.badge-sm {
  font-size: 0.7rem;
  padding: 2px 6px;
  margin-left: 8px;
}

.btn-primary {
  background-color: #8B4513;
  border-color: #8B4513;
}

.btn-primary:hover {
  background-color: #7A4012;
  border-color: #7A4012;
}

.btn-outline-primary {
  color: #8B4513;
  border-color: #8B4513;
}

.btn-outline-primary:hover {
  background-color: #8B4513;
  border-color: #8B4513;
}
</style>
