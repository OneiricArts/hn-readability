import React from 'react';
import { Button } from 'reactstrap';

export const FloatingButton: React.FunctionComponent<{
  onClick?: (event: React.MouseEvent<any, MouseEvent>) => void;
  className?: string;
}> = ({ children, onClick, className }) => (
  <Button
    size="lg"
    color="primary"
    className={`hnr-floating-button d-inline-flex align-items-center justify-content-center ${className}`}
    onClick={onClick}
  >
    {children}
  </Button>
);
