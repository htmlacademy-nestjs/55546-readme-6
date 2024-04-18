export const AuthenticationResponseMessage = {
  LoggedSuccess: 'User has been successfully logged.',
  LoggedError: 'Password or Login is wrong.',
  UserFound: 'User found',
  UserNotFound: 'User not found',
  UserExist: 'User with the email already exists',
  UserCreated: 'The new user has been successfully created.',
  UserPasswordWrong: 'User password is wrong',
} as const;

export const AuthenticationValidateMessage = {
  EmailNotValid: 'The email is not valid',
} as const;

