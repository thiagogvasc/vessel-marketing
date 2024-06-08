import { useGetRequestById } from "@/src/hooks/useRequests";
import Link from "next/link";
import { useRouter } from "next/router";
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import React from "react";
import { useGetCurrentUser, useGetUserById } from "@/src/hooks/useUsers";

export default function RequestDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data: request, isLoading } = useGetRequestById(id as string | null | undefined);
  console.warn(request)
  const { data: user, isLoading: isUserLoading } = useGetUserById(request?.client_id);
  console.warn(user)


  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      {isLoading || isUserLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        request && (
          <Fade in timeout={500}>
            <Box sx={{ borderRadius: 3, p: 0 }}>
              <Grow in timeout={1000}>
                <Grid container spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Grid item>
                    <Button
                      variant="outlined"
                      startIcon={<ArrowBackIcon />}
                      onClick={() => router.back()}
                    >
                      Back
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      component={Link}
                      href={`/requests/${request.id}/edit`}
                    >
                      Edit Request
                    </Button>
                  </Grid>
                </Grid>
              </Grow>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
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
                    <strong>Created At:</strong> {request?.created_at && new Date(request.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Updated At:</strong> {request?.updated_at && new Date(request.updated_at).toLocaleString()}
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
                                primary={new Date(update?.update_date?.toDate()).toLocaleString()}
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
