'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ListItemIcon,
  Toolbar,
  Typography,
  Box,
  Divider,
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dashboard } from '@mui/icons-material';
import { useGetCurrentUser } from '../hooks/useUsers';
import MyDrawer from './MyDrawer';

const drawerWidth = 280;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { data: userData } = useGetCurrentUser();

  const links = [
    { text: 'Dashboard', iconComponent: Dashboard, disabled: false, href: '/client/dashboard'},
    { text: 'Requests', iconComponent: ListAltIcon, disabled: false, href: '/client/requests'},
    { text: 'Meetings', iconComponent: MeetingRoomIcon, disabled: true, href: '/client/meetings'},
    { text: 'Planning', iconComponent: EventNoteIcon, disabled: true, href: '/client/planning'},
  ]

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);

  const menuId = 'primary-search-account-menu';

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography variant="subtitle1">{user?.displayName || user?.email}</Typography>
        <Typography variant="body2" color="textSecondary">{user?.email}</Typography>
      </Box>
      <Divider />
      <MenuItem onClick={handleMenuClose} component={Link} href="/profile">
        <ListItemIcon>
          <Avatar />
        </ListItemIcon>
        View profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        Account Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: 'white',
          color: 'black',
        }}
        elevation={0}
      >
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="large" aria-label="show new notifications" color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Tooltip title={user?.displayName || user?.email}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar alt={user?.displayName || user?.email || ''} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {userData && <MyDrawer drawerWidth={drawerWidth} links={links} handleLogout={handleLogout} user={userData} />}
    </>
  );
};

export default Sidebar;
