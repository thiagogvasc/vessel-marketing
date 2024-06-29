'use client'

import React, { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import KanbanView from './KanbanView';
import { useGetDatabaseTasks } from '../hooks/useTasks';

interface DatabaseViewProps {
  databaseId: string;
}

const DatabaseView: React.FC<DatabaseViewProps> = ({ databaseId }) => {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  const { data } = useGetDatabaseTasks(databaseId);

  return (
    <Box sx={{  }}>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
      >
        {data?.views.map(databaseView => <Tab key={databaseView.name} label={databaseView.name} /> )}
      </Tabs>
      <Box sx={{ p: 3 }}>
        {data?.views.map(databaseView => {
          if (databaseView.type === 'kanban') return <KanbanView key={databaseView.name} databaseId={data?.id} databaseView={databaseView} />
          return <>View type not supported</>
        })}
      </Box>
    </Box>
  );
};

export default DatabaseView;
