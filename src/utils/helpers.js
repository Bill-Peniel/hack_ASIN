/**
 * Format currency in West African CFA Franc
 * @param {number} amount - Amount to format
 * @param {boolean} showCurrency - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showCurrency = true) => {
  if (!amount || isNaN(amount)) return '0'
  
  const formatter = new Intl.NumberFormat('fr-FR', {
    style: showCurrency ? 'currency' : 'decimal',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format date in French locale
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return 'N/A'
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  
  return new Date(date).toLocaleDateString('fr-FR', { ...defaultOptions, ...options })
}

/**
 * Format time relative to now (e.g., "Il y a 2 heures")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const time = new Date(date)
  const diffMs = now - time
  
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  const diffWeeks = Math.floor(diffMs / (7 * 86400000))
  const diffMonths = Math.floor(diffMs / (30 * 86400000))
  
  if (diffSeconds < 60) {
    return 'À l\'instant'
  } else if (diffMinutes < 60) {
    return `Il y a ${diffMinutes} min`
  } else if (diffHours < 24) {
    return `Il y a ${diffHours}h`
  } else if (diffDays < 7) {
    return `Il y a ${diffDays}j`
  } else if (diffWeeks < 4) {
    return `Il y a ${diffWeeks} semaine${diffWeeks > 1 ? 's' : ''}`
  } else if (diffMonths < 12) {
    return `Il y a ${diffMonths} mois`
  } else {
    return formatDate(date)
  }
}

/**
 * Generate initials from first and last name
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @returns {string} Initials (e.g., "JD")
 */
export const getInitials = (firstName, lastName) => {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || 'U'
}

/**
 * Generate a random color for avatars
 * @param {string} str - String to generate color from
 * @returns {string} Hex color code
 */
export const generateAvatarColor = (str) => {
  const colors = [
    '#8B4513', '#CD853F', '#A0522D', '#D2691E', '#B8860B',
    '#228B22', '#32CD32', '#6B8E23', '#9ACD32', '#556B2F',
    '#4682B4', '#5F9EA0', '#6495ED', '#87CEEB', '#4169E1',
    '#DC143C', '#B22222', '#CD5C5C', '#F08080', '#FA8072'
  ]
  
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Côte d'Ivoire format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const validatePhone = (phone) => {
  // Basic validation for Côte d'Ivoire phone numbers
  const phoneRegex = /^(\+225|225)?[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/
  return phoneRegex.test(phone)
}

/**
 * Generate a unique ID
 * @returns {string} Unique identifier
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100, suffix = '...') => {
  if (!text || text.length <= length) return text
  return text.substring(0, length).trim() + suffix
}

/**
 * Calculate price per square meter
 * @param {number} price - Total price
 * @param {number} area - Area in square meters
 * @returns {number} Price per square meter
 */
export const calculatePricePerSqm = (price, area) => {
  if (!price || !area || area === 0) return 0
  return Math.round(price / area)
}

/**
 * Get property type label in French
 * @param {string} type - Property type code
 * @returns {string} French label
 */
export const getPropertyTypeLabel = (type) => {
  const types = {
    'terrain_nu': 'Terrain nu',
    'terrain_avec_batiment': 'Terrain avec bâtiment',
    'maison': 'Maison',
    'appartement': 'Appartement',
    'commercial': 'Local commercial',
    'agricole': 'Terrain agricole'
  }
  return types[type] || type
}

/**
 * Get property status label in French
 * @param {string} status - Property status code
 * @returns {string} French label
 */
export const getPropertyStatusLabel = (status) => {
  const statuses = {
    'en_attente_validation': 'En attente de validation',
    'valide': 'Validée',
    'rejete': 'Rejetée',
    'disponible': 'Disponible à la vente'
  }
  return statuses[status] || status
}

/**
 * Get user role label in French
 * @param {string} role - User role code
 * @returns {string} French label
 */
export const getUserRoleLabel = (role) => {
  const roles = {
    'admin': 'Administrateur',
    'proprietaire': 'Propriétaire',
    'acheteur': 'Acheteur'
  }
  return roles[role] || role
}

/**
 * Get user status label in French
 * @param {string} status - User status code
 * @returns {string} French label
 */
export const getUserStatusLabel = (status) => {
  const statuses = {
    'en_attente_validation': 'En attente de validation',
    'actif': 'Actif',
    'suspendu': 'Suspendu'
  }
  return statuses[status] || status
}

/**
 * Get Bootstrap badge class for property status
 * @param {string} status - Property status
 * @returns {string} Bootstrap badge class
 */
export const getStatusBadgeClass = (status) => {
  const classes = {
    'en_attente_validation': 'bg-warning',
    'valide': 'bg-success',
    'rejete': 'bg-danger',
    'disponible': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

/**
 * Get Bootstrap badge class for user role
 * @param {string} role - User role
 * @returns {string} Bootstrap badge class
 */
export const getRoleBadgeClass = (role) => {
  const classes = {
    'admin': 'bg-danger',
    'proprietaire': 'bg-success',
    'acheteur': 'bg-primary'
  }
  return classes[role] || 'bg-secondary'
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if coordinates are valid
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if coordinates are valid
 */
export const isValidCoordinates = (lat, lng) => {
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - First latitude
 * @param {number} lng1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lng2 - Second longitude
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Format GPS coordinates for display
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lng) => {
  if (!isValidCoordinates(lat, lng)) return 'Coordonnées invalides'
  
  const latDir = lat >= 0 ? 'N' : 'S'
  const lngDir = lng >= 0 ? 'E' : 'O'
  
  return `${Math.abs(lat).toFixed(6)}°${latDir}, ${Math.abs(lng).toFixed(6)}°${lngDir}`
}
