'use client'

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  styled,
  Toolbar,
  Typography,
} from '@mui/material';
import { Logout } from '@mui/icons-material'
import Link from 'next/link';
import { User } from '../types';
import { usePathname } from 'next/navigation';
import { inherits } from 'util';

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ListItemButtonProps & { active: number; href: string }>(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : 'inherit',
  backgroundColor: active ? ((theme.palette.primary as any)[50]) : 'inherit',
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : 'inherit',
  },
  '&:hover': {
    backgroundColor: active && ((theme.palette.primary as any)[50])
  },
}));


const MyDrawer = ({ drawerWidth, links, user, handleLogout }: { drawerWidth: number, links: {text: string, href: string, iconComponent: any, disabled: boolean}[], user: User, handleLogout: any}) => {
  const pathname = usePathname();
  const isLinkActive = (href: string) => pathname === href ? 1 : 0;
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', bgcolor: 'white' },
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Vessel Marketing
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{px: 2, gap: 2}}>
          {links.map((link) => (
            <StyledListItemButton
            sx={{py: 0.5, my:1, borderRadius: 2}}
              key={link.text}
              LinkComponent={Link}
              active={isLinkActive(link.href)}
              href={link.href}
              disabled={link.disabled}
            >
              <ListItemIcon>
                {React.createElement(link.iconComponent)}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </StyledListItemButton>
          ))}
        </List>
        <Divider />
        {user && (
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        )}
      </Box>
    </Drawer>
  );
};

MyDrawer.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      iconComponent: PropTypes.elementType.isRequired,
      disabled: PropTypes.bool,
    }).isRequired,
  ).isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func,
}

export default MyDrawer;
