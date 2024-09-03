import ConfirmStatusChangeDialog from "@/src/components/ConfirmStatusChangeDialog";
import {
  useAddRequestUpdate,
  useGetRequestById,
} from "@/src/hooks/react-query/request";
import { useGetCurrentUser } from "@/src/hooks/react-query/user";
import useUpdateRequest from "@/src/hooks/useUpdateRequestById";
import {
  RequestPriority,
  RequestStatus,
  RequestStatusUpdate,
} from "@/src/types";
import { Box, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface RequestControlsContainerProps {
  requestId: string | undefined;
}

export const RequestControlsContainer: React.FC<
  RequestControlsContainerProps
> = ({ requestId }) => {
  const { data: request } = useGetRequestById(requestId);
  const updateRequestMutation = useUpdateRequest(requestId);
  const addRequestUpdateMutation = useAddRequestUpdate();
  const { data: user } = useGetCurrentUser();

  const [openDialog, setOpenDialog] = useState(false);
  const [comment, setComment] = useState("");

  const [notifyClient, setNotifyClient] = useState(false);

  const [status, setStatus] = useState<RequestStatus>(
    request?.status || "Pending",
  );
  const [priority, setPriority] = useState<RequestPriority>(
    request?.priority || "Low",
  );

  useEffect(() => {
    setStatus(request?.status || "Pending");
    setPriority(request?.priority || "Low");
  }, [request])

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
      changes: { priority: newPriority },
    });
    console.warn("updated priority");
  };

  const handleDialogClose = async (confirm: boolean) => {
    setOpenDialog(false);
    if (confirm) {
      await updateRequestMutation.mutate({
        id: request?.id as string,
        changes: { status: status },
      });
      const newRequestStatusUpdate: RequestStatusUpdate = {
        id: uuidv4(),
        request_id: request?.id ?? "",
        status: status,
        comment: "commnet",
        updated_by: user?.id ?? "",
      };
      if (requestId) {
        await addRequestUpdateMutation.mutate({
          requestId: requestId,
          statusUpdate: newRequestStatusUpdate,
        });
      }
    } else {
      setStatus(request?.status || "Pending");
    }
  };
  return (
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
    </Box>
  );
};
