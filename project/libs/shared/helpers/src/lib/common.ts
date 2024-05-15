import { UnprocessableEntityException } from '@nestjs/common';
import { RADIX_DECIMAIL } from '@project/shared/core';
import { ClassTransformOptions, plainToInstance } from 'class-transformer';

const TIME_COUNT_ERROR_MESSAGE = "[parseTime] Can't parse value count. Result is NaN.";

type PlainObject = Record<string, unknown>;

export type DateTimeUnit = 's' | 'h' | 'd' | 'm' | 'y';
export type TimeAndUnit = { value: number; unit: DateTimeUnit };

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

export function getMongoConnectionString({ username, password, host, port, databaseName, authDatabase }): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

export function getRabbitMQConnectionString({ user, password, host, port }): string {
  return `amqp://${user}:${password}@${host}:${port}`;
}

export function parseTime(time: string): TimeAndUnit {
  const regex = /^(\d+)([shdmy])/;
  const match = regex.exec(time);

  if (!match) {
    throw new UnprocessableEntityException(`[parseTime] Bad time string: ${time}`);
  }

  const [, valueRaw, unitRaw] = match;
  const value = parseInt(valueRaw, RADIX_DECIMAIL);
  const unit = unitRaw as DateTimeUnit;

  if (isNaN(value)) {
    throw new UnprocessableEntityException(TIME_COUNT_ERROR_MESSAGE);
  }

  return { value, unit }
}
