export interface AppError {
  message: string;
  code?: string;
  details?: any;
  timestamp: number;
}

class ErrorHandler {
  private errors: AppError[] = [];

  logError(error: Error | string, context?: string, details?: any): void {
    const appError: AppError = {
      message: typeof error === "string" ? error : error.message,
      code: context,
      details,
      timestamp: Date.now(),
    };

    this.errors.push(appError);

    if (import.meta.env.DEV) {
      console.error(`[${context || "App"}]`, error, details);
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry.captureException(error, { extra: { context, details } });
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  getLastError(): AppError | null {
    return this.errors.length > 0 ? this.errors[this.errors.length - 1] : null;
  }
}

export const errorHandler = new ErrorHandler();

// Wrapper function to handle async operations with error logging
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await asyncFn();
  } catch (error) {
    errorHandler.logError(error as Error, context);
    return fallback;
  }
};
