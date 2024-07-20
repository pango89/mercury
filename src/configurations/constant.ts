import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';

export const jwtConstants = {
  issuer: 'solar',
  algorithm: 'HS256',
  customerAccessTokenExpiry: process.env.CUSTOMER_ACCESS_TOKEN_EXPIRY_IN_MINUTES
    ? `${process.env.CUSTOMER_ACCESS_TOKEN_EXPIRY_IN_MINUTES}m`
    : '10m',
  customerRefreshTokenExpiryInHours: 24,
  verificationTokenExpiry: '120h',
  resetTokenExpiry: '30m',
  jwtIdForAccessToken: 'AccessToken',
  jwtIdForVerificationToken: 'VerificationToken',
  jwtIdForResetToken: 'ResetToken',
};

export const jwtVerifyOptions: JwtVerifyOptions = {
  secret: process.env.JWT_SECRET_KEY,
  issuer: jwtConstants.issuer,
  algorithms: ['HS256'],
};

export const jwtSignOptions: JwtSignOptions = {
  secret: process.env.JWT_SECRET_KEY,
  issuer: jwtConstants.issuer,
  algorithm: 'HS256',
};

export enum OAuthProvider {
  'GOOGLE' = 'GOOGLE',
  'MERCURY' = 'MERCURY',
}

export const defaults = {
  password: 'Mercury@123',
  country: 'IN',
};

export const PASSWORD_REGEX = {
  UPPER_CASE: `(?=.*[A-Z])`, // Ensure string has 1 uppercase letters.
  SPECIAL_CASE: `(?=.*[!@#$&*])`, // Ensure string has 1 special case letter.
  LOWER_CASE: `(?=.*[a-z])`, // Ensure string has 1 lowercase letters
  NUMBER: `(?=.*[0-9])`, // Ensure string has 1 digits.
  LENGTH: `.{12,20}`, // Ensure string is of min length 12 max 20.
};

export const PASSWORD_POLICY = `^${PASSWORD_REGEX.UPPER_CASE}${PASSWORD_REGEX.SPECIAL_CASE}${PASSWORD_REGEX.LOWER_CASE}${PASSWORD_REGEX.NUMBER}${PASSWORD_REGEX.LENGTH}$`;
