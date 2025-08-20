// Mock Users Data
export const mockUsers = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'System',
    email: 'admin@demo.com',
    password: 'admin123',
    phone: '+225 07 00 00 00 01',
    role: 'admin',
    status: 'actif',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'owner@demo.com',
    password: 'owner123',
    phone: '+225 07 00 00 00 02',
    role: 'proprietaire',
    status: 'actif',
    address: 'Cocody Riviera, Abidjan',
    city: 'Abidjan',
    createdAt: '2024-01-15T10:30:00.000Z',
    updatedAt: '2024-01-15T10:30:00.000Z'
  },
  {
    id: '3',
    firstName: 'Marie',
    lastName: 'Martin',
    email: 'buyer@demo.com',
    password: 'buyer123',
    phone: '+225 07 00 00 00 03',
    role: 'acheteur',
    status: 'actif',
    address: 'Plateau, Abidjan',
    city: 'Abidjan',
    createdAt: '2024-02-01T14:20:00.000Z',
    updatedAt: '2024-02-01T14:20:00.000Z'
  },
  {
    id: '4',
    firstName: 'Kouassi',
    lastName: 'Koffi',
    email: 'proprietaire2@demo.com',
    password: 'prop123',
    phone: '+225 07 00 00 00 04',
    role: 'proprietaire',
    status: 'en_attente_validation',
    createdAt: '2024-02-10T09:15:00.000Z',
    updatedAt: '2024-02-10T09:15:00.000Z'
  },
  {
    id: '5',
    firstName: 'Fatou',
    lastName: 'Traoré',
    email: 'acheteur2@demo.com',
    password: 'buyer123',
    phone: '+225 07 00 00 00 05',
    role: 'acheteur',
    status: 'actif',
    createdAt: '2024-02-15T16:45:00.000Z',
    updatedAt: '2024-02-15T16:45:00.000Z'
  }
]

