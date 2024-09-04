"use client";
import 'react-quill/dist/quill.snow.css';
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Breadcrumbs,
  Link as MuiLink,
  Fade,
  Grow,
  Divider,
  Grid2,
} from "@mui/material";
import { useGetCurrentUser } from "@/src/hooks/react-query/user";
import Link from "next/link";
import { useCreateRequest } from "@/src/hooks/react-query/request";
import ReactQuill from 'react-quill';
import { StyledPaper } from '@/src/components/StyledPaper';

const NewRequest = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const { data: user } = useGetCurrentUser();
  const mutation = useCreateRequest();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

  const handleQuillChange = (content: string) => {
    setContent(content);
  }


  return (
    <Container component="main" maxWidth="xl">
        <Typography component="h1" variant="h5">
          Add Request
        </Typography>
        <StyledPaper sx={{ p: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="title"
              label="Title"
              name="title"
              autoComplete="title"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mb: 3 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box>
              <Typography variant="body2" mt={2} mb={1} fontWeight={600}>Content</Typography>
              <ReactQuill 
                theme="snow"
                value={content}
                onChange={handleQuillChange}
                placeholder="Enter the description here..."
              />
            </Box>

            <Grid2 container justifyContent="flex-end">
              <Grid2>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Submit
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </StyledPaper>
    </Container>
  );
};

export default NewRequest;
