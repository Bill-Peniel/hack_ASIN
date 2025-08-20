# Plateforme Foncier Intelligent

## Overview

This is a French real estate platform called "Plateforme Foncier Intelligent" (Intelligent Land Platform) built with Vue.js. The application serves as a marketplace for property transactions in Côte d'Ivoire, featuring role-based access for administrators, property owners, and buyers. The platform includes property management, user authentication, chat functionality, and property validation workflows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application is built using Vue.js 3 with the Composition API pattern. The architecture follows a component-based structure with:

- **Vue 3 with Composition API**: Modern reactive framework providing better performance and TypeScript support
- **Pinia for State Management**: Centralized store management for authentication, properties, users, and chat functionality
- **Vue Router**: Client-side routing with role-based navigation guards
- **Bootstrap 5**: UI framework for responsive design and components
- **Vite**: Modern build tool providing fast development server and optimized production builds

The frontend implements a Single Page Application (SPA) architecture with role-based dashboards for different user types (admin, property owners, buyers).

### Authentication & Authorization
The application uses a mock authentication system with:

- **Session-based authentication**: User data stored in localStorage for persistence
- **Role-based access control**: Three distinct user roles (admin, proprietaire, acheteur)
- **Route guards**: Navigation protection based on authentication status and user roles
- **OpenID Client dependency**: Prepared for future OAuth/OIDC integration

### Data Management
The application currently uses mock data stored in JavaScript modules:

- **Mock data structure**: Simulates real database entities for users, properties, and chats
- **Pinia stores**: Reactive state management for different data domains
- **Local state persistence**: User session maintained in browser localStorage
- **Memoization**: Performance optimization using memoizee for expensive computations

### Component Structure
The application follows a modular component architecture:

- **Views**: Page-level components organized by user role (admin/, owner/, buyer/, shared/)
- **Route-based code splitting**: Automatic chunking for vendor, UI, and maps libraries
- **Alias-based imports**: Clean import paths using Vite aliases (@components, @views, @stores, etc.)

### Geographic Features
The platform includes mapping capabilities for property visualization:

- **Leaflet integration**: Interactive maps for property locations
- **Satellite imagery**: Mock satellite image comparison for property verification
- **Geographic data**: Property locations with coordinates and address information

## External Dependencies

### Core Frontend Libraries
- **Vue.js 3**: Primary frontend framework
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Vite**: Build tool and development server

### UI and Styling
- **Bootstrap 5**: CSS framework for responsive design
- **Font Awesome**: Icon library
- **Leaflet**: Interactive mapping library

### Utilities and Performance
- **memoizee**: Function memoization for performance optimization
- **openid-client**: OAuth/OIDC client library (prepared for future authentication integration)

### Development Tools
- **Vite plugins**: Vue.js plugin for single-file components
- **Path aliases**: Configured for clean imports and better developer experience

The application is designed for future scalability with placeholder integrations for real authentication systems, database connections, and external mapping services. The current mock data structure provides a foundation for easy migration to a real backend API.