// Mock Properties Data
export const mockProperties = [
  {
    id: '1',
    title: 'Terrain résidentiel à Cocody',
    type: 'terrain_nu',
    area: 800,
    price: 25000000,
    description: 'Magnifique terrain résidentiel situé dans le quartier prisé de Cocody. Idéal pour construction de villa.',
    ownerId: '2',
    status: 'disponible',
    forSale: true,
    location: {
      region: 'Abidjan',
      city: 'Cocody',
      address: 'Riviera Golf, près du carrefour Soleil',
      coordinates: {
        lat: 5.3473,
        lng: -4.0114
      }
    },
    documents: [
      {
        id: 'doc1',
        name: 'Titre foncier.pdf',
        type: 'application/pdf',
        size: 1024000
      },
      {
        id: 'doc2',
        name: 'Plan cadastral.pdf',
        type: 'application/pdf',
        size: 512000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop1-current.jpg',
      previous: '/api/mock/satellite/prop1-previous.jpg',
      changeDetected: false
    },
    createdAt: '2024-01-20T10:00:00.000Z',
    validatedAt: '2024-01-22T15:30:00.000Z',
    updatedAt: '2024-01-25T09:20:00.000Z'
  },
  {
    id: '2',
    title: 'Villa moderne à Bingerville',
    type: 'maison',
    area: 400,
    price: 45000000,
    description: 'Villa moderne de 6 pièces avec jardin, garage et piscine. Quartier sécurisé.',
    ownerId: '2',
    status: 'disponible',
    forSale: true,
    location: {
      region: 'Abidjan',
      city: 'Bingerville',
      address: 'Quartier résidentiel, Route de Bassam',
      coordinates: {
        lat: 5.3553,
        lng: -3.8977
      }
    },
    documents: [
      {
        id: 'doc3',
        name: 'Acte de propriété.pdf',
        type: 'application/pdf',
        size: 800000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop2-current.jpg',
      previous: '/api/mock/satellite/prop2-previous.jpg',
      changeDetected: false
    },
    createdAt: '2024-01-25T14:30:00.000Z',
    validatedAt: '2024-01-27T11:15:00.000Z',
    updatedAt: '2024-01-30T16:45:00.000Z'
  },
  {
    id: '3',
    title: 'Terrain agricole à Yamoussoukro',
    type: 'agricole',
    area: 5000,
    price: 15000000,
    description: 'Vaste terrain agricole fertile, idéal pour cultures vivrières ou plantation.',
    ownerId: '4',
    status: 'en_attente_validation',
    forSale: false,
    location: {
      region: 'Yamoussoukro',
      city: 'Yamoussoukro',
      address: 'Zone agricole, Route de Bouaké',
      coordinates: {
        lat: 6.8276,
        lng: -5.2893
      }
    },
    documents: [
      {
        id: 'doc4',
        name: 'Certificat foncier.pdf',
        type: 'application/pdf',
        size: 950000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop3-current.jpg',
      previous: '/api/mock/satellite/prop3-previous.jpg',
      changeDetected: true
    },
    createdAt: '2024-02-05T08:20:00.000Z',
    updatedAt: '2024-02-05T08:20:00.000Z'
  },
  {
    id: '4',
    title: 'Local commercial Plateau',
    type: 'commercial',
    area: 120,
    price: 35000000,
    description: 'Local commercial situé au cœur du Plateau, zone d\'affaires. Parfait pour bureau ou commerce.',
    ownerId: '2',
    status: 'valide',
    forSale: false,
    location: {
      region: 'Abidjan',
      city: 'Plateau',
      address: 'Avenue Chardy, près de la Cathédrale',
      coordinates: {
        lat: 5.3198,
        lng: -4.0267
      }
    },
    documents: [
      {
        id: 'doc5',
        name: 'Titre de propriété.pdf',
        type: 'application/pdf',
        size: 1200000
      },
      {
        id: 'doc6',
        name: 'Permis de construire.pdf',
        type: 'application/pdf',
        size: 600000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop4-current.jpg',
      previous: '/api/mock/satellite/prop4-previous.jpg',
      changeDetected: false
    },
    createdAt: '2024-02-08T11:00:00.000Z',
    validatedAt: '2024-02-10T14:20:00.000Z',
    updatedAt: '2024-02-10T14:20:00.000Z'
  },
  {
    id: '5',
    title: 'Appartement standing à Marcory',
    type: 'appartement',
    area: 85,
    price: 18000000,
    description: 'Appartement 3 pièces dans résidence moderne avec ascenseur et parking.',
    ownerId: '4',
    status: 'disponible',
    forSale: true,
    location: {
      region: 'Abidjan',
      city: 'Marcory',
      address: 'Zone 4C, Résidence les Palmiers',
      coordinates: {
        lat: 5.2669,
        lng: -3.9911
      }
    },
    documents: [
      {
        id: 'doc7',
        name: 'Contrat de vente.pdf',
        type: 'application/pdf',
        size: 750000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop5-current.jpg',
      previous: '/api/mock/satellite/prop5-previous.jpg',
      changeDetected: false
    },
    createdAt: '2024-02-12T13:45:00.000Z',
    validatedAt: '2024-02-14T09:30:00.000Z',
    updatedAt: '2024-02-15T17:10:00.000Z'
  },
  {
    id: '6',
    title: 'Terrain avec bâtiment à San-Pedro',
    type: 'terrain_avec_batiment',
    area: 1200,
    price: 22000000,
    description: 'Terrain avec ancienne maison à rénover, proche du port de San-Pedro.',
    ownerId: '2',
    status: 'disponible',
    forSale: true,
    location: {
      region: 'San-Pedro',
      city: 'San-Pedro',
      address: 'Quartier Balmer, près du port',
      coordinates: {
        lat: 4.7467,
        lng: -6.6364
      }
    },
    documents: [
      {
        id: 'doc8',
        name: 'Acte notarié.pdf',
        type: 'application/pdf',
        size: 1100000
      }
    ],
    satelliteImages: {
      current: '/api/mock/satellite/prop6-current.jpg',
      previous: '/api/mock/satellite/prop6-previous.jpg',
      changeDetected: false
    },
    createdAt: '2024-02-18T16:20:00.000Z',
    validatedAt: '2024-02-20T10:45:00.000Z',
    updatedAt: '2024-02-20T10:45:00.000Z'
  }
]

// Mock Chats Data
export const mockChats = [
  {
    id: 'chat1',
    propertyId: '1',
    participants: ['2', '3'], // Jean Dupont (owner) and Marie Martin (buyer)
    createdAt: '2024-02-20T14:30:00.000Z',
    lastMessage: 'Le terrain est-il toujours disponible ?',
    lastMessageTime: '2024-02-21T10:15:00.000Z'
  },
  {
    id: 'chat2',
    propertyId: '2',
    participants: ['2', '5'], // Jean Dupont (owner) and Fatou Traoré (buyer)
    createdAt: '2024-02-22T09:45:00.000Z',
    lastMessage: 'Pouvons-nous organiser une visite ?',
    lastMessageTime: '2024-02-22T16:20:00.000Z'
  },
  {
    id: 'chat3',
    propertyId: '5',
    participants: ['4', '3'], // Kouassi Koffi (owner) and Marie Martin (buyer)
    createdAt: '2024-02-23T11:00:00.000Z',
    lastMessage: 'L\'appartement m\'intéresse beaucoup',
    lastMessageTime: '2024-02-23T17:30:00.000Z'
  }
]

// Mock Messages Data
export const mockMessages = [
  // Chat 1 Messages
  {
    id: 'msg1',
    chatId: 'chat1',
    senderId: '3',
    content: 'Bonjour, je suis intéressée par votre terrain à Cocody.',
    type: 'text',
    timestamp: '2024-02-20T14:30:00.000Z',
    read: true
  },
  {
    id: 'msg2',
    chatId: 'chat1',
    senderId: '2',
    content: 'Bonjour Marie, merci pour votre intérêt. Le terrain est effectivement disponible.',
    type: 'text',
    timestamp: '2024-02-20T15:45:00.000Z',
    read: true
  },
  {
    id: 'msg3',
    chatId: 'chat1',
    senderId: '3',
    content: 'Parfait ! Pourriez-vous me donner plus de détails sur l\'état du terrain ?',
    type: 'text',
    timestamp: '2024-02-20T16:20:00.000Z',
    read: true
  },
  {
    id: 'msg4',
    chatId: 'chat1',
    senderId: '2',
    content: 'Bien sûr ! Le terrain est plat, bien délimité et prêt à construire. Toutes les commodités sont accessibles.',
    type: 'text',
    timestamp: '2024-02-21T08:30:00.000Z',
    read: true
  },
  {
    id: 'msg5',
    chatId: 'chat1',
    senderId: '3',
    content: 'Le terrain est-il toujours disponible ?',
    type: 'text',
    timestamp: '2024-02-21T10:15:00.000Z',
    read: false
  },

  // Chat 2 Messages
  {
    id: 'msg6',
    chatId: 'chat2',
    senderId: '5',
    content: 'Bonsoir, votre villa à Bingerville m\'intéresse énormément.',
    type: 'text',
    timestamp: '2024-02-22T09:45:00.000Z',
    read: true
  },
  {
    id: 'msg7',
    chatId: 'chat2',
    senderId: '2',
    content: 'Bonsoir Fatou, je suis ravi de votre intérêt. La villa est en excellent état.',
    type: 'text',
    timestamp: '2024-02-22T11:20:00.000Z',
    read: true
  },
  {
    id: 'msg8',
    chatId: 'chat2',
    senderId: '5',
    content: 'Pouvons-nous organiser une visite ?',
    type: 'text',
    timestamp: '2024-02-22T16:20:00.000Z',
    read: false
  },

  // Chat 3 Messages
  {
    id: 'msg9',
    chatId: 'chat3',
    senderId: '3',
    content: 'Bonjour, je souhaiterais avoir des informations sur votre appartement.',
    type: 'text',
    timestamp: '2024-02-23T11:00:00.000Z',
    read: true
  },
  {
    id: 'msg10',
    chatId: 'chat3',
    senderId: '4',
    content: 'Bonjour Marie, l\'appartement est spacieux et très bien situé.',
    type: 'text',
    timestamp: '2024-02-23T14:15:00.000Z',
    read: true
  },
  {
    id: 'msg11',
    chatId: 'chat3',
    senderId: '3',
    content: 'L\'appartement m\'intéresse beaucoup',
    type: 'text',
    timestamp: '2024-02-23T17:30:00.000Z',
    read: false
  }
]

// Property Types for reference
export const propertyTypes = [
  { value: 'terrain_nu', label: 'Terrain nu' },
  { value: 'terrain_avec_batiment', label: 'Terrain avec bâtiment' },
  { value: 'maison', label: 'Maison' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'commercial', label: 'Local commercial' },
  { value: 'agricole', label: 'Terrain agricole' }
]

// Regions of Côte d'Ivoire
export const regions = [
  'Abidjan',
  'Yamoussoukro',
  'Bouaké',
  'San-Pedro',
  'Korhogo',
  'Daloa',
  'Man',
  'Gagnoa',
  'Abengourou',
  'Grand-Bassam'
]

// Property Status
export const propertyStatus = [
  { value: 'en_attente_validation', label: 'En attente de validation' },
  { value: 'valide', label: 'Validée' },
  { value: 'rejete', label: 'Rejetée' },
  { value: 'disponible', label: 'Disponible à la vente' }
]

// User Status
export const userStatus = [
  { value: 'en_attente_validation', label: 'En attente de validation' },
  { value: 'actif', label: 'Actif' },
  { value: 'suspendu', label: 'Suspendu' }
]

// User Roles
export const userRoles = [
  { value: 'admin', label: 'Administrateur' },
  { value: 'proprietaire', label: 'Propriétaire' },
  { value: 'acheteur', label: 'Acheteur' }
]
