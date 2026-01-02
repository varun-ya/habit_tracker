import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/habits/:path*',
    '/analytics/:path*',
    '/goals/:path*',
    '/mood/:path*',
    '/api/habits/:path*',
    '/api/habit-logs/:path*',
    '/api/analytics/:path*',
  ],
};