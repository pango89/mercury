export const ERRORS = {
  DEFAULT_ERROR_CODE: {
    code: 'DEFAULT_ERROR_CODE',
    message: 'Something went wrong',
  },
  INVALID_JWT_TOKEN: {
    code: 'INVALID_JWT_TOKEN',
    message: 'Please provide a valid JWT token',
  },
  INVALID_REFRESH_TOKEN: {
    code: 'INVALID_REFRESH_TOKEN',
    message: 'Refresh Token is invalid',
  },
  CUSTOMER_EMAIL_EXISTS: {
    code: 'CUSTOMER_EMAIL_EXISTS',
    message: 'Customer with provided email already exists',
  },
  CUSTOMER_CREATION_FAILED: {
    code: 'CUSTOMER_CREATION_FAILED',
    message: 'Failed during save in customer repository',
  },
  INVALID_GOOGLE_TOKEN: {
    code: 'INVALID_GOOGLE_TOKEN',
    message: 'Please provide a valid google token',
  },
  PASSWORD_POLICY: {
    code: 'INVALID_PASSWORD',
    message: 'Provided password does not meet the password policy requirements',
  },
  MISSING_UPPER_CASE_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Minimum one upper-case letter needs to be in password',
  },
  MISSING_LOWER_CASE_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Minimum one lower-case letter needs to be in password',
  },
  MISSING_NUMBER_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Minimum one digit needs to be in password',
  },
  MISSING_SPECIAL_CASE_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Minimum one special-case letter needs to be in password',
  },
  MISSING_LENGTH_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'Password length to be between 12 to 20',
  },
  INVALID_USERNAME: {
    code: 'INVALID_USERNAME',
    message: 'Please provide valid username',
  },
  CUSTOMER_NOT_FOUND: {
    code: 'CUSTOMER_NOT_FOUND',
    message: 'Customer not found',
  },
  CUSTOMER_INACTIVE: {
    code: 'CUSTOMER_INACTIVE',
    message: 'Customer is inactive',
  },
  INVALID_CUSTOMER_PASSWORD: {
    code: 'INVALID_CUSTOMER_PASSWORD',
    message: 'Invalid password supplied for customer',
  },
};
