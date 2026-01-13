import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_CHANGE_THIS_LATER', // Must match auth.module.ts
    });
  }

  async validate(payload: any) {
    // This attaches the user object to the request
    // Access it later via: request.user.id or request.user.role
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}
