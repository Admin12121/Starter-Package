import { useState } from 'react';

type ErrorType = 'TOKEN_EXPIRED' | 'NO_INTERNET' | 'SERVER_ERROR' | 'UNKNOWN_ERROR' | 'DOMAIN_ERROR';

export const useErrorHandler = () => {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorType: ErrorType) => {
    let message = '';

    switch (errorType) {
      case 'TOKEN_EXPIRED':
        message = 'Your session has expired. Please log in again.';
        break;
      case 'NO_INTERNET':
        message = 'No internet connection. Please check your network.';
        break;
      case 'SERVER_ERROR':
        message = 'Server is not responding. Please try again later.';
        break;
      case 'DOMAIN_ERROR':
        message = 'Domain mismatch.';
        break;
      default:
        message = 'An unknown error occurred.';
    }

    setError(message);
  };

  const clearError = () => setError(null);

  return { error, handleError, clearError };
};