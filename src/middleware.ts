import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of supported languages
const languages = ['en', 'hi', 'ur'];
const defaultLanguage = 'en';

// Export the middleware function as default
export default function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Skip if the pathname is for static files or API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Store the selected language in a cookie
  const selectedLanguage = request.cookies.get('NEXT_LOCALE')?.value || defaultLanguage;
  
  // Set the language cookie if it doesn't exist
  if (!request.cookies.has('NEXT_LOCALE')) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', defaultLanguage);
    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!_next|api|static|favicon.ico|.*\\..*).*)',
  ],
}; 