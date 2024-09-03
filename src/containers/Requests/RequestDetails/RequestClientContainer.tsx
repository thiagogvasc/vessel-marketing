"use client";

import {
  useGetRequestById,
} from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
} from "@mui/material";
import React from "react";
import {
  useGetUserById,
} from "@/src/hooks/react-query/user";
import { StyledPaper } from "../../../components/StyledPaper";

interface RequestClientContainerProps {
  requestId: string;
}

export const RequestClientContainer: React.FC<
  RequestClientContainerProps
> = ({ requestId }) => {
    const { data: request, isLoading: isLoadingRequest } = useGetRequestById(requestId);
  const { data: client, isLoading: isLoadingUser } = useGetUserById(request?.client_id);

  return (
    <>
      {isLoadingRequest || isLoadingUser ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        client && (
            <StyledPaper sx={{ mt: 3, p: 3, display: "inline-block" }}>
              <Typography variant="h6" gutterBottom mb={2}>
                Client
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "start",
                  alignItems: "start",
                  gap: 2,
                }}
              >
                <Avatar sx={{ width: 48, height: 48 }} />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "start",
                  }}
                >
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    {client?.fullname}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                  >
                    {client?.email}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {client?.phone_number}
                  </Typography>
                </Box>
              </Box>
            </StyledPaper>
        )
      )}
    </>
  );
};
