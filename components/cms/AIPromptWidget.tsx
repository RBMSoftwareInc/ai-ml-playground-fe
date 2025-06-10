import React, { useState } from "react";
import {
  Drawer,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

interface AIPromptWidgetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  placeholder?: string;
  buttonText?: string;
  topOffset?: number;
}

export default function AIPromptWidget({
  open,
  onClose,
  onSubmit,
  placeholder = "Enter your AI prompt here...",
  buttonText = "Submit",
  topOffset = 0,
}: AIPromptWidgetProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    onSubmit(prompt);
    setPrompt("");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          top: topOffset,
          height: `calc(100% - ${topOffset}px)`,
          width: 300,
          background: "#ffffff",
          borderLeft: "1px solid #e0e0e0",
          boxShadow: "0 4px 8px rgba(224, 224, 224, 0.5)",
          p: 2,
          display: "flex",
          flexDirection: "column",
          animation: open ? "slideIn 0.3s ease-in-out forwards" : "slideOut 0.3s ease-in-out forwards",
        },
        "& .MuiDrawer-root": {
          zIndex: 1300, // Ensure the drawer is above other elements
        },
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          @keyframes slideOut {
            from {
              transform: translateX(0);
              opacity: 1;
            }
            to {
              transform: translateX(100%);
              opacity: 0;
            }
          }
        `}
      </style>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography
          sx={{
            color: "#616161",
            fontWeight: 500,
          }}
        >
          Enhance with AI
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: "#616161",
            "&:hover": {
              color: "#d32f2f",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <TextField
        placeholder={placeholder}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: "4px",
            borderColor: "#e0e0e0",
            "&:hover fieldset": {
              borderColor: "#d32f2f",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#d32f2f",
            },
          },
          "& .MuiInputBase-input": {
            color: "#616161",
            fontSize: "14px",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#9e9e9e",
            opacity: 1,
          },
        }}
      />
      <Button
        onClick={handleSubmit}
        startIcon={<SaveIcon />}
        sx={{
          border: "1px solid #d32f2f",
          color: "#d32f2f",
          background: "transparent",
          px: 2,
          py: 0.5,
          "&:hover": {
            background: "rgba(211, 47, 47, 0.1)",
          },
        }}
      >
        {buttonText}
      </Button>
    </Drawer>
  );
}