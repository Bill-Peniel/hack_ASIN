import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mockChats, mockMessages } from '../data/mockData'

export const useChatStore = defineStore('chat', () => {
  const chats = ref([...mockChats])
  const messages = ref([...mockMessages])
  const activeChat = ref(null)

  const getUserChats = (userId) => {
    return chats.value.filter(chat => 
      chat.participants.includes(userId)
    )
  }

  const getChatMessages = (chatId) => {
    return messages.value.filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  const sendMessage = (chatId, senderId, content, type = 'text') => {
    const newMessage = {
      id: Date.now().toString(),
      chatId,
      senderId,
      content,
      type,
      timestamp: new Date().toISOString(),
      read: false
    }
    messages.value.push(newMessage)
    
    // Update chat last message
    const chat = chats.value.find(c => c.id === chatId)
    if (chat) {
      chat.lastMessage = content
      chat.lastMessageTime = newMessage.timestamp
    }
    
    return newMessage
  }

  const createChat = (propertyId, buyerId, ownerId) => {
    const existingChat = chats.value.find(chat => 
      chat.propertyId === propertyId && 
      chat.participants.includes(buyerId) && 
      chat.participants.includes(ownerId)
    )
    
    if (existingChat) {
      return existingChat
    }
    
    const newChat = {
      id: Date.now().toString(),
      propertyId,
      participants: [buyerId, ownerId],
      createdAt: new Date().toISOString(),
      lastMessage: '',
      lastMessageTime: new Date().toISOString()
    }
    
    chats.value.push(newChat)
    return newChat
  }

  const markAsRead = (chatId, userId) => {
    messages.value.forEach(msg => {
      if (msg.chatId === chatId && msg.senderId !== userId) {
        msg.read = true
      }
    })
  }

  const getUnreadCount = (userId) => {
    const userChats = getUserChats(userId)
    let count = 0
    
    userChats.forEach(chat => {
      const unread = messages.value.filter(msg => 
        msg.chatId === chat.id && 
        msg.senderId !== userId && 
        !msg.read
      )
      count += unread.length
    })
    
    return count
  }

  return {
    chats,
    messages,
    activeChat,
    getUserChats,
    getChatMessages,
    sendMessage,
    createChat,
    markAsRead,
    getUnreadCount
  }
})
