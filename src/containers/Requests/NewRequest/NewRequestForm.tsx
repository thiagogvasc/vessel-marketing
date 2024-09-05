"use client";
import 'react-quill/dist/quill.snow.css';
import "./custom-quill.css"

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid2,
} from "@mui/material";
import ReactQuill from 'react-quill';

interface NewRequestFormProps {
  onSubmit?: (title: string, description: string, content: string, attachments: File[]) => void;
}

export const NewRequestForm: React.FC<NewRequestFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]); // State to manage attachments

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit?.(title, description, content, attachments);
  };

  // Handler for file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(Array.from(files)); // Convert FileList to Array and set attachments
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
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
        <Typography variant="body2" mt={2} mb={1} fontWeight={600}>
          Content
        </Typography>
        <ReactQuill
          className='custom-quill'
          theme="snow"
          value={content}
          onChange={e => setContent(e)}
          placeholder="Enter the description here..."
        />
      </Box>

      {/* Attachments Section */}
      <Box mt={3}>
        <Typography variant="body2" fontWeight={600}>
          Attachments
        </Typography>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={{ marginTop: '8px', marginBottom: '16px' }}
        />
        {/* Display selected files */}
        {attachments.length > 0 && (
          <Typography variant="body2" color="textSecondary">
            {attachments.length} file(s) selected
          </Typography>
        )}
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
  )
};

