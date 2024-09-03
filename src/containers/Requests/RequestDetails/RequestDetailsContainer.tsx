"use client";

import {
  useAddRequestUpdate,
  useGetRequestById,
  useUpdateRequest,
} from "@/src/hooks/react-query/request";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import {
  RequestStatus,
  RequestPriority,
  RequestStatusUpdate,
} from "@/src/types";
import React, { useState } from "react";
import {
  useGetCurrentUser,
} from "@/src/hooks/react-query/user";
import ConfirmStatusChangeDialog from "@/src/components/ConfirmStatusChangeDialog";
import { CustomChip } from "../../../components/CustomChip";
import { StyledPaper } from "../../../components/StyledPaper";
import { v4 as uuidv4 } from "uuid";
import { RequestClientContainer } from "./RequestClientContainer";
import { RequestCommentsContainer } from "./RequestCommentsContainer";
import { RequestStatusUpdatesContainer } from "./RequestStatusUpdatesContainer";

interface RequestDetailsContainerProps {
  requestId: string;
}

export const RequestDetailsContainer: React.FC<
  RequestDetailsContainerProps
> = ({ requestId }) => {
  const { data: request } = useGetRequestById(requestId);
  const { data: user } = useGetCurrentUser();
  const addRequestUpdateMutation = useAddRequestUpdate();
  const updateRequestMutation = useUpdateRequest();

  const [status, setStatus] = useState<RequestStatus>(
    request?.status || "Pending",
  );
  const [priority, setPriority] = useState<RequestPriority>(
    request?.priority || "Low",
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [notifyClient, setNotifyClient] = useState(false);
  const [comment, setComment] = useState("");

  const handleStatusChange = (event: SelectChangeEvent<RequestStatus>) => {
    const newStatus = event.target.value as RequestStatus;
    setStatus(newStatus);
    setOpenDialog(true);
  };

  const handlePriorityChange = async (
    event: SelectChangeEvent<RequestPriority>,
  ) => {
    const newPriority = event.target.value as RequestPriority;
    setPriority(newPriority);
    await updateRequestMutation.mutate({
      id: request?.id as string,
      updates: { priority: newPriority },
    });
    console.warn("updated priority");
  };

  const handleDialogClose = async (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      await updateRequestMutation.mutate({
        id: request?.id as string,
        updates: { status: status },
      });
      const newRequestStatusUpdate: RequestStatusUpdate = {
        id: uuidv4(),
        request_id: request?.id ?? "",
        status: status,
        comment: "commnet",
        updated_by: user?.id ?? "",
      };
      await addRequestUpdateMutation.mutate({
        requestId: requestId,
        statusUpdate: newRequestStatusUpdate,
      });
    } else {
      setStatus(request?.status || "Pending");
    }
  };

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
            <Typography
              component="h1"
              variant="h5"
              fontWeight="bold"
              noWrap
            >
              {request?.title}
            </Typography>
            <CustomChip type="status" value={request?.status ?? ''} />
            <CustomChip type="priority" value={request?.priority ?? ""} />
          </Box>
          <Typography variant="body2" color="textDisabled" noWrap>
            {new Date(request?.created_at ?? "").toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Select
            size="small"
            value={status}
            onChange={handleStatusChange}
            sx={{ ml: 1, minWidth: 120 }}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>

          <Select
            size="small"
            value={priority}
            onChange={handlePriorityChange}
            sx={{ ml: 1, minWidth: 120 }}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>
          </Select>
        </Box>
      </Box>

      <StyledPaper sx={{ mt: 3, p: 3 }}>
        <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
          Description
        </Typography>
        <Typography variant="body1">{request?.description}</Typography>
      </StyledPaper>

      <RequestClientContainer requestId={requestId}/>
      <RequestStatusUpdatesContainer requestId={requestId}/>
      <RequestCommentsContainer requestId={requestId} />

      <ConfirmStatusChangeDialog
        open={openDialog}
        status={status}
        notifyClient={notifyClient}
        onConfirm={handleDialogClose}
        onCancel={() => setOpenDialog(false)}
        setNotifyClient={setNotifyClient}
        comment={comment}
        setComment={setComment}
      />
    </>
  );
};
