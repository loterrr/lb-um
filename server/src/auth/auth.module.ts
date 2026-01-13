import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // Register JWT globally
    JwtModule.register({
      global: true,
      secret: 'SUPER_SECRET_KEY_CHANGE_THIS_LATER', // In prod, use env variable
      signOptions: { expiresIn: '12h' }, // Token lasts 12 hours
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Add PrismaService if needed
})
export class AuthModule {}
