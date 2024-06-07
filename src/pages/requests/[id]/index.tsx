import useGetRequestById from "@/src/hooks/useGetRequestById";
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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export default function Request() {
  const router = useRouter();
  const { id } = router.query;

  const { data: request, isLoading } = useGetRequestById(id as string);

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          request && (
            <Fade in timeout={500}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Grow in timeout={1000}>
                  <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography component="h2" variant="h4">
                        {request.title}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        startIcon={<EditIcon />}
                        component={Link}
                        href={`/requests/${request.id}/edit`}
                      >
                        Edit
                      </Button>
                    </Grid>
                  </Grid>
                </Grow>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Description:</strong> {request.description}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Status:</strong> {request.status}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Priority:</strong> {request.priority}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Created At:</strong> {request?.created_at && new Date(request.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Updated At:</strong> {request?.updated_at && new Date(request.updated_at).toLocaleString()}
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          )
        )}
      </Box>
    </Container>
  );
}
