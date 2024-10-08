"use client";

// import { KanbanViewContain} from "@/src/components/KanbanView";
import {
  useGetDatabaseById,
  useGetDatabaseViews,
} from "@/src/hooks/react-query/database";
import { Box, Container, Paper, Tab, Tabs, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Database() {
  const { id: databaseId } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const { data: database } = useGetDatabaseById(databaseId as string);
  const { data: databaseViews } = useGetDatabaseViews(databaseId as string);

  return (
    <Container component="main" maxWidth="xl">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          p: 4,
          boxShadow:
            "rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px",
        }}
      >
        <Typography component="h1" variant="h5">
          {database?.name}
        </Typography>
      </Paper>
      <Tabs
        sx={{ pt: 2 }}
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {databaseViews?.map((databaseView) => (
          <Tab key={databaseView.name} label={databaseView.name} />
        ))}
      </Tabs>

      <Box sx={{ p: 3 }}>
        {databaseViews?.map((databaseView) => {
          // if (databaseView.type === 'kanban') return <KanbanView readOnly={true} key={databaseView.name} databaseId={data?.id} databaseView={databaseView} />
          return <>View type not supported</>;
        })}
      </Box>
    </Container>
  );
}
