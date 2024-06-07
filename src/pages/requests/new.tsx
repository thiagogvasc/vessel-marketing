import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Fade,
  Grow
} from '@mui/material';

const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const { user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'requests'), {
        client_id: user?.uid,
        title,
        description,
        status: 'pending',
        priority,
        created_at: new Date(),
        updated_at: new Date(),
      });
      router.push('/requests');
    } catch (error) {
      console.error('Error adding request: ', error);
      alert('Failed to add request');
    }
  };

  return (
    <Fade in timeout={500}>
      <Container component="main" maxWidth="sm">
        <Grow in timeout={1000}>
          <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
            <Typography component="h1" variant="h5" align="center" gutterBottom>
              Add Request
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Title"
                name="title"
                autoComplete="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                autoComplete="description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                select
                id="priority"
                label="Priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </TextField>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Add Request
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grow>
      </Container>
    </Fade>
  );
};

export default NewRequest;
