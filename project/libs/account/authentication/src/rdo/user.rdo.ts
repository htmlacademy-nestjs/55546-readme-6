import { Expose } from 'class-transformer';

export class LoggedUserRdo {
  @Expose()
  public id: string;

  @Expose()
  public avatar: string;

  @Expose()
  public email: string;

  @Expose()
  public registrationDate: string;
}
