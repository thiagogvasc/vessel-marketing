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
  IconButton,
} from '@mui/material';
import { Logout } from '@mui/icons-material'
import Link from 'next/link';
import { User } from '../types';
import { usePathname } from 'next/navigation';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import theme from '../theme';

const StyledListItemButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ListItemButtonProps & { active: number; href: string }>(({ theme, active }) => ({
  backgroundColor: active ? ((theme.palette.primary as any)[50]) : 'inherit',
  
  '&:hover, .MuiListItemText-root > .MuiTypography-root':{
    color: active ? theme.palette.primary.main : 'rgb(75 85 99)',
  },

  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : 'rgb(75 85 99)',
  },
  
  '&:hover': {
    backgroundColor: active && ((theme.palette.primary as any)[50]),
    
    '.MuiListItemText-root > .MuiTypography-root': {
      color: theme.palette.primary.main
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main
    },
  },
}));

const MyDrawer = ({ drawerWidth, open, toggleDrawer, links, user, handleLogout }: { drawerWidth: number, open: boolean, toggleDrawer: () => void, links: {text: string, href: string, iconComponent: any, disabled: boolean}[], user: User, handleLogout: any}) => {
  const pathname = usePathname();
  const isLinkActive = (href: string) => pathname === href ? 1 : 0;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidth : `calc(${theme.spacing(8)} + 1px)`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
      open={open}
    >
      <Toolbar>
        {open && (
          <Typography variant="h6" noWrap component="div">
            Vessel Marketing
          </Typography>
        )}
        { open && 
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        }
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <List sx={{ p: 2 }}>
          {links.map((link) => (
            <StyledListItemButton
              sx={{borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              key={link.text}
              LinkComponent={Link}
              active={isLinkActive(link.href)}
              href={link.href}
              disabled={link.disabled}
            >
              <ListItemIcon sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(link.iconComponent)}
              </ListItemIcon>
              {open && <ListItemText primary={link.text} />}
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
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
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
