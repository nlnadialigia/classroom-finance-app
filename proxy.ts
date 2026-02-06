import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Páginas públicas
  const publicPaths = ['/login'];

  // Ignorar rotas de API e assets
  if (pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.includes('.') || publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Verificar sessão
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
