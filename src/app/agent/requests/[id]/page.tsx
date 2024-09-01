"use client";

import React from "react";
import { RequestDetailsContainer } from "@/src/containers/Requests/RequestDetails/RequestDetailsContainer";
import { useParams } from "next/navigation";
import { Container } from "@mui/material";


export default function RequestDetails() {
  const { id: requestId } = useParams();

  return (
    <Container component="main" maxWidth="xl">
      <RequestDetailsContainer requestId={requestId as string} />
    </Container>
  );
}
