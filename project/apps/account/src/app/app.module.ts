import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { AccountConfigModule } from '@project/account-config';

@Module({
  imports: [AuthenticationModule, AccountConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
