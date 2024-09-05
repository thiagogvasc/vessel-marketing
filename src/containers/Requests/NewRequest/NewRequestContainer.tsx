"use client";
import { useRouter } from "next/navigation";
import { useGetCurrentUser } from "@/src/hooks/react-query/user";
import { useCreateRequest } from "@/src/hooks/react-query/request";
import { StyledPaper } from '@/src/components/StyledPaper';
import { NewRequestForm } from './NewRequestForm';
import { Typography } from '@mui/material';

export const NewRequestContainer = () => {
  const { data: user } = useGetCurrentUser();
  const mutation = useCreateRequest();
  const router = useRouter();

  const handleSubmit = async (title: string, description: string, content: string, attachments: File[]) => {
    try {
      if (user?.id) {
        await mutation.mutateAsync({
          client_id: user.id,
          title,
          description,
          content,
          status: "Pending",
          created_at: Date.now().toString(),
          updated_at: Date.now().toString(),
        });
      }
      router.push("/client/requests");
    } catch (error) {
      console.error("Error adding request: ", error);
      alert("Failed to add request");
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5">
        Add Request
      </Typography>
      <StyledPaper sx={{ p: 3 }}>
        <NewRequestForm onSubmit={handleSubmit} />
      </StyledPaper>
    </>
  );
};

