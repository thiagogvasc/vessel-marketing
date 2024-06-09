'use client'

import { useState } from 'react';
import { useRouter } from 'next/router';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../firebaseConfig';
import { useAuth } from '../../../contexts/AuthContext';
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
import { useGetCurrentUser } from '@/src/hooks/useUsers';

const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { data: user } = useGetCurrentUser();
  console.warn(user)
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await addDoc(collection(db, 'requests'), {
        client_id: user?.id,
        title,
        description,
        status: 'pending',
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
      });
      router.push('/client/requests');
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
