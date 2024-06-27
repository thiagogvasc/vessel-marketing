'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const NewDatabase = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [viewType, setViewType] = useState('Kanban View');
  const [clientId, setClientId] = useState('');

  const handleAddDatabase = async () => {
    try {
      //await addDatabase({ name, initialViewType: viewType, clientId });
      router.push('/agent/databases');
    } catch (error) {
      console.error('Failed to add database:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: 4 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h5" textAlign="center">
            Add Database
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Database Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Initial View Type</InputLabel>
            <Select
              value={viewType}
              onChange={(e) => setViewType(e.target.value)}
              label="Initial View Type"
            >
              <MenuItem value="Kanban View">Kanban View</MenuItem>
              <MenuItem value="Table View" disabled>Table View</MenuItem>
              <MenuItem value="List View" disabled>List View</MenuItem>
              <MenuItem value="Calendar View" disabled>Calendar View</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Client ID"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddDatabase}
          >
            Add Database
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewDatabase;
