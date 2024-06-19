import DatabaseView from "@/src/components/DatabaseView";
import { Task } from "@/src/types";
import { Container, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";


export default function Planning() {
    return (
      <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">Kanban Board - Test</Typography>
        <DatabaseView />
      </Container>
    );
  }