import { ConfigType, registerAs } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { RabbitConfiguration } from './rabbit/rabbit.env';
import { DEFAULT_RABBIT_PORT } from './rabbit/rabbit.const';

export interface RabbitConfig {
  host: string;
  password: string;
  user: string;
  queue: string;
  exchange: string;
  port: number;
}

async function getConfig(): Promise<RabbitConfiguration> {
  console.log('env', process.env);
  const config = plainToClass(RabbitConfiguration, {
    host: process.env.RABBIT_HOST,
    password: process.env.RABBIT_PASSWORD,
    port: parseInt(process.env.RABBIT_PORT ?? DEFAULT_RABBIT_PORT.toString(), 10),
    user: process.env.RABBIT_USER,
    queue: process.env.RABBIT_QUEUE,
    exchange: process.env.RABBIT_EXCHANGE,
  });

  await config.validate();

  return config;
}

export default registerAs('rabbit', async (): Promise<ConfigType<typeof getConfig>> => {
  console.log('getConfig')
  return getConfig();
});
