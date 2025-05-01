# Project Roadmap

## Phase 1: Authentication & User Management

### Login & Registration
- Email/password registration with email verification
- Secure login (email/password)
- Google OAuth login
- CAPTCHA for bot protection
- Password strength enforcement

### User Profile Schema (MongoDB)
- Fields: email, hashed_password, name, phone, created_at, last_login
- Additional fields: subscription_status, subscription_history, assigned_zip_codes, lead_connector_webhook_url

### Session Management
- JWT-based sessions
- Session timeout & auto-logout
- "Remember me" support
- Multiple device login handling
- Secure storage of tokens

### Password Reset
- "Forgot password" flow
- Secure reset links via email
- Password update endpoint
- Email notification setup

---

## Phase 2: Subscription & Payment Processing

### NMI Payment Integration
- Secure payment form with card tokenization
- Recurring billing setup
- Failure handling logic
- Automated receipt emails

### Zip Code Pricing Logic
- Admin-editable dynamic pricing table
- Bulk zip code discount logic
- Promo code system (one-time & recurring)

### Subscription Lifecycle
- Auto-renewal with configurable grace period
- Add/remove zip codes from subscription
- Upgrade/downgrade paths
- Cancellation and refund logic

---

## Phase 3: Data Views

### Cards View (Dashboard)
- Optimize layout
- Add filters (e.g. zip, date, status)
- Sortable fields
- CSV export support

### List View
- Column sorting
- Bulk selection/actions
- Advanced filters
- Pagination optimization

### Map View (Mapbox)
- Clustering pins by proximity
- Custom tooltips / info windows
- Drawing tools (circle, polygon)
- Save/load custom drawn areas
- Filtering via boundaries

---

## Phase 4: Settings & Account Management

### Lead Connector Settings
- Editable webhook URL
- Test webhook tool
- Set error notification preferences
- Log errors with timestamps

### User Account Settings
- Edit profile info
- Contact methods/preferences
- 2FA or basic security settings
- Activity log & device history

### Subscription Dashboard (UI)
- Display active plan & next billing date
- Payment history and receipts
- Manage zip codes
- Usage statistics & limits
- Renewal/expiration info

---

## Phase 5: Admin Interface

### Zip Code Management
- Interface for adding/editing zip codes & pricing
- Bulk pricing tool
- Market analytics (basic charts)
- Zip availability toggles

### User Management
- Filterable user list
- View subscription status
- Assign/restrict access
- Impersonate user / support tools

### System Dashboard
- Revenue reporting
- Active user stats
- Server/system health
- Audit log of major actions
- Error reporting console

---

## Phase 6: Testing & Deployment

### Testing
- Unit tests: auth, payments, endpoints, schema
- Integration tests: end-to-end user flow
- Load testing w/ user simulation
- Security: XSS, CSRF, SQLi, etc.
- Browser compatibility tests

### Deployment
- Replit config & secrets setup
- Environment (dev/prod) segregation
- Database seeding/migration
- SSL & custom domain config
- Backup & recovery plan

### Monitoring
- Error logging (e.g. Sentry)
- Performance dashboard
- Usage analytics
- Uptime + alerts system 