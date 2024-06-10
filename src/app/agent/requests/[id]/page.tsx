'use client'

import { useGetRequestById } from "@/src/hooks/useRequests";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Fade,
  Grow,
  List,
  ListItem,
  ListItemText,
  Divider,
  Breadcrumbs,
} from '@mui/material';
import MuiLink from '@mui/material/Link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import { useGetCurrentUser, useGetUserById } from "@/src/hooks/useUsers";
import { Home, NavigateNext } from "@mui/icons-material";

export default function RequestDetails() {
  const router = useRouter();
  const { id } = useParams();

  const { data: request, isLoading } = useGetRequestById(id as string | null | undefined);
  console.warn(request)
  const { data: user, isLoading: isUserLoading } = useGetUserById(request?.client_id);
  console.warn(user)


  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
      {isLoading || isUserLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        request && (
          <Fade in timeout={500}>
            <Box sx={{ borderRadius: 3, p: 0 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs>
                  <Typography component="h1" variant="h5" noWrap>
                    Edit Request
                  </Typography>
                </Grid>
                <Grid item>
                  <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNext fontSize="small" />} sx={{ whiteSpace: 'nowrap' }}>
                    <MuiLink
                      color="inherit"
                      href="/agent/dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/agent/dashboard');
                      }}
                      noWrap
                    >
                      <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                      Dashboard
                    </MuiLink>
                    <MuiLink
                      color="inherit"
                      href="/agent/requests"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/agent/requests');
                      }}
                      noWrap
                    >
                      Requests
                    </MuiLink>
                    <Typography color="textPrimary" noWrap>Request Details</Typography>
                  </Breadcrumbs>
                </Grid>
              </Grid>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Typography component="h2" variant="h4" sx={{ fontWeight: 'bold' }}>
                  {request.title}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <strong>Description:</strong> {request.description}
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Current Status
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {request.status}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Priority:</strong> {request.priority}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Created At:</strong> {request.created_at?.toDate().toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Updated At:</strong> {request.updated_at?.toDate().toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      User Information
                    </Typography>
                    {user && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body1">
                          <strong>Submitted By:</strong> {user.fullname}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Email:</strong> {user.email}
                        </Typography>
                        <Typography variant="body1">
                          <strong>Phone Number:</strong> {user.phone_number}
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="h6" gutterBottom>
                      Update History
                    </Typography>
                    <List>
                      {request.updates && request.updates.length > 0 ? (
                        request.updates.map((update, index) => (
                          <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                              <ListItemText
                                primary={update.updated_at?.toDate().toLocaleString()}
                                secondary={
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {update.update_description}
                                  </Typography>
                                }
                              />
                            </ListItem>
                            {index < request.updates.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No updates available
                        </Typography>
                      )}
                    </List>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Fade>
        )
      )}
    </Container>
  );
}
