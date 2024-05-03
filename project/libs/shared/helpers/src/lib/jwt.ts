import { User, TokenPayload } from '@project/shared/core';

export function createJWTPayload(user: User): TokenPayload {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}
