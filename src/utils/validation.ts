import { EMAIL_REGEX } from '../constants/validation'

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email)
}
