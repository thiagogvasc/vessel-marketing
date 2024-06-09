'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../../../firebaseConfig';
import { useAuth } from '../../../../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Fade,
  Grow,
} from '@mui/material';
import { useGetCurrentUser } from '@/src/hooks/useUsers';
import Link from 'next/link';

const NewRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { data: user } = useGetCurrentUser();
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
      <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Grid item>
            <Typography component="h1" variant="h5">
              Add Request
            </Typography>
          </Grid>
          <Grid item>
            <Breadcrumbs aria-label="breadcrumb">
              <MuiLink component={Link} color="inherit" href="/client/dashboard">
                Dashboard
              </MuiLink>
              <MuiLink component={Link} color="inherit" href="/client/requests">
                Requests
              </MuiLink>
              <Typography color="textPrimary">Add Request</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grow in timeout={1000}>
          <Paper elevation={0} sx={{ px: 4, py: 2, borderRadius: 3 }}>
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
                sx={{ mb: 3 }}
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
                rows={6}
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
                    Submit
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
