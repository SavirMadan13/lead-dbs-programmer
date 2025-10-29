/**
 * Global Error Handler
 * 
 * This module sets up global error handling for the renderer process.
 * It catches unhandled errors and promise rejections and provides
 * appropriate error handling and user feedback.
 */

import { ErrorHandler, ErrorSeverity } from './ErrorHandler';

/**
 * Global error handler instance
 */
const errorHandler = ErrorHandler.getInstance();

/**
 * Set up global error handling for the renderer process
 */
export function setupGlobalErrorHandling(): void {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message);
    const context = {
      component: 'GlobalErrorHandler',
      action: 'window.error',
      additionalData: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }
    };

    errorHandler.handleError(error, context, ErrorSeverity.HIGH);
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const context = {
      component: 'GlobalErrorHandler',
      action: 'unhandledrejection',
      additionalData: {
        reason: event.reason
      }
    };

    errorHandler.handlePromiseRejection(event.reason, context, ErrorSeverity.MEDIUM);
  });

  // Handle React error boundaries (if any)
  window.addEventListener('react-error', (event: any) => {
    const error = event.detail?.error || new Error('React error');
    const context = {
      component: 'GlobalErrorHandler',
      action: 'react-error',
      additionalData: event.detail
    };

    errorHandler.handleError(error, context, ErrorSeverity.HIGH);
  });

  console.log('Global error handling initialized');
}

/**
 * Enhanced error handling for async operations
 */
export function withErrorHandling<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  context?: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      const errorContext = {
        component: context || 'Unknown',
        action: fn.name || 'anonymous',
        additionalData: { args }
      };

      errorHandler.handleError(error as Error, errorContext, severity);
      return null;
    }
  };
}

/**
 * Enhanced error handling for sync operations
 */
export function withErrorHandlingSync<T extends any[], R>(
  fn: (...args: T) => R,
  context?: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
) {
  return (...args: T): R | null => {
    try {
      return fn(...args);
    } catch (error) {
      const errorContext = {
        component: context || 'Unknown',
        action: fn.name || 'anonymous',
        additionalData: { args }
      };

      errorHandler.handleError(error as Error, errorContext, severity);
      return null;
    }
  };
}

/**
 * Error boundary for specific components
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary
        fallback={fallback ? (errorInfo) => {
          const FallbackComponent = fallback;
          return (
            <FallbackComponent
              error={errorInfo.originalError || new Error('Unknown error')}
              retry={() => window.location.reload()}
            />
          );
        } : undefined}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

/**
 * Initialize error handling on app start
 */
export function initializeErrorHandling(): void {
  setupGlobalErrorHandling();
  
  // Set up IPC error handling
  if (window.electron?.ipcRenderer) {
    // Handle IPC errors
    window.electron.ipcRenderer.on('ipc-error', (error: any) => {
      const context = {
        component: 'IPC',
        action: 'ipc-error',
        additionalData: error
      };

      errorHandler.handleError(
        new Error(error.message || 'IPC error'),
        context,
        ErrorSeverity.MEDIUM
      );
    });
  }

  console.log('Error handling system initialized');
}