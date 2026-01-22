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
  - `prescriptions` - e-prescriptions generated for patients (medication, dosage, quantity, provider info)
  - `appointments` - video consultation scheduling (patient info, doctor, scheduled time, video link, status)
  - `call_notes` - documentation for video consultations (author, note type, content, timestamps)
  - `provider_availability` - time slots for patient self-scheduling (doctor, start/end times, status)
  - `admin_users` - admin user accounts with roles and permissions (email, password hash, role, permissions JSON)

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

### Payment Processing
- **Stripe**: Payment gateway for subscription billing
- **stripe-replit-sync**: Replit integration for Stripe data synchronization
- **Stripe Products**: 6 medications seeded (Semaglutide, Tirzepatide, Finasteride, Minoxidil, Sildenafil, Tadalafil)
- **Checkout Flow**: `/api/stripe/checkout` for subscriptions, `/api/stripe/checkout-one-time` for one-time payments
- **Webhook Handling**: Automatic sync of Stripe events to local PostgreSQL database

### Call Scheduling Platform
- **Admin Scheduling**: Admins can schedule video consultations from lead cards via "Schedule Call" button
- **Appointment Management**: Admin dashboard has "Appointments" tab for viewing/managing all scheduled calls
- **Status Tracking**: Appointments track status (scheduled, in-progress, completed, cancelled, no-show)
- **Call Notes**: Doctors can add timestamped notes during/after consultations for documentation
- **Patient View**: Patients can view their appointments at `/my-appointments` by entering their email
- **Patient Self-Scheduling**: Patients can book available slots at `/schedule` after completing payment
- **Provider Availability**: Admin "Availability" tab for creating time slots patients can book
- **Video Links**: Flexible video link support for any platform (Zoom, Daily.co, Google Meet, etc.)
- **Email Normalization**: Patient emails are lowercased on storage for consistent lookup
- **Security Note**: MVP implementation - production would require proper authentication for patient portal

### Patient Flow
1. **Complete Intake**: Patient fills 8-step medical intake form at `/get-started`
2. **Make Payment**: Stripe checkout processes subscription or one-time payment
3. **Provider Reviews Files**: Provider reviews submitted documents (no call required)
4. **Prescription Generated**: When approved, lead status changes to completed, prescriptionStatus to ready
5. **Email Notification**: TODO - Configure Resend or SendGrid for automated prescription ready emails
6. **Optional Consultation**: Patient can optionally schedule a video call via `/schedule` if desired

### Admin Dashboard Security & User Management
- **Multi-User System**: Admin users are stored in the `admin_users` database table with bcrypt-encrypted passwords
- **Role-Based Access Control (RBAC)**: Three roles with different permissions:
  - **Super Admin**: Full access to all features including user management
  - **Provider**: View/edit leads, create prescriptions, manage appointments and availability
  - **Staff**: View leads, view prescriptions, manage appointments
- **Permission-Based Routes**: All admin routes are protected with permission-based middleware
- **Initial Setup**: First time accessing `/admin`, you'll be prompted to create the initial Super Admin account
- **User Management**: Super Admins can create, edit, and delete other admin users from the "Users" tab
- **Session Tokens**: Generated on login with 24-hour expiration, stored server-side
- **Rate Limiting**: 5 login attempts per IP, 15-minute lockout after exceeding limit
- **Logout**: Available from admin dashboard header, invalidates token server-side

### Future Enhancements
- **Email Integration**: Set up Resend or SendGrid integration for transactional emails when prescription is generated. The backend has placeholder code in `server/routes.ts` ready for email integration.
- **Patient Authentication**: Add proper patient authentication for secure access to appointments and prescriptions