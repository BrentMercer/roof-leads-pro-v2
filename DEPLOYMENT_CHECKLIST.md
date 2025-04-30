# Roof Leads Pro Deployment Checklist

## Environment Variables
- [ ] Update `NEXTAUTH_URL` to production URL (e.g., `https://your-app-name.onrender.com`)
- [ ] Update MongoDB connection string to production database
- [ ] Update email service credentials to production service (replace Mailtrap with production SMTP)
- [ ] Update Google OAuth credentials with production callback URLs
- [ ] Update reCAPTCHA keys to production keys
- [ ] Verify all sensitive keys are properly set in Render's environment variables

## Database
- [ ] Ensure MongoDB Atlas is properly configured for production
- [ ] Set up proper database backups
- [ ] Verify database indexes are optimized
- [ ] Check database connection pooling settings

## Security
- [ ] Enable HTTPS/SSL on Render
- [ ] Verify CORS settings for production domains
- [ ] Update CSP (Content Security Policy) headers
- [ ] Ensure all API routes have proper authentication checks
- [ ] Verify rate limiting is in place for sensitive endpoints

## Performance
- [ ] Enable production build optimizations
- [ ] Configure proper caching headers
- [ ] Set up CDN if needed
- [ ] Verify image optimization settings
- [ ] Check bundle size and optimize if needed

## Monitoring & Logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure production logging
- [ ] Set up uptime monitoring
- [ ] Configure performance monitoring
- [ ] Set up email notifications for critical errors

## Email System
- [ ] Test email delivery in production
- [ ] Verify email templates render correctly
- [ ] Check spam filters and email deliverability
- [ ] Update email "From" address to production domain
- [ ] Test email verification flow end-to-end

## Payment Processing
- [ ] Update NMI credentials to production
- [ ] Test payment processing in production
- [ ] Verify webhook endpoints are properly configured
- [ ] Test subscription management
- [ ] Verify receipt generation

## Testing
- [ ] Run end-to-end tests in production environment
- [ ] Test user registration flow
- [ ] Test login flow
- [ ] Test password reset flow
- [ ] Test subscription management
- [ ] Test lead management features
- [ ] Verify all forms and API endpoints

## Documentation
- [ ] Update API documentation with production endpoints
- [ ] Update README with production setup instructions
- [ ] Document deployment process
- [ ] Create rollback plan
- [ ] Document monitoring and maintenance procedures

## Render-Specific
- [ ] Configure proper build command
- [ ] Set up proper start command
- [ ] Configure auto-deploy settings
- [ ] Set up proper health check endpoint
- [ ] Configure proper instance size and scaling
- [ ] Set up proper environment variables in Render dashboard

## Domain & DNS
- [ ] Configure custom domain if needed
- [ ] Set up proper DNS records
- [ ] Verify SSL certificate
- [ ] Test domain redirects

## Backup & Recovery
- [ ] Document database backup procedures
- [ ] Test database restore process
- [ ] Document rollback procedures
- [ ] Set up automated backups

## Post-Deployment
- [ ] Monitor application logs for errors
- [ ] Check application performance
- [ ] Verify all features are working
- [ ] Test on different browsers and devices
- [ ] Monitor server resources
- [ ] Set up regular maintenance schedule

## User Communication
- [ ] Prepare maintenance window notifications
- [ ] Create user documentation for new features
- [ ] Set up support channels
- [ ] Prepare FAQ updates 