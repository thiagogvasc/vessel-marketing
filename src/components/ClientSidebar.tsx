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
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Tooltip,
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Assignment, Dashboard, EventNote, Group, MeetingRoom, ViewKanban } from '@mui/icons-material';
import MyDrawer from './MyDrawer';
import { useGetCurrentUser } from '../hooks/useUsers';
import { User } from '../types';
import theme from '../theme';
import Image from 'next/image';

const drawerWidth = 240;

const AgentSidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(true); // State to control drawer open/close

  const { data: userData } = useGetCurrentUser();

  const links = [
    { text: 'Dashboard', iconComponent: Dashboard, disabled: false, href: '/client/dashboard'},
    { text: 'Requests', iconComponent: ListAltIcon, disabled: false, href: '/client/requests'},
    { text: 'Meetings', iconComponent: MeetingRoom, disabled: true, href: '/client/meetings'},
    { text: 'Planning', iconComponent: EventNote, disabled: true, href: '/client/planning'},
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

  const toggleDrawer = () => {
    setOpen(!open);
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
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? drawerWidth + 'px' : theme.spacing(9)})`,
          ml: `${open ? drawerWidth + 'px' : theme.spacing(9)}`,
          background: '#fcfbfe',
          color: 'black',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
        elevation={0}
      >
        <Toolbar sx={{ position: 'relative'}}>
          <Box sx={{ backgroundColor: 'white', position: 'absolute', top: '50%', left: -19, zIndex: 1000, transform: 'translate(0, -50%)'}}>
            <IconButton size='small' onClick={toggleDrawer} sx={{  ":hover": {backgroundColor: 'rgba(0, 0, 0, 0.04)'}, backgroundColor: 'white', border: '1px solid rgb(239, 241, 245)'}}>
              {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </Box>

          {!open && (
            <>
              <Image alt="vessel marketing" src='/logovessel.png' width={50} height={50} />
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Vessel Marketing
              </Typography>
            </>
          )}
          
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
      
      {userData && 
        <MyDrawer
          drawerWidth={drawerWidth}
          open={open}
          toggleDrawer={toggleDrawer}
          links={links}
          handleLogout={handleLogout}
          user={userData}
        />
      }

      {renderMenu}
    </>
  );
};

export default AgentSidebar;
