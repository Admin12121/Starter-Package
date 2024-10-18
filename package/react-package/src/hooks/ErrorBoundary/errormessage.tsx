import React from 'react';
import Error from '@/pages/empty/error/error';
interface ErrorMessageProps {
  message: string | null;
  children: React.ReactNode;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, children }) => {
  if (!message) return children;

  return (
    <Error>
      <div className="error-message">{message}</div>
    </Error>
  );
};

export default ErrorMessage;