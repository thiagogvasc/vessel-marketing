'use client'

import { useGetRequestById } from "@/src/hooks/react-query/request";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Fade,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import React from "react";
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const statusSteps = ['Pending', 'In Progress', 'Completed'];

export default function Request() {
  const router = useRouter();
  const { id } = useParams();

  const { data: request, isLoading } = useGetRequestById(id as string);

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
                  <Typography component="h1" variant="h5" sx={{ fontWeight: 'bold' }} noWrap>
                    Request Details
                  </Typography>
                </Grid>
                <Grid item>
                  <Breadcrumbs aria-label="breadcrumb" separator={<NavigateNextIcon fontSize="small" />} sx={{ whiteSpace: 'nowrap' }}>
                    <MuiLink
                      color="inherit"
                      href="/"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/');
                      }}
                      noWrap
                    >
                      <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                      Home
                    </MuiLink>
                    <MuiLink
                      color="inherit"
                      href="/client/requests"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push('/client/requests');
                      }}
                      noWrap
                    >
                      Requests
                    </MuiLink>
                    <Typography color="textPrimary" noWrap>Request Details</Typography>
                  </Breadcrumbs>
                </Grid>
              </Grid>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Current Status
                </Typography>
                <Stepper activeStep={getStatusStep(request.status)} alternativeLabel>
                  {statusSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Paper>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Update History
                </Typography>
                <List>
                  {/* {request.updates && request.updates.length > 0 ? (
                    request.updates.map((update, index) => (
                      <React.Fragment key={index}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={update.updated_at ? new Date(update.updated_at.toDate()).toLocaleString() : 'No date available'}
                            secondary={
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {update.update_description || 'No description available'}
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
                  )} */}
                </List>
              </Paper>
            </Box>
          </Fade>
        )
      )}
    </Container>
  );
}
