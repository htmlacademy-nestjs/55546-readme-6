import { ConfigType, registerAs } from '@nestjs/config';
import { DefaultPort, ENVIRONMENTS } from './notify.const';
import { NotifyConfiguration } from './notify.env';
import { plainToClass } from 'class-transformer';
import { RADIX_DECIMAIL } from '@project/shared/core';

type Environment = typeof ENVIRONMENTS[number];

async function getConfig(): Promise<NotifyConfiguration> {
  const config = plainToClass(NotifyConfiguration, {
    environment: process.env.NODE_ENV as Environment,
    port: parseInt(process.env.PORT || `${DefaultPort.Notify}`, RADIX_DECIMAIL),
    db: {
      host: process.env.MONGO_HOST,
      port: parseInt(process.env.MONGO_PORT ?? DefaultPort.Mongo.toString(), RADIX_DECIMAIL),
      name: process.env.MONGO_DB,
      user: process.env.MONGO_USER,
      password: process.env.MONGO_PASSWORD,
      authBase: process.env.MONGO_AUTH_BASE,
    },
    rabbit: {
      host: process.env.RABBIT_HOST,
      password: process.env.RABBIT_PASSWORD,
      port: parseInt(process.env.RABBIT_PORT ?? DefaultPort.Rabbit.toString(), RADIX_DECIMAIL),
      user: process.env.RABBIT_USER,
      queue: process.env.RABBIT_QUEUE,
      exchange: process.env.RABBIT_EXCHANGE,
    },
    mail: {
      host: process.env.MAIL_SMTP_HOST,
      port: parseInt(process.env.MAIL_SMTP_PORT ?? DefaultPort.Smtp.toString(), RADIX_DECIMAIL),
      user: process.env.MAIL_USER_NAME,
      password: process.env.MAIL_USER_PASSWORD,
      from: process.env.MAIL_FROM,
    }
  });

  await config.validate();

  return config;
}

export default registerAs('notify', async (): Promise<ConfigType<typeof getConfig>> => {
  return getConfig();
});
