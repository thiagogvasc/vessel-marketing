import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { useRouter } from 'next/navigation';

interface NextMuiButtonProps extends ButtonProps {
  href: string;
}

const NextMuiButton: React.FC<NextMuiButtonProps> = ({ href, children, ...props }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <Button {...props} onClick={handleClick}>
      {children}
    </Button>
  );
};

export default NextMuiButton;
