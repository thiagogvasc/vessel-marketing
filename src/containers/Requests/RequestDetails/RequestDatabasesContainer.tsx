"use client";

import { useGetRequestById } from "@/src/hooks/react-query/request";
import { Box, Typography, List } from "@mui/material";
import React from "react";
import { useGetCurrentUser } from "@/src/hooks/react-query/user";
import { StyledPaper } from "../../../components/StyledPaper";

interface RequestDatabasesContainerProps {
  requestId: string;
}

export const RequestDatabasesContainer: React.FC<
  RequestDatabasesContainerProps
> = ({ requestId }) => {
  const { data: request } = useGetRequestById(requestId);
  const { data: user } = useGetCurrentUser();

  const handleAttachDatabase = () => {
    
  };

  const handleDetachDatabase = () => {

  }

  return (
    <StyledPaper sx={{ mt: 3, p: 3 }}>
      <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
        Projects
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
      </Box>
      <List>
        {['project1', 'project 2', 'roject 3']?.map((database, index) => (
          database
        ))}
      </List>
    </StyledPaper>
  );
};
