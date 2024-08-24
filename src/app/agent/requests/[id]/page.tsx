"use client";

import {
  useAddRequestUpdate,
  useGetRequestById,
  useUpdateRequest,
} from "@/src/hooks/react-query/request";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Fade,
  Grid,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Breadcrumbs,
  Chip,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { RequestStatus, RequestPriority, RequestUpdate } from "@/src/types";
import React, { useState } from "react";
import {
  useGetCurrentUser,
  useGetUserById,
} from "@/src/hooks/react-query/user";
import NextMuiLink from "@/src/components/NextMuiLink";
import NextMuiButton from "@/src/components/NextMuiButton";
import { Home, NavigateNext } from "@mui/icons-material";
import ConfirmStatusChangeDialog from "@/src/components/ConfirmStatusChangeDialog";

export default function RequestDetails() {
  const router = useRouter();
  const { id } = useParams();

  const { data: user } = useGetCurrentUser();

  const { data: request, isLoading } = useGetRequestById(id as string);
  const { data: requestorData } = useGetUserById(request?.client_id);
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
      await addRequestUpdateMutation.mutate({
        id: request?.id as string,
        update: {
          update_description: comment,
          updated_by: user?.id as string,
        },
      });
    } else {
      setStatus(request?.status || "Pending");
    }
  };

  return (
    <Container component="main" maxWidth="xl" sx={{ mt: 4 }}>
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
          <Fade in timeout={500}>
            <Box sx={{ borderRadius: 3, p: 0 }}>
              <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs>
                  <Typography component="h1" variant="h5" noWrap>
                    {request.title}
                  </Typography>
                </Grid>
                <Grid item>
                  <Breadcrumbs
                    aria-label="breadcrumb"
                    separator={<NavigateNext fontSize="small" />}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    <NextMuiLink
                      color="inherit"
                      href="/agent/dashboard"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/agent/dashboard");
                      }}
                      noWrap
                    >
                      <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                      Dashboard
                    </NextMuiLink>
                    <NextMuiLink
                      color="inherit"
                      href="/agent/requests"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/agent/requests");
                      }}
                      noWrap
                    >
                      Requests
                    </NextMuiLink>
                    <Typography color="textPrimary" noWrap>
                      Request Details
                    </Typography>
                  </Breadcrumbs>
                </Grid>
              </Grid>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    General Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Submitted by:</strong> {requestorData?.fullname}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Email:</strong> {requestorData?.email}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Phone Number:</strong>{" "}
                        {requestorData?.phone_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <strong>Status:</strong>
                        <Select
                          value={status}
                          onChange={handleStatusChange}
                          sx={{ ml: 1, minWidth: 120 }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="In Progress">In Progress</MenuItem>
                          <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <strong>Priority:</strong>
                        <Select
                          value={priority}
                          onChange={handlePriorityChange}
                          sx={{ ml: 1, minWidth: 120 }}
                        >
                          <MenuItem value="Low">Low</MenuItem>
                          <MenuItem value="Medium">Medium</MenuItem>
                          <MenuItem value="High">High</MenuItem>
                        </Select>
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Created At:</strong> {request.created_at}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Updated At:</strong> {request.updated_at}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1">{request.description}</Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Update History
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {/* {request.updates && request.updates.length > 0 ? (
                      request.updates.map((update, index) => (
                        <React.Fragment key={index}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={update.updated_at?.toDate().toLocaleString()}
                              secondary={
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {update.update_description}
                                </Typography>
                              }
                            />
                          </ListItem>
                          {index < request.updates.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No updates available
                      </Typography>
                    )} */}
                  </List>
                </Box>
              </Paper>
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
          </Fade>
        )
      )}
    </Container>
  );
}
