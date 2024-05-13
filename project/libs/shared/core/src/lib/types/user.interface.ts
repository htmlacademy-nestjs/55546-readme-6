export interface User {
  id?: string;
  email: string;
  name: string;
  avatarId?: string;
  registrationDate: Date;
  subscribers: string[];
}
