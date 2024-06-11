'use client'

import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { Logout } from '@mui/icons-material'
import Link from 'next/link';
import { User } from '../types';

const MyDrawer = ({ drawerWidth, links, user, handleLogout }: { drawerWidth: number, links: {text: string, href: string, iconComponent: any, disabled: boolean}[], user: User, handleLogout: any}) => {
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
        <List>
          {links.map((link) => (
            <ListItemButton
              key={link.text}
              LinkComponent={Link}
              href={link.href}
              disabled={link.disabled}
            >
              <ListItemIcon>
                {React.createElement(link.iconComponent)}
              </ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
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
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      icon: PropTypes.elementType.isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  user: PropTypes.object,
  handleLogout: PropTypes.func,
};

MyDrawer.defaultProps = {
  user: null,
  handleLogout: () => {},
};

export default MyDrawer;
