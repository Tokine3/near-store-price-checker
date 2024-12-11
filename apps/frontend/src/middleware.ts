import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('auth-token'); // または他の認証トークン または他の認証トークン
  // ログインページへのアクセス時
    if (request.nextUrl.pathname === '/login') {
        if (isLoggedIn) {
        return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }
    // その他のページへのアクセス時
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
}
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};