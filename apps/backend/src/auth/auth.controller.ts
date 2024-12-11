import { Controller, Body, UnauthorizedException, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { auth } from 'src/config/firebase-admin';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify')
  async verifyToken(@Body() body: { token: string }) {
    try {
      // IDトークンを検証
      const decodedToken = await auth.verifyIdToken(body.token);

      console.log('decodedToken:', decodedToken);

      // セッションクッキーのオプション
      const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5日間

      // セッションクッキーを作成
      const sessionCookie = await auth.createSessionCookie(body.token, {
        expiresIn,
      });

      return {
        token: sessionCookie,
        // レスポンスヘッダーにCookieを設定
        options: {
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
        },
      };
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('認証に失敗しました');
    }
  }
}
