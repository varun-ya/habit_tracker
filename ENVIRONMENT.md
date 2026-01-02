# Environment Configuration Guide

## Environment Files

### Development
- `.env.local` - Local development environment (not committed)
- Copy `.env.local.example` to `.env.local` and fill in your values

### Production
- Environment variables should be set in your hosting platform
- Use `.env.example` as reference for required variables

## Variable Descriptions

### Database (PostgreSQL)
- `DATABASE_URL` - Full PostgreSQL connection string
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password  
- `POSTGRES_DB` - Database name

### Authentication Options

#### NextAuth.js
- `NEXTAUTH_URL` - Your app's URL
- `NEXTAUTH_SECRET` - Secret for JWT encryption
- OAuth provider credentials (Google, GitHub, etc.)

#### Clerk (Alternative)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public key
- `CLERK_SECRET_KEY` - Private key
- Sign-in/up URLs and redirect paths

## Environment Separation

### Development
- Use local PostgreSQL instance
- HTTP URLs (localhost:3000)
- Development secrets (can be simple)
- Debug logging enabled

### Production
- Managed database service
- HTTPS URLs
- Strong, unique secrets
- Error logging only
- Environment variables via hosting platform