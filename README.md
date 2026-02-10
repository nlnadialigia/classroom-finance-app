# Classroom Finance App

Financial management system for private tutors, built with Next.js 16 and Prisma.

[Versão em português](docs/pt/README-pt.md)

## 🌐 Languages

This application is available in:
- **English (EN)** - Default
- **Portuguese (PT-BR)**

Access: `http://localhost:3000/en` or `http://localhost:3000/pt`

See [i18n documentation](docs/i18n.md) for details.

## 📋 Features

### 🎯 Student Management
- Student registration and management
- Custom tuition period configuration
- Monthly and extra payment tracking
- Individual student reports

### 💰 Complete Financial Control
- **Monthly Receipts**: 
  - Tuition control per student
  - Payment marking with date
  - Table view by month/student
  - Receipt editing and deletion
  - Detailed student reports
  
- **Extra Receipts**: 
  - Additional payment records
  - Full CRUD (create, edit, delete)
  - Filter by academic year
  - Association with specific students
  
- **Expenses**: 
  - Complete expense control
  - Full CRUD (create, edit, delete)
  - Categorization by description
  - Payment date tracking
  
- **Income and Previous Receipts**:
  - Investment income records
  - Previous year receipts tracking
  - Integration with main dashboard

### 📊 Smart Dashboard
- **Income Statement (DRE)**:
  - Complete monthly view of revenues and expenses
  - Automatic balance calculation
  - Brazilian currency formatting (pt-BR)
  - Separation by revenue/expense type
  
- **Summary Cards**:
  - Configurable initial balance
  - Total period revenues
  - Total period expenses
  - Automatically calculated net balance
  
- **Timezone Correction**:
  - Correct date processing in Brazilian timezone
  - Prevents month discrepancies from UTC issues

### 👥 Advanced User System
- **Secure Authentication**:
  - Magic links via email
  - Sessions with automatic expiration
  - Unique tokens per user
  
- **Access Levels**:
  - **Admin**: Full access + user management
  - **Editor**: Can create, edit and delete data
  - **Viewer**: View only
  
- **Administrative Panel**:
  - User creation and management
  - Magic link generation for access
  - Per-user permission control

### ⚙️ Flexible Settings
- **Annual Configuration**:
  - Academic year definition
  - Configurable default monthly value
  - Previous/initial balance
  
- **Optimized Interface**:
  - Loading states and skeletons
  - Content flash prevention
  - Smooth user experience

### 📱 Modern Interface
- **Responsive Design**: Works on desktop, tablet and mobile
- **Reusable Components**: Consistent interface throughout the system
- **Visual Feedback**: Toasts, loading states and confirmations
- **Brazilian Formatting**: Currency values and dates in national standard

## 🚀 Technologies

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS + Radix UI
- **Authentication**: Custom system with magic links
- **Validation**: Zod
- **Forms**: React Hook Form
- **Tables**: AG Grid
- **Notifications**: Sonner
- **State**: TanStack Query (React Query)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd classroom-finance-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. Setup database:
```bash
pnpm migrate
pnpm seed
```

5. Run the project:
```bash
pnpm dev
```

## 🗄️ Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Generate production build
- `pnpm start` - Start production server
- `pnpm migrate` - Run database migrations
- `pnpm studio` - Open Prisma Studio
- `pnpm seed` - Populate database with initial data
- `pnpm reset` - Reset database

## 🏗️ Project Structure

```
├── app/                    # App Router (Next.js 16)
│   ├── api/               # API Routes
│   ├── dashboard/         # Main dashboard with DRE
│   ├── recebimento-mensal/# Tuition control
│   ├── recebimento-extra/ # Extra receipts
│   ├── gastos/           # Expense control
│   ├── configuracoes/    # System settings
│   └── admin/            # Administrative panel
├── components/           # Reusable components
│   ├── dashboard/        # Dashboard components
│   ├── receipts/         # Receipt forms
│   ├── expenses/         # Expense forms
│   ├── settings/         # Settings components
│   └── ui/              # Base UI components
├── lib/                 # Utilities and configurations
│   ├── services/        # Data services
│   ├── db/             # Database configuration
│   └── types.ts        # TypeScript types
├── prisma/              # Schema and migrations
├── hooks/               # Custom hooks
├── providers/           # Context providers
├── utils/               # Utilities (formatting, dates)
└── docs/               # Technical documentation
```

## 🔐 Authentication System

The system uses magic links for secure authentication:
- **Magic Links**: Unique links sent via email
- **Secure Sessions**: Tokens with automatic expiration
- **Granular Control**: Different access levels per user
- **Unique Tokens**: Separate Editor and Viewer tokens

## 📊 Data Model

### Main Entities:
- **User**: Users with different access levels
- **Student**: Students with custom settings
- **MonthlyReceipt**: Tuition with payment control
- **ExtraReceipt**: Extra/one-time receipts
- **Expense**: Categorized expenses
- **Income**: Income and previous receipts
- **Config**: Per-user settings (year, values, balances)

## 🌐 Deploy

To deploy on Vercel:
```bash
pnpm build:vercel
```

## 🔧 Technical Features

### Implemented Fixes
- **Timezone**: Correct date processing in Brazilian timezone
- **Formatting**: Currency values in pt-BR standard (1.234,56)
- **Loading States**: Skeletons and loading states
- **Validation**: Array checks and error handling
- **Full CRUD**: Complete operations on all entities

### UX Improvements
- **Visual Feedback**: Confirmations and notifications on all actions
- **Intuitive Navigation**: Clear and organized interface
- **Responsiveness**: Works perfectly on all devices
- **Performance**: Optimized queries and smart caching

## 👨‍💻 Author

**Nádia Ligia**
- Email: nlnadialigia@gmail.com
