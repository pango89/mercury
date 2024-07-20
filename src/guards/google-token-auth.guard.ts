import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { OAuthProvider } from '../configurations/constant';
import { ERRORS } from '../configurations/error';
import { OAuth2Client } from 'google-auth-library';
import { CustomerAuthService } from '../services/customer.auth.service';

@Injectable()
export class GoogleTokenAuthGuard implements CanActivate {
  private logger: Logger = new Logger(GoogleTokenAuthGuard.name);
  constructor(private authService: CustomerAuthService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request: any): Promise<boolean> {
    try {
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const googleClient = new OAuth2Client(googleClientId);

      const data = await googleClient.verifyIdToken({
        idToken: request.query.access_token,
        audience: googleClientId,
      });

      const payload = data.getPayload();

      const { given_name: first_name, family_name: last_name, email } = payload;

      const customerProfile = {
        first_name,
        last_name,
        email,
      };

      if (customerProfile.email) {
        request.user = await this.authService.findOrAddCustomer(
          customerProfile,
          OAuthProvider.GOOGLE,
        );
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error);
      if (error instanceof NotFoundException) throw error;
      else throw new UnauthorizedException(ERRORS.INVALID_GOOGLE_TOKEN.code);
    }
  }
}
