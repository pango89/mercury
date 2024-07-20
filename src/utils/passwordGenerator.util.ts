import * as RandExp from 'randexp';
import { PASSWORD_POLICY, defaults } from '../configurations/constant';

export const generatePassword = () => {
  try {
    const passwordPolicy = new RegExp(PASSWORD_POLICY);
    return new RandExp(passwordPolicy).gen();
  } catch (error) {
    return defaults.password;
  }
};
