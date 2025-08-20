<template>
  <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="fas fa-credit-card me-2"></i>
            Finaliser l'achat
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        
        <div class="modal-body">
          <!-- Property Summary -->
          <div class="purchase-summary mb-4">
            <h6>Résumé de votre achat</h6>
            <div class="property-summary">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <h6 class="mb-1">{{ property.title }}</h6>
                  <p class="text-muted mb-1">{{ property.location.city }}, {{ property.location.region }}</p>
                  <small class="text-muted">{{ property.area }} m² • {{ formatPropertyType(property.type) }}</small>
                </div>
                <div class="text-end">
                  <div class="price-display">{{ formatPrice(amount) }}</div>
                  <small class="text-muted">{{ formatPrice(amount / property.area) }}/m²</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Steps -->
          <div class="payment-steps mb-4">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-label">Informations personnelles</div>
            </div>
            <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-label">Mode de paiement</div>
            </div>
            <div class="step" :class="{ active: currentStep >= 3 }">
              <div class="step-number">3</div>
              <div class="step-label">Confirmation</div>
            </div>
          </div>

          <!-- Step 1: Personal Information -->
          <div v-if="currentStep === 1" class="payment-step">
            <h6>Informations personnelles</h6>
            <form @submit.prevent="nextStep">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Prénom *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="buyerInfo.firstName"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nom *</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="buyerInfo.lastName"
                    required
                  >
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Email *</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="buyerInfo.email"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Téléphone *</label>
                  <input
                    type="tel"
                    class="form-control"
                    v-model="buyerInfo.phone"
                    required
                  >
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Adresse complète *</label>
                <textarea
                  class="form-control"
                  v-model="buyerInfo.address"
                  rows="2"
                  required
                ></textarea>
              </div>
              <div class="d-flex justify-content-end">
                <button type="submit" class="btn btn-primary">
                  Suivant <i class="fas fa-arrow-right ms-2"></i>
                </button>
              </div>
            </form>
          </div>

          <!-- Step 2: Payment Method -->
          <div v-if="currentStep === 2" class="payment-step">
            <h6>Mode de paiement</h6>
            <div class="payment-methods mb-4">
              <div class="payment-method" @click="selectPaymentMethod('mobile')" :class="{ active: paymentMethod === 'mobile' }">
                <div class="d-flex align-items-center">
                  <input type="radio" v-model="paymentMethod" value="mobile" class="me-3">
                  <div class="method-info">
                    <h6 class="mb-1">Mobile Money</h6>
                    <small class="text-muted">Orange Money, MTN Mobile Money</small>
                  </div>
                  <div class="method-icons ms-auto">
                    <i class="fab fa-cc-visa fa-2x text-muted me-2"></i>
                    <i class="fas fa-mobile-alt fa-2x text-primary"></i>
                  </div>
                </div>
              </div>
              
              <div class="payment-method" @click="selectPaymentMethod('bank')" :class="{ active: paymentMethod === 'bank' }">
                <div class="d-flex align-items-center">
                  <input type="radio" v-model="paymentMethod" value="bank" class="me-3">
                  <div class="method-info">
                    <h6 class="mb-1">Virement bancaire</h6>
                    <small class="text-muted">Transfert direct depuis votre banque</small>
                  </div>
                  <div class="method-icons ms-auto">
                    <i class="fas fa-university fa-2x text-success"></i>
                  </div>
                </div>
              </div>
              
              <div class="payment-method" @click="selectPaymentMethod('escrow')" :class="{ active: paymentMethod === 'escrow' }">
                <div class="d-flex align-items-center">
                  <input type="radio" v-model="paymentMethod" value="escrow" class="me-3">
                  <div class="method-info">
                    <h6 class="mb-1">Dépôt de garantie (Recommandé)</h6>
                    <small class="text-muted">Fonds bloqués jusqu'à finalisation</small>
                  </div>
                  <div class="method-icons ms-auto">
                    <i class="fas fa-shield-alt fa-2x text-success"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Payment Details -->
            <div v-if="paymentMethod === 'mobile'" class="payment-details">
              <div class="mb-3">
                <label class="form-label">Numéro de téléphone</label>
                <input
                  type="tel"
                  class="form-control"
                  v-model="paymentDetails.phoneNumber"
                  placeholder="Ex: +225 07 00 00 00 00"
                >
              </div>
              <div class="mb-3">
                <label class="form-label">Opérateur</label>
                <select class="form-select" v-model="paymentDetails.operator">
                  <option value="">Sélectionnez votre opérateur</option>
                  <option value="orange">Orange Money</option>
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="moov">Moov Money</option>
                </select>
              </div>
            </div>
            
            <div v-if="paymentMethod === 'bank'" class="payment-details">
              <div class="mb-3">
                <label class="form-label">Banque</label>
                <select class="form-select" v-model="paymentDetails.bank">
                  <option value="">Sélectionnez votre banque</option>
                  <option value="boa">Bank of Africa</option>
                  <option value="sgbci">Société Générale</option>
                  <option value="bicici">BICICI</option>
                  <option value="ecobank">Ecobank</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Numéro de compte</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="paymentDetails.accountNumber"
                  placeholder="Votre numéro de compte"
                >
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary" @click="prevStep">
                <i class="fas fa-arrow-left me-2"></i>Précédent
              </button>
              <button type="button" class="btn btn-primary" @click="nextStep" :disabled="!paymentMethod">
                Suivant <i class="fas fa-arrow-right ms-2"></i>
              </button>
            </div>
          </div>

          <!-- Step 3: Confirmation -->
          <div v-if="currentStep === 3" class="payment-step">
            <h6>Confirmation de l'achat</h6>
            
            <div class="confirmation-details">
              <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Information importante :</strong> Ceci est une simulation de paiement. Aucun montant réel ne sera débité.
              </div>
              
              <div class="purchase-breakdown">
                <h6>Récapitulatif</h6>
                <table class="table table-borderless">
                  <tbody>
                    <tr>
                      <td>Prix de la propriété</td>
                      <td class="text-end">{{ formatPrice(amount) }}</td>
                    </tr>
                    <tr>
                      <td>Frais de plateforme (3%)</td>
                      <td class="text-end">{{ formatPrice(amount * 0.03) }}</td>
                    </tr>
                    <tr>
                      <td>Frais de transaction</td>
                      <td class="text-end">{{ formatPrice(5000) }}</td>
                    </tr>
                    <tr class="fw-bold border-top">
                      <td>Total à payer</td>
                      <td class="text-end">{{ formatPrice(amount + (amount * 0.03) + 5000) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="terms-agreement">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="agreeTerms" v-model="agreedToTerms">
                  <label class="form-check-label" for="agreeTerms">
                    J'accepte les <a href="#" @click.prevent>conditions générales</a> et la <a href="#" @click.prevent>politique de confidentialité</a>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-outline-secondary" @click="prevStep">
                <i class="fas fa-arrow-left me-2"></i>Précédent
              </button>
              <button 
                type="button" 
                class="btn btn-success btn-lg" 
                @click="processPurchase"
                :disabled="!agreedToTerms || processing"
              >
                <span v-if="processing" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="fas fa-credit-card me-2"></i>
                {{ processing ? 'Traitement...' : 'Finaliser l\'achat' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  property: {
    type: Object,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

defineEmits(['close', 'success'])

const authStore = useAuthStore()

const currentStep = ref(1)
const paymentMethod = ref('')
const agreedToTerms = ref(false)
const processing = ref(false)

const buyerInfo = ref({
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  email: authStore.user?.email || '',
  phone: authStore.user?.phone || '',
  address: ''
})

const paymentDetails = ref({
  phoneNumber: '',
  operator: '',
  bank: '',
  accountNumber: ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0
  }).format(price)
}

const formatPropertyType = (type) => {
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

const selectPaymentMethod = (method) => {
  paymentMethod.value = method
}

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const processPurchase = async () => {
  processing.value = true
  
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Emit success event
    emit('success', {
      propertyId: props.property.id,
      amount: props.amount + (props.amount * 0.03) + 5000,
      paymentMethod: paymentMethod.value,
      buyerInfo: buyerInfo.value,
      transactionId: `TXN-${Date.now()}`
    })
    
  } catch (error) {
    console.error('Payment processing error:', error)
    alert('Erreur lors du traitement du paiement')
  } finally {
    processing.value = false
  }
}
</script>

<style scoped>
.modal {
  z-index: 1060;
}

.purchase-summary {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #dee2e6;
}

.property-summary {
  padding: 15px 0;
}

.price-display {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8B4513;
}

.payment-steps {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.payment-steps::before {
  content: '';
  position: absolute;
  top: 15px;
  left: 15px;
  right: 15px;
  height: 2px;
  background-color: #dee2e6;
  z-index: 1;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #dee2e6;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.step.active .step-number {
  background-color: #8B4513;
  color: white;
}

.step.completed .step-number {
  background-color: #28a745;
  color: white;
}

.step-label {
  font-size: 0.9rem;
  text-align: center;
  color: #6c757d;
}

.step.active .step-label {
  color: #8B4513;
  font-weight: 600;
}

.payment-step {
  margin: 20px 0;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-method {
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.payment-method:hover {
  border-color: #8B4513;
  background-color: #f8f9fa;
}

.payment-method.active {
  border-color: #8B4513;
  background-color: rgba(139, 69, 19, 0.1);
}

.method-info h6 {
  margin-bottom: 5px;
  color: #333;
}

.payment-details {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.confirmation-details {
  margin: 20px 0;
}

.purchase-breakdown {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
}

.terms-agreement {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
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
