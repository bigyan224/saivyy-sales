import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes
const isPublicRoute = createRouteMatcher(['/',"/api/users","/api/auth(.*)"]);

const isAdminRoute = createRouteMatcher(['/admin(.*)','/api/admin(.*)'])
// Middleware configuration
export default clerkMiddleware(async (auth, req) => {
  // If the route is not public, check authentication
  if (!isPublicRoute(req)) {
    const { userId } = await auth();
    
    // If user is not signed in, redirect to sign-in page
    if (!userId) {
      const signInUrl = new URL('/', req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
  if (isAdminRoute(req) && (await auth()).sessionClaims?.metadata?.role !== 'admin') {
    const url = new URL("/unauthorized", req.url);
    url.searchParams.set("redirect", "/"); // target after showing
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
});

// Matcher for Next.js App Router
export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};