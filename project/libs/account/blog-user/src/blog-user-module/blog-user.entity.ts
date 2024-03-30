import { AuthUser, Entity, StorableEntity } from '@project/shared/core';

export class BlogUserEntity extends Entity implements StorableEntity<AuthUser> {
  email: string;
  name: string;
  avatar?: string;
  registrationDate: Date;
  passwordHash: string;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }

  populate(user: AuthUser) {
    if (!user) {
      return;
    }

    this.id = this.id ?? '';
    this.email = user.email;
    this.name = user.name;
    this.avatar = user.avatar ?? '';
    this.registrationDate = user.registrationDate || new Date();
    this.passwordHash = user.passwordHash;
  }

  toPOJO(): AuthUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      registrationDate: this.registrationDate,
      passwordHash: this.passwordHash
    }
  }
}
