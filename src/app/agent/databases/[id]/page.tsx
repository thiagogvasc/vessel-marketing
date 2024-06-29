'use client'

import DatabaseView from "@/src/components/DatabaseView";
import { Task } from "@/src/types";
import { Box, Container, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useParams } from "next/navigation";


export default function Database() {
    const { id: databaseId } = useParams();
    return (
      <Box component="main" sx={{ height: '100%', maxWidth: '100%', overflow: 'auto'}}>
        <Typography component="h1" variant="h5">Kanban Board - Test</Typography>
        <DatabaseView databaseId={databaseId as string} />
      </Box>
    );
}