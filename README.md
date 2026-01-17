# LeadFlow CRM

A modern, full-stack Lead Management Dashboard built with Next.js 14 and MongoDB. This application provides a complete CRM solution for tracking and managing sales leads with features like analytics, filtering, pagination, and more.


## Features

- **Dashboard Analytics**: View key metrics including total leads, pipeline value, conversion rate, and average deal size
- **Lead Management**: Create, read, update, and delete leads with full CRUD operations
- **Advanced Filtering**: Filter leads by stage, source, and search by name, email, or company
- **Pagination**: Efficient pagination for large datasets
- **Responsive Design**: Mobile-first design that works seamlessly on all devices
- **Authentication**: Secure login system with demo credentials
- **Data Visualization**: Charts showing leads by stage and source distribution
- **Data Seeding**: Easy API endpoint to seed your database with 500+ realistic dummy leads

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js (Credentials Provider)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- MongoDB Atlas account (free tier)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leadflow-crm.git
   cd leadflow-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file and update it with your values:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your MongoDB connection string:
   ```env
   # MongoDB Database Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/leadflow?retryWrites=true&w=majority
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-in-production
   
   # Demo Login Credentials
   DEMO_EMAIL=admin@leadflow.com
   DEMO_PASSWORD=admin123
   
   # Application Settings
   NEXT_PUBLIC_APP_NAME=LeadFlow CRM
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Seeding the Database

To populate your database with sample leads, visit:

```
http://localhost:3000/api/seed?count=500
```

This will create 500 realistic dummy leads with various stages, sources, and values.

To clear all leads:
```
http://localhost:3000/api/seed
```

(DELETE request to the same endpoint)

## Demo Credentials

- **Email**: admin@leadflow.com
- **Password**: admin123

## Project Structure

```
leadflow-crm/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── layout.tsx            # Auth layout
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── page.tsx              # Dashboard/Analytics page
│   │   └── leads/
│   │       ├── page.tsx          # Leads list with filters
│   │       ├── new/
│   │       │   └── page.tsx      # Create new lead
│   │       └── [id]/
│   │           ├── page.tsx      # Lead details view
│   │           └── edit/
│   │               └── page.tsx  # Edit lead form
│   ├── api/
│   │   ├── leads/
│   │   │   ├── route.ts          # GET (list), POST (create)
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PATCH, DELETE
│   │   ├── analytics/
│   │   │   └── route.ts          # Analytics aggregation
│   │   ├── seed/
│   │   │   └── route.ts          # Database seeding
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts      # NextAuth handler
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/
│   ├── dashboard/
│   │   ├── AnalyticsCards.tsx    # KPI cards
│   │   ├── LeadsChart.tsx        # Bar chart by stage
│   │   ├── SourceChart.tsx       # Pie chart by source
│   │   └── RecentLeads.tsx       # Recent leads list
│   ├── ui/                       # Reusable UI components
│   └── AuthProvider.tsx          # NextAuth provider
├── lib/
│   ├── db.ts                     # MongoDB connection
│   ├── models/
│   │   └── Lead.ts               # Lead Mongoose model
│   └── types.ts                  # TypeScript types
├── middleware.ts                 # Route protection
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## API Endpoints

### Leads

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/leads` | Get all leads with filtering, sorting, pagination |
| POST | `/api/leads` | Create a new lead |
| GET | `/api/leads/[id]` | Get a single lead |
| PATCH | `/api/leads/[id]` | Update a lead |
| DELETE | `/api/leads/[id]` | Delete a lead |

### Query Parameters (GET /api/leads)

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| search | string | Search in name, email, company |
| stage | string | Filter by stage |
| source | string | Filter by source |
| minValue | number | Minimum deal value |
| maxValue | number | Maximum deal value |
| startDate | date | Filter by created date (from) |
| endDate | date | Filter by created date (to) |
| sortField | string | Field to sort by |
| sortDirection | asc/desc | Sort direction |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics` | Get aggregated analytics metrics |

### Seed

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/seed?count=N` | Seed N dummy leads |
| DELETE | `/api/seed` | Delete all leads |

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub repository
2. Log in to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (your Vercel URL)
   - `NEXTAUTH_SECRET` (generate a secure secret)
   - `DEMO_EMAIL`
   - `DEMO_PASSWORD`
5. Deploy!

### MongoDB Atlas Setup

1. Create a free [MongoDB Atlas](https://www.mongodb.com/atlas) account
2. Create a new cluster (free tier)
3. Create a database user with read/write permissions
4. Add your IP address to the IP whitelist (0.0.0.0/0 for Vercel)
5. Get your connection string from "Connect > Connect your application"
6. Use the connection string in your environment variables

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXTAUTH_URL` | Yes | Your application URL |
| `NEXTAUTH_SECRET` | Yes | Secret for NextAuth encryption |
| `DEMO_EMAIL` | No | Demo login email (default: admin@leadflow.com) |
| `DEMO_PASSWORD` | No | Demo login password (default: admin123) |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request



## Support

If you have any questions or need help, please open an issue in the GitHub repository.
