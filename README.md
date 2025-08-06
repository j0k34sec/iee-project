# 🌌 InnoQuest: Hackathon 2025

A modern, feature-rich web application for managing the InnoQuest Hackathon 2025 event. Built with cutting-edge technologies to provide a seamless experience for participants and administrators.

## ✨ Features

### 🎯 Main Website
- **🚀 Landing Page**: Beautiful hero section with countdown timer
- **⏳ Dynamic Countdown**: Real-time countdown to hackathon launch
- **👥 Team Display**: Core team and event organizers showcase
- **📅 Timeline**: Interactive hackathon timeline with progress tracking
- **🔗 Registration**: Integrated Google Form registration link
- **📱 Responsive Design**: Mobile-first approach with beautiful animations

### 🛠️ Admin Dashboard
- **🔐 Secure Authentication**: Admin-only access control
- **📊 Dashboard Overview**: Real-time statistics and status monitoring
- **⏰ Countdown Management**: Update target dates, times, and messages
- **👥 Team Management**: Add/edit/delete core team members
- **🔧 Event Organizer Control**: Manage four categories of organizers
- **🔗 Registration Link Control**: Dynamic Google Form link management
- **📈 Timeline Control**: Update hackathon phase statuses
- **🔄 Real-time Updates**: All changes reflect immediately on the live site

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd innoquest-hackathon-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   # Push the database schema
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Visit [http://localhost:3000](http://localhost:3000) to see the main website
   - Visit [http://localhost:3000/admin](http://localhost:3000/admin) for the admin login

## 🔐 Admin Access

### Login Credentials
- **Username**: `innoquest`
- **Password**: `innoquest2025`

### Admin Dashboard Features
1. **Registration Link Management**
   - Update the Google Form registration link
   - Reset to default link if needed
   - Changes reflect immediately on the main site

2. **Countdown Control**
   - Modify target date and time
   - Update custom messages
   - Enable/disable countdown functionality

3. **Team Management**
   - Add/remove core team members
   - Edit roles and responsibilities
   - Manage event organizers by category

4. **Timeline Management**
   - Update hackathon phase statuses
   - Track progress through different stages
   - Reset timeline to initial state

## 📁 Project Structure

```
innoquest-hackathon-2025/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API endpoints
│   │   │   ├── teams/         # Team management API
│   │   │   ├── timeline/      # Timeline management API
│   │   │   ├── countdown/     # Countdown control API
│   │   │   ├── core-team/     # Core team management API
│   │   │   ├── event-organizers/ # Event organizers API
│   │   │   └── registration-link/ # Registration link API
│   │   ├── admin/             # Admin dashboard
│   │   └── page.tsx           # Main landing page
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── timeline-chart.tsx
│   │   └── shortlisted-candidates.tsx
│   ├── hooks/                # Custom React hooks
│   └── lib/                  # Utility functions and configurations
├── prisma/                   # Database schema
├── public/                   # Static assets
└── README.md                # This file
```

## 🛠️ Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Prisma Studio (database GUI)

# Type checking
npm run type-check   # Run TypeScript type checking
```

## 🎨 Technology Stack

### Core Framework
- **⚡ Next.js 15** - React framework with App Router
- **📘 TypeScript 5** - Type-safe JavaScript
- **🎨 Tailwind CSS 4** - Utility-first CSS framework

### UI Components
- **🧩 shadcn/ui** - High-quality accessible components
- **🎯 Lucide React** - Beautiful icon library
- **🌈 Framer Motion** - Smooth animations

### Database & Backend
- **🗄️ Prisma** - Next-generation ORM
- **🔐 NextAuth.js** - Authentication solution
- **🌐 Socket.io** - Real-time communication

### Development Tools
- **📊 TanStack Query** - Data synchronization
- **🐻 Zustand** - State management
- **🎣 React Hook Form** - Form handling
- **✅ Zod** - Schema validation

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Customization
- **Theme**: Modify `tailwind.config.ts` for custom themes
- **Colors**: Update CSS variables in `src/app/globals.css`
- **Content**: Edit pages in `src/app/` directory
- **Components**: Add new components in `src/components/`

## 🚀 Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Environment Setup
1. Set up production database
2. Configure environment variables
3. Build and deploy the application
4. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 API Documentation

### Registration Link API
- **GET** `/api/registration-link` - Get current registration link
- **POST** `/api/registration-link` - Update or reset registration link

### Countdown API
- **GET** `/api/countdown` - Get countdown configuration
- **POST** `/api/countdown` - Update countdown settings

### Team Management APIs
- **GET** `/api/teams` - Get all teams
- **POST** `/api/teams` - Add/update/delete teams
- **GET** `/api/core-team` - Get core team members
- **POST** `/api/core-team` - Manage core team
- **GET** `/api/event-organizers` - Get event organizers
- **POST** `/api/event-organizers` - Manage event organizers

### Timeline API
- **GET** `/api/timeline` - Get timeline phases
- **POST** `/api/timeline` - Update timeline status

## 🔒 Security Features

- **Admin Authentication**: Secure login system
- **API Protection**: All admin operations require authentication
- **Input Validation**: Comprehensive validation for all user inputs
- **XSS Protection**: Built-in Next.js security features
- **CSRF Protection**: Form submission security

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for the InnoQuest Hackathon 2025 🌌