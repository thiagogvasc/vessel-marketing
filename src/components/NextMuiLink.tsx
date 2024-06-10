import React from 'react';
import { Link as MuiLink, LinkProps as MuiLinkProps } from '@mui/material';
import { useRouter } from 'next/navigation';

type NextMuiLinkProps = MuiLinkProps & {
  href: string;
};

const NextMuiLink = React.forwardRef<HTMLAnchorElement, NextMuiLinkProps>(({ href, ...muiLinkProps }, ref) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <MuiLink ref={ref} href={href} onClick={handleClick} {...muiLinkProps} />
  );
});

NextMuiLink.displayName = 'NextMuiLink';

export default NextMuiLink;
