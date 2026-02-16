export function logError(message: string, ...args: unknown[]): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(message, ...args);
  }
}
