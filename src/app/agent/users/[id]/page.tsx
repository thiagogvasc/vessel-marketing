"use client";

import { useEffect, useState } from "react";
import { useGetUserById } from "@/src/hooks/react-query/user"; // Assuming you have a hook to get user details
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useRouter, useParams } from "next/navigation";

const UserDetail = () => {
  const router = useRouter();
  const { id } = useParams(); // Assuming you are using a router hook to get the user ID from the URL
  const { data: user, isLoading } = useGetUserById(id as string); // Fetch user details based on the ID

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Grid
        container
        spacing={2}
        mb={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <Typography component="h1" variant="h5">
            User Details
          </Typography>
        </Grid>
        <Grid item>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
          >
            <MuiLink
              color="inherit"
              href="/"
              onClick={(e) => {
                e.preventDefault();
                router.push("/agent/dashboard");
              }}
              noWrap
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Dashboard
            </MuiLink>
            <MuiLink
              color="inherit"
              href="/agent/users"
              onClick={(e) => {
                e.preventDefault();
                router.push("/agent/users");
              }}
              noWrap
            >
              Users
            </MuiLink>
            <Typography color="textPrimary" noWrap>
              User Details
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
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
        <Paper elevation={1} sx={{ borderRadius: 2, p: 3 }}>
          <Typography component="h2" variant="h6" gutterBottom>
            ID: {user?.id}
          </Typography>
          <Typography component="h2" variant="h6" gutterBottom>
            Full Name: {user?.fullname}
          </Typography>
          <Typography component="h2" variant="h6" gutterBottom>
            Email: {user?.email}
          </Typography>
          <Typography component="h2" variant="h6" gutterBottom>
            Created At: {user?.created_at}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default UserDetail;
