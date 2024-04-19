import { plainToClass } from "class-transformer";
import { ConfigType, registerAs } from "@nestjs/config";
import { JWTConfiguration } from "./jwt/jwt.env";

export interface MongoConfig {
  host: string;
  name: string;
  port: number;
  externalPort: number;
  user: string;
  password: string;
  authBase: string;
}

export interface JWTConfig {
  accessTokenSecret: string;
  accessTokenExpiresIn: string;
}

async function getJwtConfig(): Promise<JWTConfiguration> {
  const config = plainToClass(JWTConfiguration, {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
  });

  await config.validate();

  return config;
}

export default registerAs('jwt', async (): Promise<ConfigType<typeof getJwtConfig>> => {
  return getJwtConfig();
});
