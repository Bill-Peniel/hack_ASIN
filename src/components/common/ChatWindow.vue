<template>
  <div class="chat-window">
    <div class="chat-header" v-if="chat">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <div class="participant-avatar me-3">
            {{ getOtherUserInitials() }}
          </div>
          <div>
            <h6 class="mb-0">{{ getOtherUserName() }}</h6>
            <small class="text-muted">
              <i class="fas fa-home me-1"></i>
              {{ getPropertyTitle() }}
            </small>
          </div>
        </div>
        <div class="chat-actions">
          <button class="btn btn-sm btn-outline-secondary" @click="$emit('close')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :class="{ 'message-sent': message.senderId === currentUserId }"
      >
        <div class="message-content">
          <p class="mb-1">{{ message.content }}</p>
          <small class="message-time">
            {{ formatTime(message.timestamp) }}
            <i v-if="message.senderId === currentUserId && message.read" 
               class="fas fa-check-double text-primary ms-1">
            </i>
          </small>
        </div>
      </div>
      
      <div v-if="messages.length === 0" class="empty-chat">
        <i class="fas fa-comments fa-3x text-muted mb-3"></i>
        <h6 class="text-muted">Commencez votre conversation</h6>
        <p class="text-muted">Envoyez votre premier message à {{ getOtherUserName() }}</p>
      </div>
    </div>
    
    <div class="chat-input">
      <form @submit.prevent="sendMessage" class="d-flex gap-2">
        <input
          type="text"
          class="form-control"
          placeholder="Tapez votre message..."
          v-model="newMessage"
          :disabled="!chat"
        >
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!newMessage.trim() || !chat"
        >
          <i class="fas fa-paper-plane"></i>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useChatStore } from '../../stores/chat'
import { useUsersStore } from '../../stores/users'
import { usePropertiesStore } from '../../stores/properties'

const props = defineProps({
  chat: {
    type: Object,
    default: null
  }
})

defineEmits(['close', 'message-sent'])

const authStore = useAuthStore()
const chatStore = useChatStore()
const usersStore = useUsersStore()
const propertiesStore = usePropertiesStore()

const newMessage = ref('')
const messagesContainer = ref(null)

const currentUserId = computed(() => authStore.user?.id || '')

const messages = computed(() => 
  props.chat ? chatStore.getChatMessages(props.chat.id) : []
)

const getOtherUserName = () => {
  if (!props.chat) return ''
  const otherUserId = props.chat.participants.find(id => id !== currentUserId.value)
  const user = usersStore.getUserById(otherUserId)
  return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur'
}

const getOtherUserInitials = () => {
  if (!props.chat) return ''
  const otherUserId = props.chat.participants.find(id => id !== currentUserId.value)
  const user = usersStore.getUserById(otherUserId)
  return user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'U'
}

const getPropertyTitle = () => {
  if (!props.chat) return ''
  const property = propertiesStore.getPropertyById(props.chat.propertyId)
  return property ? property.title : 'Propriété'
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !props.chat) return
  
  chatStore.sendMessage(
    props.chat.id,
    currentUserId.value,
    newMessage.value.trim()
  )
  
  newMessage.value = ''
  
  nextTick(() => {
    scrollToBottom()
  })
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  
  const now = new Date()
  const time = new Date(timestamp)
  const diffMs = now - time
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  
  if (diffMins < 1) {
    return 'À l\'instant'
  } else if (diffMins < 60) {
    return `${diffMins}min`
  } else if (diffHours < 24) {
    return time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } else {
    return time.toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages and auto-scroll
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Watch for chat changes and mark as read
watch(() => props.chat, (newChat) => {
  if (newChat) {
    chatStore.markAsRead(newChat.id, currentUserId.value)
    nextTick(() => {
      scrollToBottom()
    })
  }
})
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 500px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background: white;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
}

.participant-avatar {
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

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
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
  word-wrap: break-word;
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

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

.chat-input {
  padding: 15px;
  border-top: 1px solid #dee2e6;
  background-color: white;
}

.btn-primary {
  background-color: #8B4513;
  border-color: #8B4513;
}

.btn-primary:hover {
  background-color: #7A4012;
  border-color: #7A4012;
}

.btn-primary:disabled {
  background-color: #6c757d;
  border-color: #6c757d;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
