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
  Grid2,
  Avatar,
  List,
  Button,
  TextField,
} from "@mui/material";
import { RequestStatus, RequestPriority, RequestStatusUpdate } from "@/src/types";
import React, { useState } from "react";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/src/hooks/react-query/user";
import ConfirmStatusChangeDialog from "@/src/components/ConfirmStatusChangeDialog";
import { CustomChip } from "../../../components/CustomChip";
import { StyledPaper } from "../../../components/StyledPaper";
import { v4 as uuidv4 } from 'uuid'
import { useAddRequestComment, useGetCommentsByRequestId } from "@/src/hooks/react-query/request_comment";
import { RequestComment } from "@/src/components/RequestComment";

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

interface RequestDetailsContainerProps {
    requestId: string;
}

export const RequestDetailsContainer: React.FC<RequestDetailsContainerProps> = ({ requestId }) => {
  const { data: request, isLoading } = useGetRequestById(requestId);
  const { data: requestorData } = useGetUserById(request?.client_id);
  const { data: user } = useGetCurrentUser();
  const { data: statusUpdates } = useGetRequestStatusUpdatesByRequestId(requestId);
  const { data: comments } = useGetCommentsByRequestId(requestId);
  const addRequestUpdateMutation = useAddRequestUpdate();
  const updateRequestMutation = useUpdateRequest();
  const addCommentMutation = useAddRequestComment(requestId);
  const [newCommentText, setNewCommentText] = useState('');

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

  const handleAddComment = () => {
    addCommentMutation.mutate({
      id: uuidv4(),
      author_id: user?.id ?? '',
      request_id: request?.id ?? '',
      text: newCommentText,
    })
  }

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
        updates: { status: status  },
      });
      const newRequestStatusUpdate: RequestStatusUpdate = {
        id: uuidv4(),
        request_id: request?.id ?? '',
        status: status,
        comment: 'commnet', 
        updated_by: user?.id ?? '',
      }
      await addRequestUpdateMutation.mutate({
        requestId: requestId,
        statusUpdate: newRequestStatusUpdate 
      })
    } else {
      setStatus(request?.status || "Pending");
    }
  };

  return (
    <>
      {isLoading ? (
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
        request && (
          <>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    justifyContent: 'center',
                    gap: '8px'
                }}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'start',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <Typography component="h1" variant="h5" fontWeight="bold" noWrap>
                            {request.title}
                        </Typography>
                        <CustomChip type="status" value={request.status} />
                        <CustomChip type="priority" value={request.priority ?? ''} />
                    </Box>
                    <Typography variant="body2" color="textDisabled" noWrap>
                        {new Date(request.created_at ?? '').toLocaleString()}
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

               <StyledPaper sx={{mt: 3, p: 3}}>
                    <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
                        Description
                    </Typography>
                    <Typography variant="body1">{request.description}</Typography>
                </StyledPaper>
                
                <StyledPaper sx={{ mt: 3, p: 3, display: 'inline-block' }}>
                  <Typography variant="h6" gutterBottom mb={2}>
                    Client
                  </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'start', gap: 2}}>
                      <Avatar sx={{ width: 48, height: 48}} />
                      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start'}}>
                        <Typography variant="body2" fontWeight="bold" gutterBottom>
                          {requestorData?.fullname}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {requestorData?.email}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {requestorData?.phone_number}
                        </Typography>
                      </Box>
                    </Box>
                </StyledPaper>

                <StyledPaper sx={{mt: 3, p: 3, display: 'inline-block'}}>
                    <Typography fontSize={18} fontWeight={600} gutterBottom mb={2}>
                        Status updates
                    </Typography>
                    <Timeline sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                          flex: 0,
                          padding: 0,
                        },
                      }}>
                      {statusUpdates?.map(update => (
                        <TimelineItem key={update.id}>
                          <TimelineSeparator>
                            <TimelineDot />
                            <TimelineConnector />
                          </TimelineSeparator>
                          <TimelineContent>Request status moved to {update.status}</TimelineContent>
                        </TimelineItem>
                      ))}
                    </Timeline>
                </StyledPaper>

                <StyledPaper sx={{mt: 3, p: 3}}>
                  <TextField
                    label="Comment"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddComment}
                    style={{ marginTop: "10px" }}
                  >
                    Add Comment
                  </Button>
                  <List>
                    {comments?.map((comment, index) => (
                      <RequestComment
                        key={index}
                        comment={comment}
                        // onUpdate={handleCommentUpdate}
                        // onDelete={handleCommentDelete}
                      />
                    ))}
                  </List>
                </StyledPaper>
  


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
        )
      )}
    </>
  );
}
