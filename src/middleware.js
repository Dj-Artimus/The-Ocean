import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request) {
  try {

    // Exclude manifest.json and other static files from middleware logic
    const pathname = request.nextUrl.pathname;
    if (pathname === "/manifest.json") {
      return new Response(null, { status: 200 });
    }

    const response = await updateSession(request);

    // Check if updateSession returned a redirect response
    if (response.redirected) {
      return response;
    }

    // Otherwise, return the updated session response
    return response;
  } catch (error) {
    console.log('Error in middleware', error)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, signup, landing-page, verify-email (unprotected routes)
     * - SVG, PNG, JPG, JPEG, GIF, WEBP (image file extensions)
     */
    // '/((?!_next/static|_next/image|favicon.ico|login|signup|landing-page|verify-email|select-username|auth/callback|$|\..*\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|login|signup|forgot-password|landing-page|verify-email|reset-password|auth/callback|droplet/[^/]+|.*\.(?:svg|png|jpg|jpeg|gif|webp)).*)',
  ],
};
