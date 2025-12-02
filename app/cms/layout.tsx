// File: app/cms/layout.tsx

import React from "react";
import { Box, Typography } from "@mui/material";
import { Inter } from "next/font/google";
import "../../styles/globals.css";

const font = Inter({ subsets: ["latin"], weight: ["400", "700"] });

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box className={font.className} display="flex" flexDirection="column" minHeight="100vh">
      <Box component="header" bgcolor="#fff" boxShadow={1} p={2}>
        <Typography variant="h6" color="primary">
          RBM CoreCompliance CMS
        </Typography>
      </Box>
      <Box component="main" flexGrow={1} p={2} bgcolor="#ffffff">
        {children}
      </Box>
      <Box component="footer" bgcolor="#f3f3f3" p={2} textAlign="center">
        <Typography variant="body2" color="textSecondary">
          © 2025 RBM AI/ML Playground. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
} 
