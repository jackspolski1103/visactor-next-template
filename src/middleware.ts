import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Si es una ruta pública, permitir acceso
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // API routes de autenticación
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Verificar si existe la cookie de sesión
  const sessionToken = request.cookies.get("better-auth.session_token");
  
  // Si no hay token de sesión, redirigir a login
  if (!sessionToken || !sessionToken.value) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si hay token, permitir continuar (la validación completa se hará en el cliente)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
