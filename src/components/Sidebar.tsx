import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  AppBar,
  CssBaseline,
  ListItemButton,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled } from '@mui/system';

const drawerWidth = 240;

const Sidebar = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isActive = (path: string) => {
    return router.pathname === path;
  };

  const getIsActiveStyleProps = (path: string) => {
    if (isActive(path)) {
      return {
        background: ''
      }
    } else {
      return 'adfs'
    }
  }


  return (
    <>
      <CssBaseline />
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
          {/* This empty space is for alignment purposes */}
        </Toolbar>
      </AppBar>
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
            <ListItemButton LinkComponent={Link} href="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItemButton>
            <ListItemButton LinkComponent={Link} href="/requests">
              <ListItemIcon>
                <ListAltIcon />
              </ListItemIcon>
              <ListItemText primary="Requests" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} href="/meetings" disabled>
              <ListItemIcon>
                <MeetingRoomIcon />
              </ListItemIcon>
              <ListItemText primary="Meetings" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} href="/planning" disabled>
              <ListItemIcon>
                <EventNoteIcon />
              </ListItemIcon>
              <ListItemText primary="Planning" />
            </ListItemButton>
            {!user && (
              <>
                <ListItemButton LinkComponent={Link} href="/login">
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton LinkComponent={Link} href="/register">
                  <ListItemIcon>
                    <AppRegistrationIcon />
                  </ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItemButton>
              </>
            )}
          </List>
          <Divider />
          {user && (
            <List>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
