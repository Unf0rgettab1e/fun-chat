export function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(`${value} is not defined`);
  }
}

export function isNotNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}

export function assertIsInstance<T>(
  value: unknown,
  constructorT: { new (): T }
): asserts value is InstanceType<typeof constructorT> {
  if (!(value instanceof constructorT)) {
    throw new Error(`${value} is not instance of ${constructorT}`);
  }
}
