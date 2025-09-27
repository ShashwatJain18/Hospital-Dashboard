# DoctorHub - Medical Practice Management System

A comprehensive medical practice management system built with Next.js 14, TypeScript, and Prisma.

## Features

- **Patient Management**: Complete patient records with medical history, appointments, and notes
- **Messaging System**: Secure communication with patients and staff
- **Calendar & Appointments**: Schedule and manage appointments with drag-and-drop interface
- **Support Tickets**: Track and resolve patient inquiries and issues
- **Settings & Preferences**: Customizable user preferences and clinic settings
- **Data Persistence**: Dual-mode storage (SQLite for development, PostgreSQL for production)
- **Responsive Design**: Mobile-first design with dark theme
- **Real-time Updates**: Live messaging and appointment notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd doctorhub
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Initialize the database:
\`\`\`bash
npm run db:push
npm run db:generate
\`\`\`

5. Seed the database with sample data:
\`\`\`bash
npm run db:seed
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Database Setup

### Development (SQLite)
The app uses SQLite by default for development. No additional setup required.

### Production (PostgreSQL)
1. Set up a PostgreSQL database
2. Update the `DATABASE_URL` in your environment variables:
\`\`\`
DATABASE_URL="postgresql://username:password@host:port/database"
\`\`\`
3. Run migrations:
\`\`\`bash
npm run db:push
\`\`\`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

\`\`\`
DATABASE_URL="your-postgresql-connection-string"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── (dashboard)/       # Dashboard layout group
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── prisma/               # Database schema and migrations
├── scripts/              # Database seed scripts
└── public/               # Static assets
\`\`\`

## API Endpoints

- `GET/POST /api/patients` - Patient management
- `GET/POST /api/messages` - Messaging system
- `GET/POST /api/appointments` - Calendar and appointments
- `GET/POST /api/support` - Support tickets
- `GET/POST /api/settings` - User settings

## Features Overview

### Dashboard
- Overview of upcoming appointments
- Unread message count
- Today's patients
- Quick actions

### Patient Management
- Complete patient profiles
- Medical history and notes
- Appointment history
- Search and filtering

### Messaging
- Patient-specific conversations
- File attachments
- Read/unread status
- Real-time updates

### Calendar
- Month/week/day views
- Drag-and-drop scheduling
- Appointment management
- Export/import functionality

### Support System
- Ticket management
- Priority levels
- Patient linking
- Response tracking

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
