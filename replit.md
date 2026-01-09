# WellnessMeds

## Overview

WellnessMeds is a comprehensive telehealth platform for weight management, hair loss, and sexual health treatments. It's a lead generation website where users can browse medications, learn about services, and submit inquiry forms to connect with licensed providers. The application follows a modern full-stack architecture with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and scroll animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Fonts**: DM Sans (body) and Outfit (headings) via Google Fonts

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for validation
- **Build Tool**: Vite for frontend, esbuild for backend bundling

### Data Storage
- **Database**: PostgreSQL
- **Schema Location**: `shared/schema.ts` using Drizzle's pgTable definitions
- **Tables**: 
  - `products` - medication listings (name, description, price, image, benefits, category)
    - Categories: weight-loss, hair-loss, sexual-health
  - `leads` - customer inquiries (name, email, phone, medication interest, message, status, plus medical intake fields)

### Key Design Patterns
- **Shared Types**: The `shared/` directory contains schema definitions and API route contracts used by both frontend and backend
- **Type-Safe API**: Routes are defined with Zod schemas in `shared/routes.ts`, providing runtime validation and TypeScript types
- **Database Seeding**: Products are seeded on server startup if the table is empty

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (Navigation, Footer, shadcn/ui)
    pages/        # Route pages (Home, Medications, HairLoss, SexualHealth, GetStarted, About, Admin, compliance pages)
    hooks/        # Custom hooks (use-products, use-leads, use-toast)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database operations
  db.ts           # Database connection
shared/           # Shared code between frontend and backend
  schema.ts       # Drizzle schema definitions
  routes.ts       # API contract definitions with Zod
```

### Development Workflow
- Run `npm run dev` for development with hot reloading
- Run `npm run db:push` to push schema changes to database
- Run `npm run build` to build for production

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit with type-safe queries
- **connect-pg-simple**: PostgreSQL session store (available but not currently used)

### UI Framework
- **shadcn/ui**: Complete component library built on Radix UI primitives
- **Radix UI**: Accessible, unstyled UI primitives (dialog, dropdown, form elements, etc.)
- **Tailwind CSS**: Utility-first CSS framework with custom medical/wellness color palette

### Frontend Libraries
- **TanStack React Query**: Data fetching and caching
- **Framer Motion**: Animation library
- **Lucide React**: Icon library
- **date-fns**: Date formatting utilities

### Build Tools
- **Vite**: Frontend build tool and dev server
- **esbuild**: Backend bundling for production
- **TypeScript**: Type checking across the entire codebase