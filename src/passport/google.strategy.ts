import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as GoogleTokenStrategy from 'passport-google-id-token';
import { CustomerAuthService } from '../services/customer.auth.service';
import { OAuthProvider } from '../configurations/constant';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  GoogleTokenStrategy,
  'google-id-token',
) {
  constructor(private authService: CustomerAuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(
    request: any,
    parsedToken: any,
    googleId: string,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const {
      given_name: first_name,
      family_name: last_name,
      email,
    } = parsedToken.payload;
    const customerProfile = {
      first_name,
      last_name,
      email,
    };
    const customer = await this.authService.findOrAddCustomer(
      customerProfile,
      OAuthProvider.GOOGLE,
    );
    return done(null, customer);
  }
}
