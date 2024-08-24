'use client'

import { useEffect, useState } from 'react';
import { useGetRequestById, useUpdateRequest } from "@/src/hooks/react-query/request";
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
  TextField,
  Select,
  MenuItem,
  Breadcrumbs,
} from '@mui/material';
import MuiLink from '@mui/material/Link'

import { Home, NavigateNext } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { RequestStatus, RequestPriority } from '@/src/types';

export default function EditRequest() {
  const router = useRouter();
  const { id } = useParams();

  const { data: request, isLoading } = useGetRequestById(id as string);
  const updateRequestMutation = useUpdateRequest();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<RequestStatus>('Pending');
  const [priority, setPriority] = useState<RequestPriority | undefined>(undefined);

  useEffect(() => {
    if (request) {
      setTitle(request.title);
      setDescription(request.description);
      setStatus(request.status);
      setPriority(request?.priority);
    }
  }, [request]);

  const handleSaveChanges = () => {
    updateRequestMutation.mutate({
      id: id as string,
      updates: { title, description, status, priority },
    }, {
      onSuccess: () => {
        router.push(`/agent/requests/${id}`);
      }
    });
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
              <Box sx={{ mt: 3 }}>
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
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  disabled
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  disabled
                  rows={4}
                  margin="normal"
                />
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong>
                  </Typography>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as RequestStatus)}
                    displayEmpty
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in_progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Priority:</strong>
                  </Typography>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as RequestPriority)}
                    displayEmpty
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </Box>
            </Paper>
              </Box>
          </Fade>
        )
      )}
    </Container>
  );
}
