# Overview

This is an academic search query builder web application designed to help students and researchers create precise academic search queries using simple commands. The application provides an intuitive interface for building complex search queries for academic databases like Google Scholar, PubMed, and other research platforms. It features a modern, responsive design with RTL (Arabic) language support and uses Firebase Firestore for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: TanStack React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Language Support**: RTL layout component for Arabic language interface

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database Schema**: Two main entities - searches and favorites with JSON fields for flexible query data storage
- **API Structure**: RESTful API with Express routes (currently minimal setup with storage abstraction layer)
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Cloud Database**: Configured for Neon Database (serverless PostgreSQL)
- **Client Storage**: Firebase Firestore for real-time data synchronization
- **Local Storage**: Browser localStorage for device ID generation and client-side persistence

## Authentication and Authorization
- **Authentication**: No user registration/login system - device-based identification using auto-generated UUIDs
- **Authorization**: Device ID-based data isolation ensures users only access their own searches and favorites

## Key Design Patterns
- **Component Architecture**: Modular component structure with separation of concerns
- **Custom Hooks**: Reusable hooks for Firebase operations, query building, and mobile detection
- **Type Safety**: Full TypeScript implementation with Zod schema validation
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Internationalization**: RTL support built into the component architecture

# External Dependencies

## Third-party Services
- **Firebase**: Firestore database for real-time data synchronization and offline support
- **Neon Database**: Serverless PostgreSQL hosting for primary database operations

## Core Libraries
- **Database**: Drizzle ORM, @neondatabase/serverless, connect-pg-simple for session storage
- **UI Framework**: React, Radix UI primitives, Shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority for component variants
- **State Management**: TanStack React Query for server state
- **Forms**: React Hook Form with Hookform resolvers and Zod validation
- **Date Handling**: date-fns with Arabic locale support
- **Development**: Vite, TypeScript, ESBuild for production builds

## Development Tools
- **Build System**: Vite with React plugin and runtime error overlay
- **Package Manager**: npm with lockfile version 3
- **Code Quality**: TypeScript strict mode, ESLint configuration through Vite
- **Deployment**: Production build optimization with code splitting and asset optimization