import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { RabbitConfiguration } from './rabbit/rabbit.env';
import { DEFAULT_RABBIT_PORT } from './rabbit/rabbit.const';
import { RADIX_DECIMAIL } from '@project/shared/core';

async function getConfig(): Promise<RabbitConfiguration> {

  const config = plainToClass(RabbitConfiguration, {
    host: process.env.API_RABBIT_HOST,
    password: process.env.API_RABBIT_PASSWORD,
    port: parseInt(process.env.API_RABBIT_PORT ?? DEFAULT_RABBIT_PORT.toString(), RADIX_DECIMAIL),
    user: process.env.API_RABBIT_USER,
    queue: process.env.API_RABBIT_QUEUE,
    exchange: process.env.API_RABBIT_EXCHANGE,
  });

  await config.validate();

  return config;
}

export default registerAs('rabbit', async (): Promise<ConfigType<typeof getConfig>> => {
  return getConfig();
});
