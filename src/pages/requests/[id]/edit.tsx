import { useEffect, useState } from 'react';
import { useGetRequestById, useUpdateRequest } from "@/src/hooks/useRequests";
import { useRouter } from "next/router";
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { RequestStatus, RequestPriority } from '@/src/types';

export default function EditRequest() {
  const router = useRouter();
  const { id } = router.query;

  const { data: request, isLoading } = useGetRequestById(id as string);
  const updateRequestMutation = useUpdateRequest();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<RequestStatus>('Pending');
  const [priority, setPriority] = useState<RequestPriority>('Medium');

  useEffect(() => {
    if (request) {
      setTitle(request.title);
      setDescription(request.description);
      setStatus(request.status);
      setPriority(request.priority);
    }
  }, [request]);

  const handleSaveChanges = () => {
    updateRequestMutation.mutate({
      id: id as string,
      updates: { title, description, status, priority, updated_at: new Date() },
    }, {
      onSuccess: () => {
        router.push(`/requests/${id}`);
      }
    });
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        request && (
          <Fade in timeout={500}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
              <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                  >
                    Back
                  </Button>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Typography component="h2" variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Edit
                </Typography>
                <TextField
                  label="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
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
              </Box>
            </Paper>
          </Fade>
        )
      )}
    </Container>
  );
}
