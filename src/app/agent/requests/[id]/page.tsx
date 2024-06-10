'use client'

import { useGetRequestById } from "@/src/hooks/useRequests";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Grid,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
  Breadcrumbs,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { RequestStatus } from '@/src/types';
import React from 'react';
import { useGetUserById } from '@/src/hooks/useUsers';
import NextMuiLink from "@/src/components/NextMuiLink";
import NextMuiButton from "@/src/components/NextMuiButton";
import { Home, NavigateNext } from "@mui/icons-material";

const statusSteps = ['Pending', 'In Progress', 'Completed'];

export default function RequestDetails() {
  const router = useRouter();
  const { id } = useParams();


  const { data: request, isLoading } = useGetRequestById(id as string);
  const { data: requestorData } = useGetUserById(request?.client_id);
  // const updateRequestStatusMutation = useUpdateRequestStatus();

  const handleStatusChange = (newStatus: RequestStatus) => {
    // updateRequestStatusMutation.mutate({
    //   id: id as string,
    //   status: newStatus,
    // });
  };

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'in_progress':
        return 1;
      case 'completed':
        return 2;
      default:
        return 0;
    }
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
      {isLoading ? (
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
                    <NextMuiLink
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
                    </NextMuiLink>
                    <NextMuiLink
                      color="inherit"
                      href="/agent/requests"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/agent/requests');
                      }}
                      noWrap
                    >
                      Requests
                    </NextMuiLink>
                    <Typography color="textPrimary" noWrap>Request Details</Typography>
                  </Breadcrumbs>
                </Grid>
              </Grid>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                <strong>Title:</strong> {request.title}
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1"><strong>Requester:</strong> {requestorData?.fullname}</Typography>
                  <Typography variant="body1"><strong>Email:</strong> {requestorData?.email}</Typography>
                  <Typography variant="body1"><strong>Status:</strong> {request.status}</Typography>
                  <Typography variant="body1"><strong>Priority:</strong> {request.priority}</Typography>
                  <Typography variant="body1"><strong>Created At:</strong> {request.created_at?.toDate().toLocaleString()}</Typography>
                  <Typography variant="body1"><strong>Updated At:</strong> {request.updated_at?.toDate().toLocaleString()}</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1">{request.description}</Typography>
                </Box>
                <Typography variant="h6" gutterBottom>
                  Status Progress
                </Typography>
                <Stepper activeStep={getStatusStep(request.status)} alternativeLabel sx={{ mb: 3 }}>
                  {statusSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
                <NextMuiButton
                  variant="contained"
                  startIcon={<EditIcon />}
                  href={`/agent/requests/${request.id}/edit-request`}
                  sx={{ mb: 3 }}
                >
                  Edit Request
                </NextMuiButton>
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
                <Typography variant="h6" gutterBottom>
                  Attachments
                </Typography>
                <Button variant="contained" component="label">
                  Upload File
                  <input type="file" hidden />
                </Button>
                {/* Display the list of uploaded files here */}
              </Paper>
            </Box>
          </Fade>
        )
      )}
    </Container>
  );
}
