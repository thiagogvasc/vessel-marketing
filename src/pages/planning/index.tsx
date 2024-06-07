import React from 'react';
import KanbanBoard from '../../components/KanbanBoard';
import { Container, Typography, Box, Paper } from '@mui/material';

export default function Planning() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Planning - Kanban Board
        </Typography>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <KanbanBoard boardId="b34VLvMGePOdsnUdolFN" />
        </Paper>
      </Box>
    </Container>
  );
}
