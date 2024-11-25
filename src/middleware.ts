import { clerkMiddleware, getAuth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export default clerkMiddleware(async (auth,req) => {
  try {
    const { userId } = await auth();
    const url = req.nextUrl;

    // If there's no user and they're trying to access an admin route, redirect to home
    if (!userId && url.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // If there's a user, check if they have the admin role
    if (userId) {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const isAdmin = user.publicMetadata?.role === 'admin';

      // If they're not an admin and trying to access an admin route, redirect to home
      if (!isAdmin && url.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (isAdmin && !url.pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    '/admin',
    '/products',
    '/cart',
    '/',
    '/(api|trpc)(.*)',
  ],
}