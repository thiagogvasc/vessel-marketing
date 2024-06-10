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
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import React from "react";
import { useParams } from "next/navigation";

const statusSteps = ['Pending', 'In Progress', 'Completed'];

export default function RequestStatus() {
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
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      {isLoading ? (
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
                    <Typography component="h2" variant="h4" sx={{ fontWeight: 'bold' }}>
                      Request Status
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<InfoIcon />}
                      component={Link}
                      href={`/requests/${request.id}`}
                    >
                      View Details
                    </Button>
                  </Grid>
                </Grid>
              </Grow>
              <Box sx={{ p: 3, background: '#f5f5f5', borderRadius: 2 }}>
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
                <Box sx={{ mt: 3 }}>
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
            </Box>
          </Fade>
        )
      )}
    </Container>
  );
}
