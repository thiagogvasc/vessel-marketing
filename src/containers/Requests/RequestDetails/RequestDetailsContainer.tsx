"use client";

import { useGetRequestById } from "@/src/hooks/react-query/request";
import { Box, Typography } from "@mui/material";
import React from "react";
import { CustomChip } from "../../../components/CustomChip";
import { StyledPaper } from "../../../components/StyledPaper";
import { RequestClientContainer } from "./RequestClientContainer";
import { RequestCommentsContainer } from "./RequestCommentsContainer";
import { RequestStatusUpdatesContainer } from "./RequestStatusUpdatesContainer";
import { RequestControlsContainer } from "./RequestControlsContainer";
import { RequestDatabasesContainer } from "./RequestDatabasesContainer";

interface RequestDetailsContainerProps {
  requestId: string;
}

export const RequestDetailsContainer: React.FC<
  RequestDetailsContainerProps
> = ({ requestId }) => {
  const { data: request } = useGetRequestById(requestId);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center", 
              gap: "8px",
            }}
          >
            <Typography component="h1" variant="h5" fontWeight="bold" noWrap>
              {request?.title}
            </Typography>
            <CustomChip type="status" value={request?.status ?? ""} />
            <CustomChip type="priority" value={request?.priority ?? ""} />
          </Box>
          <Typography variant="body2" color="textDisabled" noWrap>
            {new Date(request?.created_at ?? "").toLocaleString()}
          </Typography>
        </Box>
        <RequestControlsContainer requestId={requestId} />
      </Box>

      <StyledPaper sx={{ mt: 3, p: 3 }}>
        <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
          Description
        </Typography>
        <Typography variant="body1">{request?.description}</Typography>
      </StyledPaper>

      <RequestDatabasesContainer requestId={requestId} />
      <RequestClientContainer requestId={requestId} />
      <RequestStatusUpdatesContainer requestId={requestId} />
      <RequestCommentsContainer requestId={requestId} />
    </>
  );
};
