import { ClassTransformOptions, plainToInstance } from 'class-transformer';

type PlainObject = Record<string, unknown>;

export function fillDto<T, V extends PlainObject>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T;

export function fillDto<T, V extends PlainObject[]>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T[];

export function fillDto<T, V extends PlainObject>(
  DtoClass: new () => T,
  plainObject: V,
  options?: ClassTransformOptions,
): T | T[] {
  return plainToInstance(DtoClass, plainObject, {
    excludeExtraneousValues: true,
    ...options,
  });
}

interface ClassValidatorErrorInterface {
  property: string;
  value: string;
  constraints: object;
}

export const handleClassValidatorError = (errors: ClassValidatorErrorInterface[]) => {
  const [firstError] = errors;
  if (firstError) {
    throw new Error(
      firstError.property + ' - ' +
      firstError.value + ': ' + JSON.stringify(firstError.constraints));
  }
}

export function getMongoConnectionString({ username, password, host, port, databaseName, authDatabase }): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

export function getRabbitMQConnectionString({ user, password, host, port }): string {
  return `amqp://${user}:${password}@${host}:${port}`;
}
