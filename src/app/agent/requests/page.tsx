"use client";
import { Container, Paper } from "@mui/material";
import { RequestsContainer } from "@/src/containers/RequestsContainer";

const Requests = () => {
  return (
    <Container component="main" maxWidth="xl">
      <RequestsContainer />
    </Container>
  );
};

export default Requests;
