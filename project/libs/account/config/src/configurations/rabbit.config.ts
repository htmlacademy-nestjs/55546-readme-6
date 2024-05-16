import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { RabbitConfiguration } from './rabbit/rabbit.env';
import { DEFAULT_RABBIT_PORT } from './rabbit/rabbit.const';
import { RADIX_DECIMAIL } from '@project/shared/core';

async function getConfig(): Promise<RabbitConfiguration> {
  const config = plainToClass(RabbitConfiguration, {
    host: process.env.RABBIT_HOST,
    password: process.env.RABBIT_PASSWORD,
    port: parseInt(process.env.RABBIT_PORT ?? DEFAULT_RABBIT_PORT.toString(), RADIX_DECIMAIL),
    user: process.env.RABBIT_USER,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  });

  await config.validate();

  return config;
}

export default registerAs('rabbit', async (): Promise<ConfigType<typeof getConfig>> => {
  return getConfig();
});
