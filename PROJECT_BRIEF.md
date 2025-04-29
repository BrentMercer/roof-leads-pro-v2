# Roof Leads Pro - Project Brief

## Project Overview
Roof Leads Pro is a SaaS application that aggregates MLS (Multiple Listing Service) data to identify homeowners who may need new roofs. The system analyzes real estate transactions and property data to generate qualified leads for roofing contractors. These leads are then shared with clients through a subscription-based model.

### Core Value Proposition
- Automated lead generation for roofing contractors
- Data-driven property analysis
- Subscription-based access to qualified leads
- Integration with MLS data sources
- Customizable lead filtering and management

## Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with Radix UI primitives
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form
- **Data Fetching**: Next.js API routes and fetch API
- **Authentication**: NextAuth.js

### Backend
- **Runtime**: Node.js
- **Database**: MongoDB
- **ORM**: Mongoose
- **API**: Next.js API routes
- **Authentication**: NextAuth.js
- **Email**: Mailtrap (development) / SMTP (production)
- **Payment Processing**: NMI Integration
- **Maps**: Mapbox

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: Node.js
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

### External Services
- **MLS Data Integration**: Custom sync service
- **Email Service**: Mailtrap (dev) / SMTP (prod)
- **Payment Processing**: NMI
- **Maps**: Mapbox
- **Authentication**: Google OAuth, Email/Password
- **Security**: reCAPTCHA Enterprise

## Core Features

### Authentication & User Management
- Email/password registration with verification
- Google OAuth login
- Password reset functionality
- Role-based access control (USER, SUPER_ADMIN, SUB_ADMIN)
- Session management
- Two-factor authentication support

### Lead Management
- MLS data aggregation and processing
- Property analysis and lead scoring
- Customizable lead filters
- Multiple view options (cards, list, map)
- Lead export functionality
- Lead assignment and tracking

### Subscription Management
- Zip code-based pricing
- Recurring billing
- Subscription lifecycle management
- Usage tracking and limits
- Payment history and receipts

### Admin Features
- User management
- Zip code management
- System monitoring
- Revenue reporting
- Error tracking and logging

## Data Models

### User
- Authentication details
- Profile information
- Subscription status
- Assigned zip codes
- Role and permissions

### Transaction
- Property details
- Listing information
- Agent information
- Status tracking
- Historical data

### Agent
- Contact information
- Office details
- License information
- Transaction history

### Subscription
- Plan details
- Billing information
- Usage tracking
- Payment history

## Development Status
The project is currently in active development with core functionality implemented. Recent work has focused on:
- Migration from Prisma to MongoDB
- Type system improvements
- Authentication system implementation
- Lead management features
- Admin interface development

## Known Technical Debt
- Type definitions need consolidation
- Error handling standardization
- Test coverage improvement
- Performance optimization for large datasets
- Documentation updates

## Future Considerations
- API rate limiting implementation
- Caching strategy optimization
- Real-time updates for lead status
- Enhanced reporting features
- Mobile application development
- Integration with CRM systems

## Security Considerations
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Secure payment processing
- Regular security audits

## Performance Targets
- Page load time < 2s
- API response time < 500ms
- Support for 10,000+ concurrent users
- Real-time data updates
- Efficient data synchronization

## Deployment
- Development: Local environment
- Staging: TBD
- Production: TBD
- CI/CD: TBD
- Monitoring: TBD 