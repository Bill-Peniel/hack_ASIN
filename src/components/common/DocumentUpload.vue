<template>
  <div class="document-upload">
    <div 
      class="upload-area"
      :class="{ 'drag-over': isDragOver, 'has-files': selectedFiles.length > 0 }"
      @drop.prevent="handleDrop"
      @dragover.prevent="isDragOver = true"
      @dragleave.prevent="isDragOver = false"
      @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        :accept="acceptedTypesString"
        @change="handleFileSelect"
        style="display: none;"
      >
      
      <div class="upload-content">
        <div v-if="selectedFiles.length === 0" class="upload-prompt">
          <i class="fas fa-cloud-upload-alt fa-3x mb-3 text-primary"></i>
          <h6>Télécharger des documents</h6>
          <p class="text-muted mb-2">
            Glissez-déposez vos fichiers ici ou cliquez pour parcourir
          </p>
          <small class="text-muted">
            Formats acceptés: {{ acceptedTypesDisplay }}
            <br>
            Taille maximale: {{ maxSize }}MB par fichier
          </small>
        </div>
        
        <div v-else class="upload-success">
          <i class="fas fa-check-circle fa-2x text-success mb-2"></i>
          <p class="mb-0">{{ selectedFiles.length }} fichier(s) sélectionné(s)</p>
          <small class="text-muted">Cliquez pour ajouter d'autres fichiers</small>
        </div>
      </div>
    </div>

    <!-- File List -->
    <div v-if="selectedFiles.length > 0" class="file-list mt-3">
      <h6>Fichiers sélectionnés:</h6>
      <div class="list-group">
        <div 
          v-for="(file, index) in selectedFiles" 
          :key="index"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <div class="file-info">
            <i :class="getFileIcon(file.type)" class="me-2"></i>
            <span class="file-name">{{ file.name }}</span>
            <small class="text-muted ms-2">({{ formatFileSize(file.size) }})</small>
          </div>
          <div class="file-actions">
            <span v-if="file.error" class="badge bg-danger me-2">{{ file.error }}</span>
            <span v-else class="badge bg-success me-2">Valide</span>
            <button 
              class="btn btn-sm btn-outline-danger"
              @click="removeFile(index)"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
      
      <div class="upload-actions mt-3">
        <button 
          class="btn btn-primary me-2" 
          @click="uploadFiles"
          :disabled="hasErrors || uploading"
        >
          <span v-if="uploading" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="fas fa-upload me-2"></i>
          {{ uploading ? 'Téléchargement...' : 'Confirmer l\'upload' }}
        </button>
        <button class="btn btn-outline-secondary" @click="clearFiles">
          <i class="fas fa-trash me-2"></i>Tout effacer
        </button>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="upload-progress mt-3">
      <div class="progress">
        <div 
          class="progress-bar progress-bar-striped progress-bar-animated" 
          :style="{ width: uploadProgress + '%' }"
        ></div>
      </div>
      <small class="text-muted">{{ uploadProgress }}% complété</small>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits } from 'vue'

const props = defineProps({
  acceptedTypes: {
    type: Array,
    default: () => ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
  },
  maxSize: {
    type: Number,
    default: 5 // MB
  },
  maxFiles: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['files-selected', 'upload-complete', 'upload-error'])

const fileInput = ref(null)
const selectedFiles = ref([])
const isDragOver = ref(false)
const uploading = ref(false)
const uploadProgress = ref(0)

const acceptedTypesString = computed(() => {
  return props.acceptedTypes.map(type => `.${type}`).join(',')
})

const acceptedTypesDisplay = computed(() => {
  return props.acceptedTypes.map(type => type.toUpperCase()).join(', ')
})

const hasErrors = computed(() => {
  return selectedFiles.value.some(file => file.error)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  processFiles(files)
}

const handleDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  processFiles(files)
}

const processFiles = (files) => {
  files.forEach(file => {
    const validation = validateFile(file)
    
    if (selectedFiles.value.length >= props.maxFiles) {
      return
    }
    
    selectedFiles.value.push({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      error: validation.error
    })
  })
  
  // Emit selected files to parent
  const validFiles = selectedFiles.value
    .filter(f => !f.error)
    .map(f => f.file)
  
  emit('files-selected', validFiles)
}

const validateFile = (file) => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  
  if (!props.acceptedTypes.includes(fileExtension)) {
    return { error: 'Type non autorisé' }
  }
  
  if (file.size > props.maxSize * 1024 * 1024) {
    return { error: 'Fichier trop volumineux' }
  }
  
  return { error: null }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  
  // Re-emit updated file list
  const validFiles = selectedFiles.value
    .filter(f => !f.error)
    .map(f => f.file)
  
  emit('files-selected', validFiles)
}

const clearFiles = () => {
  selectedFiles.value = []
  emit('files-selected', [])
}

const uploadFiles = async () => {
  if (hasErrors.value) return
  
  uploading.value = true
  uploadProgress.value = 0
  
  try {
    // Simulate file upload progress
    const interval = setInterval(() => {
      uploadProgress.value += 10
      if (uploadProgress.value >= 100) {
        clearInterval(interval)
        uploading.value = false
        
        // Emit success
        emit('upload-complete', selectedFiles.value.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type,
          url: `#` // Mock URL
        })))
        
        // Clear files after successful upload
        clearFiles()
      }
    }, 200)
    
  } catch (error) {
    uploading.value = false
    uploadProgress.value = 0
    emit('upload-error', error)
  }
}

const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) return 'fas fa-file-pdf text-danger'
  if (fileType.includes('image')) return 'fas fa-file-image text-success'
  if (fileType.includes('word') || fileType.includes('doc')) return 'fas fa-file-word text-primary'
  return 'fas fa-file text-secondary'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style scoped>
.upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

.upload-area:hover {
  border-color: #8B4513;
  background-color: #fff;
}

.upload-area.drag-over {
  border-color: #8B4513;
  background-color: rgba(139, 69, 19, 0.1);
}

.upload-area.has-files {
  border-color: #28a745;
  background-color: rgba(40, 167, 69, 0.1);
}

.upload-content {
  pointer-events: none;
}

.upload-prompt h6 {
  color: #333;
  margin-bottom: 10px;
}

.text-primary {
  color: #8B4513 !important;
}

.file-list {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  background-color: white;
}

.file-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.file-name {
  font-weight: 500;
}

.file-actions {
  display: flex;
  align-items: center;
}

.upload-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.upload-progress {
  text-align: center;
}

.progress {
  height: 8px;
  border-radius: 4px;
  background-color: #e9ecef;
  margin-bottom: 8px;
}

.progress-bar {
  background-color: #8B4513;
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
</style>
