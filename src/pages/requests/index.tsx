import { useEffect, useState } from "react";
import useGetRequests from "@/src/hooks/useGetRequests";
import Link from "next/link";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Grow,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Requests = () => {
  const { data: requests, isLoading } = useGetRequests();
  const [showRequests, setShowRequests] = useState(false);

  useEffect(() => {
    if (!isLoading && requests) {
      setShowRequests(true);
    }
  }, [isLoading, requests]);

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={2} justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography component="h1" variant="h4">
                Requests
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                component={Link}
                href="/requests/new"
              >
                New Request
              </Button>
            </Grid>
          </Grid>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ mt: 3 }}>
              {requests?.map((request) => (
                <Grow
                  in={showRequests}
                  style={{ transformOrigin: '0 0 0' }}
                  {...(showRequests ? { timeout: 1000 } : {})}
                  key={request.id}
                >
                  <ListItem sx={{ mb: 2 }} divider>
                    <Paper elevation={1} sx={{ p: 2, width: '100%' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                          <ListItemText
                            primary={<Typography variant="h6">{request.title}</Typography>}
                            secondary={
                              <>
                                <Typography component="span" variant="body2">
                                  Description: {request.description}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Status: {request.status}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Priority: {request.priority}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Created At: {request?.created_at?.toString()}
                                </Typography>
                                <br />
                                <Typography component="span" variant="body2">
                                  Updated At: {request?.updated_at?.toString()}
                                </Typography>
                              </>
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                          <Button variant="outlined" component={Link} href={`/requests/${request.id}`}>
                            View
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </ListItem>
                </Grow>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Requests;
