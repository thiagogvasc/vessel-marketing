"use client";

import {
  useAddRequestUpdate,
  useGetRequestById,
  useGetRequestStatusUpdatesByRequestId,
  useUpdateRequest,
} from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  SelectChangeEvent,
  Avatar,
  List,
  TextField,
  IconButton,
} from "@mui/material";
import {
  RequestStatus,
  RequestPriority,
  RequestStatusUpdate,
} from "@/src/types";
import React, { useState } from "react";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/src/hooks/react-query/user";
import ConfirmStatusChangeDialog from "@/src/components/ConfirmStatusChangeDialog";
import { CustomChip } from "../../../components/CustomChip";
import { StyledPaper } from "../../../components/StyledPaper";
import { v4 as uuidv4 } from "uuid";
import {
  useAddRequestComment,
  useDeleteRequestComment,
  useGetCommentsByRequestId,
  useUpdateRequestComment,
} from "@/src/hooks/react-query/request_comment";
import { RequestComment } from "@/src/components/RequestComment";

import Timeline from "@mui/lab/Timeline";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Send } from "@mui/icons-material";

interface RequestStatusUpdatesContainerProps {
  requestId: string;
}

export const RequestStatusUpdatesContainer: React.FC<
  RequestStatusUpdatesContainerProps
> = ({ requestId }) => {
  const { data: statusUpdates } =
    useGetRequestStatusUpdatesByRequestId(requestId);
  return (
    <StyledPaper sx={{ mt: 3, p: 3, display: "inline-block" }}>
        <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
        Status updates
        </Typography>
        <Timeline
        sx={{
            [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
            },
        }}
        >
        {statusUpdates?.map((update) => (
            <TimelineItem key={update.id}>
            <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
                Request status moved to {update.status}
            </TimelineContent>
            </TimelineItem>
        ))}
        </Timeline>
    </StyledPaper>
  );
};
