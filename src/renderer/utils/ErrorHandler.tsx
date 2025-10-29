/**
 * Error Handler Utility
 * 
 * This module provides comprehensive error handling utilities for the renderer process.
 * It includes error boundary components, error logging, and user-friendly error messages.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Snackbar, Button, Box, Typography, Collapse } from '@mui/material';
import { ErrorOutline, Refresh, BugReport } from '@mui/icons-material';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

/**
 * Error context interface
 */
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
}

/**
 * Error information interface
 */
export interface ErrorInfo {
  message: string;
  severity: ErrorSeverity;
  context?: ErrorContext;
  originalError?: Error;
  userMessage?: string;
  canRetry?: boolean;
  retryAction?: () => void;
}

/**
 * Error Handler Class
 * 
 * Provides centralized error handling and logging for the renderer process.
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];
  private maxLogSize = 100;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle an error with context
   */
  public handleError(
    error: Error,
    context?: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): ErrorInfo {
    const errorInfo: ErrorInfo = {
      message: error.message,
      severity,
      context: {
        ...context,
        timestamp: new Date().toISOString()
      },
      originalError: error,
      userMessage: this.getUserFriendlyMessage(error, severity),
      canRetry: this.canRetry(error),
      retryAction: this.getRetryAction(error, context)
    };

    // Log the error
    this.logError(errorInfo);

    // Show user notification if needed
    this.showUserNotification(errorInfo);

    return errorInfo;
  }

  /**
   * Handle a promise rejection
   */
  public handlePromiseRejection(
    reason: any,
    context?: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): ErrorInfo {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    return this.handleError(error, context, severity);
  }

  /**
   * Log an error
   */
  private logError(errorInfo: ErrorInfo): void {
    // Add to in-memory log
    this.errorLog.unshift(errorInfo);
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }

    // Log to console
    console.error('Error Handler:', errorInfo);

    // Send to main process for file logging
    try {
      window.electron.ipcRenderer.sendMessage('log-error', {
        message: errorInfo.message,
        severity: errorInfo.severity,
        context: errorInfo.context,
        stack: errorInfo.originalError?.stack
      });
    } catch (ipcError) {
      console.error('Failed to send error to main process:', ipcError);
    }
  }

  /**
   * Show user notification
   */
  private showUserNotification(errorInfo: ErrorInfo): void {
    // Only show notifications for medium and high severity errors
    if (errorInfo.severity === ErrorSeverity.LOW) {
      return;
    }

    // This would typically trigger a notification system
    // For now, we'll just log it
    console.warn('User notification:', errorInfo.userMessage);
  }

  /**
   * Get user-friendly error message
   */
  private getUserFriendlyMessage(error: Error, severity: ErrorSeverity): string {
    const baseMessage = error.message;

    switch (severity) {
      case ErrorSeverity.LOW:
        return `A minor issue occurred: ${baseMessage}`;
      case ErrorSeverity.MEDIUM:
        return `An error occurred: ${baseMessage}`;
      case ErrorSeverity.HIGH:
        return `A serious error occurred: ${baseMessage}`;
      case ErrorSeverity.CRITICAL:
        return `A critical error occurred: ${baseMessage}`;
      default:
        return baseMessage;
    }
  }

  /**
   * Check if an error can be retried
   */
  private canRetry(error: Error): boolean {
    // Network errors, file system errors, etc. can typically be retried
    const retryableErrors = [
      'NetworkError',
      'TimeoutError',
      'FileSystemError',
      'ConnectionError'
    ];

    return retryableErrors.some(errorType => 
      error.name.includes(errorType) || error.message.includes(errorType)
    );
  }

  /**
   * Get retry action for an error
   */
  private getRetryAction(error: Error, context?: ErrorContext): (() => void) | undefined {
    if (!this.canRetry(error)) {
      return undefined;
    }

    // Return a generic retry function
    return () => {
      console.log('Retrying action...');
      // This would typically retry the original action
    };
  }

  /**
   * Get error log
   */
  public getErrorLog(): ErrorInfo[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Get error statistics
   */
  public getErrorStatistics(): Record<ErrorSeverity, number> {
    const stats: Record<ErrorSeverity, number> = {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 0,
      [ErrorSeverity.HIGH]: 0,
      [ErrorSeverity.CRITICAL]: 0
    };

    this.errorLog.forEach(error => {
      stats[error.severity]++;
    });

    return stats;
  }
}

/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: ErrorHandler;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.errorHandler = ErrorHandler.getInstance();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorContext: ErrorContext = {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        componentStack: errorInfo.componentStack
      }
    };

    const handledError = this.errorHandler.handleError(
      error,
      errorContext,
      ErrorSeverity.HIGH
    );

    this.setState({ errorInfo: handledError });

    if (this.props.onError) {
      this.props.onError(error, handledError);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component
 * 
 * Displays a user-friendly error message with retry options.
 */
interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  onRetry?: () => void;
}

export function ErrorFallback({ error, errorInfo, onRetry }: ErrorFallbackProps): JSX.Element {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 4,
        textAlign: 'center'
      }}
    >
      <ErrorOutline sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h5" gutterBottom>
        Something went wrong
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {errorInfo?.userMessage || 'An unexpected error occurred'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {onRetry && (
          <Button
            variant="contained"
            startIcon={<Refresh />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
        
        <Button
          variant="outlined"
          startIcon={<BugReport />}
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </Button>
      </Box>

      <Collapse in={showDetails}>
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'grey.100',
            borderRadius: 1,
            textAlign: 'left',
            maxWidth: '600px',
            width: '100%'
          }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Error Details:
          </Typography>
          <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            {error?.message}
          </Typography>
          
          {error?.stack && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }} gutterBottom>
                Stack Trace:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {error.stack}
              </Typography>
            </>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Error Notification Component
 * 
 * Displays error notifications to the user.
 */
interface ErrorNotificationProps {
  error: ErrorInfo;
  onClose: () => void;
  autoHideDuration?: number;
}

export function ErrorNotification({ 
  error, 
  onClose, 
  autoHideDuration = 6000 
}: ErrorNotificationProps): JSX.Element {
  const severity = error.severity === ErrorSeverity.CRITICAL ? 'error' : 
                   error.severity === ErrorSeverity.HIGH ? 'error' : 'warning';

  return (
    <Snackbar
      open={true}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        action={
          error.canRetry && error.retryAction ? (
            <Button color="inherit" size="small" onClick={error.retryAction}>
              Retry
            </Button>
          ) : undefined
        }
      >
        {error.userMessage}
      </Alert>
    </Snackbar>
  );
}

/**
 * Hook for error handling
 */
export function useErrorHandler() {
  const errorHandler = ErrorHandler.getInstance();

  const handleError = React.useCallback((
    error: Error,
    context?: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ) => {
    return errorHandler.handleError(error, context, severity);
  }, [errorHandler]);

  const handlePromiseRejection = React.useCallback((
    reason: any,
    context?: ErrorContext,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ) => {
    return errorHandler.handlePromiseRejection(reason, context, severity);
  }, [errorHandler]);

  return {
    handleError,
    handlePromiseRejection,
    getErrorLog: errorHandler.getErrorLog.bind(errorHandler),
    clearErrorLog: errorHandler.clearErrorLog.bind(errorHandler),
    getErrorStatistics: errorHandler.getErrorStatistics.bind(errorHandler)
  };
}