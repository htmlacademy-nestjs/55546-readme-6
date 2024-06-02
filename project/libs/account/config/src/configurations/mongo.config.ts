import { plainToClass } from "class-transformer";
import { MongoConfiguration } from "./mongodb/mongo.env";
import { DEFAULT_MONGO_PORT } from "./mongodb/mongo.const";
import { ConfigType, registerAs } from "@nestjs/config";
import { RADIX_DECIMAIL } from "@project/shared/core";

async function getDbConfig(): Promise<MongoConfiguration> {

  const config = plainToClass(MongoConfiguration, {
    host: process.env.MONGO_HOST,
    name: process.env.MONGO_DB,
    port: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT, RADIX_DECIMAIL) : DEFAULT_MONGO_PORT,
    externalPort: process.env.MONGO_EXTERNAL_PORT ? parseInt(process.env.MONGO_EXTERNAL_PORT, RADIX_DECIMAIL) : DEFAULT_MONGO_PORT,
    user: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWORD,
    authBase: process.env.MONGO_AUTH_BASE
  });

  await config.validate();

  return config;
}

export default registerAs('db', async (): Promise<ConfigType<typeof getDbConfig>> => {
  return getDbConfig();
});
