'use client'

import DatabaseView from "@/src/components/DatabaseView";
import { Task } from "@/src/types";
import { Container, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";


export default function Database() {
    const { id: databaseId } = useParams();
    return (
      <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
        <Typography component="h1" variant="h5">Kanban Board - Test</Typography>
        <DatabaseView databaseId={databaseId as string} />
      </Container>
    );
}