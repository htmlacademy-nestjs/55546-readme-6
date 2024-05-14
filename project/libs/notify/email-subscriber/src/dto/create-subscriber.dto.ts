import { IsEmail, IsNotEmpty } from 'class-validator';
import { EmailSubscriberValidateMessage } from '../email-subscriber.constants';

export class CreateSubscriberDto {
  @IsEmail({}, { message: EmailSubscriberValidateMessage.EmailNotValid })
  public email: string;

  @IsNotEmpty({ message: EmailSubscriberValidateMessage.FirstNameIsEmpty })
  public name: string;

  @IsNotEmpty({ message: EmailSubscriberValidateMessage.UserIdIeEmpty })
  public id: string;
}
