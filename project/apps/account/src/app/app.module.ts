import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';

@Module({
  imports: [AuthenticationModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
