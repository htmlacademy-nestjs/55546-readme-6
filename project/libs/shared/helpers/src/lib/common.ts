
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
