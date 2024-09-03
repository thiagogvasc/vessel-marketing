import React from "react";
import { RequestDetailsContainer } from "@/src/containers/Requests/RequestDetails/RequestDetailsContainer";
import { Container } from "@mui/material";

interface RequestDetailsProps {
  params: {
    id: string;
  }
}

export default function RequestDetails({ params }: RequestDetailsProps) {
  return (
    <Container component="main" maxWidth="xl">
      <RequestDetailsContainer requestId={params.id} />
    </Container>
  );
}
