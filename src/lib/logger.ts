export function logError(message: string, ...args: unknown[]): void {
  if (typeof window === "undefined") {
    // Server-side: always log for observability
    console.error(message, ...args);
  } else if (process.env.NODE_ENV !== "production") {
    // Client-side: only in development to prevent internal info leakage
    console.error(message, ...args);
  }
}
