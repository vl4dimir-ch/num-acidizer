# Frontend

A React frontend application built with Vite, TanStack Query, and Zustand.

## Features

- **Counter Management**: Get and update counter values via API
- **TanStack Query**: Efficient data fetching with caching and optimistic updates
- **Zustand**: Lightweight state management
- **Native Fetch**: HTTP client with proper error handling
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern styling

## Environment Setup

Create a `.env.local` file in the frontend directory with:

```env
VITE_API_URL=http://localhost:3000/api
```

Replace the URL with your actual API endpoint.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

### API Integration
- **API Client**: Native fetch-based client with error handling (`src/lib/api/client.ts`)
- **Counter API**: Typed API service for counter operations (`src/features/counter/api/`)
- **TanStack Query Hooks**: React hooks for data fetching and mutations (`src/features/counter/hooks/`)

### State Management
- **Zustand Store**: Local state management with API integration (`src/stores/counterStore.ts`)
- **Combined Hook**: Unified interface combining API and local state (`useCounterWithStore`)

### Components
- **Counter Component**: Main counter interface with loading states and error handling
- **Optimistic Updates**: Immediate UI feedback with rollback on errors
- **Smooth Animations**: Animated counter value transitions

## API Endpoints

- `GET /counter` - Get current counter value
- `POST /counter/increment` - Increment counter by 1
- `POST /counter/decrement` - Decrement counter by 1

## Error Handling

- Network errors with retry logic
- API errors with user-friendly messages
- Optimistic updates with automatic rollback
- Loading states for better UX
