import { plainToClass } from "class-transformer";
import { DEFAULT_PORT, EnvironmentType } from "./app/app.const";
import AppConfig from "./app/app.env";
import { ConfigType, registerAs } from "@nestjs/config";

export interface ApplicationConfig {
  environment: EnvironmentType;
  port: number;
}

async function getConfig(): Promise<ApplicationConfig> {
  const config = plainToClass(AppConfig, {
    environment: process.env.NODE_ENV,
    port: process.env.MONGO_PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
  });

  await config.validate();

  return config;
}

export default registerAs('account-app', async (): Promise<ConfigType<typeof getConfig>> => {
  return getConfig();
});
