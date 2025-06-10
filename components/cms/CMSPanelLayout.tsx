"use client";

import React from "react";
import CMSStudioLayout from "./CMSStudioLayout";
import { usePathname } from "next/navigation";
import { Box, Typography } from "@mui/material";

import AssetsManager from "./AssetsManager";
import AssetBrowser from "./AssetBrowser";
import AssetBrowserNG from "./AssetBrowser-ng";
import ProjectEditor from "./ProjectEditor";
import DeploymentManager from "./DeploymentManager";
import SmartFlipAssetBrowser from "./SmartFlipAssetBrowser";

export default function CMSPanelLayout() {
  const pathname = usePathname();
  const path = pathname?.split("/").pop(); // safe optional chaining

  const renderContent = () => {
    switch (path) {
      case "content":
        return (
          <Box>
            <Typography variant="h5" color="primary">Content Section</Typography>
            <Typography variant="body1" color="textSecondary">This is the content management area.</Typography>
          </Box>
        );
      case "projects":
        return <ProjectEditor />;
      case "asset-explorer":
        return <AssetBrowser editable={false} />;
      case "asset-explorer-ng":
        return <AssetBrowserNG />;
      case "smart-flip":
        return <SmartFlipAssetBrowser />;
      case "feeds-in":
        return (
          <Box>
            <Typography variant="h5" color="primary">Feeds In</Typography>
            <Typography variant="body1" color="textSecondary">Inbound feed configuration and imports.</Typography>
          </Box>
        );
      case "feeds-out":
        return (
          <Box>
            <Typography variant="h5" color="primary">Feeds Out</Typography>
            <Typography variant="body1" color="textSecondary">Export jobs and file distribution.</Typography>
          </Box>
        );
      case "ai-assist":
        return (
          <Box>
            <Typography variant="h5" color="primary">AI Assist</Typography>
            <Typography variant="body1" color="textSecondary">Use prompts to generate or enhance content.</Typography>
          </Box>
        );
      case "deployments":
        return <DeploymentManager />;
      case "audit":
        return (
          <Box>
            <Typography variant="h5" color="primary">Audit Logs</Typography>
            <Typography variant="body1" color="textSecondary">View system and user activity logs.</Typography>
          </Box>
        );
      case "settings":
        return (
          <Box>
            <Typography variant="h5" color="primary">Settings</Typography>
            <Typography variant="body1" color="textSecondary">CMS configuration and preferences.</Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography variant="h6" color="textSecondary">Welcome to .comIQ Studio</Typography>
          </Box>
        );
    }
  };

  return <CMSStudioLayout>{renderContent()}</CMSStudioLayout>;
}
