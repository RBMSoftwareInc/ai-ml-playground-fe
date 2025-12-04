'use client';

import { useState } from 'react';
import { Box, Typography, Collapse } from '@mui/material';
import { motion } from 'framer-motion';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

interface FileNode {
  name: string;
  type: 'file' | 'directory';
  children?: Record<string, FileNode>;
  size?: number;
}

interface FileTreeProps {
  tree: Record<string, FileNode | any>;
  onFileSelect?: (path: string) => void;
  selectedFile?: string | null;
}

function TreeNode({ node, path, level = 0, onFileSelect, selectedFile }: {
  node: FileNode;
  path: string;
  level?: number;
  onFileSelect?: (path: string) => void;
  selectedFile?: string | null;
}) {
  const [open, setOpen] = useState(level < 2); // Auto-expand first 2 levels

  const isSelected = selectedFile === path;
  const isDirectory = node.type === 'directory';

  const handleClick = () => {
    if (isDirectory) {
      setOpen(!open);
    } else {
      onFileSelect?.(path);
    }
  };

  return (
    <Box>
      <Box
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1,
          py: 0.5,
          pl: level * 2 + 1,
          cursor: 'pointer',
          bgcolor: isSelected ? 'rgba(255,0,0,0.1)' : 'transparent',
          borderLeft: isSelected ? '2px solid #ff0000' : '2px solid transparent',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.05)',
          },
        }}
      >
        {isDirectory ? (
          open ? (
            <FolderOpenIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
          ) : (
            <FolderIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
          )
        ) : (
          <InsertDriveFileIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.85rem',
            color: isSelected ? '#fff' : 'rgba(255,255,255,0.8)',
            fontWeight: isSelected ? 500 : 400,
          }}
        >
          {node.name}
        </Typography>
        {node.size && (
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', ml: 'auto' }}>
            {node.size} B
          </Typography>
        )}
      </Box>

      {isDirectory && (
        <Collapse in={open}>
          <Box>
            {node.children &&
              Object.entries(node.children).map(([name, child]) => (
                <TreeNode
                  key={name}
                  node={child}
                  path={`${path}/${name}`}
                  level={level + 1}
                  onFileSelect={onFileSelect}
                  selectedFile={selectedFile}
                />
              ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

export default function FileTree({ tree, onFileSelect, selectedFile }: FileTreeProps) {
  // Transform tree structure to include names
  const transformTree = (treeObj: Record<string, any>): Record<string, FileNode> => {
    const result: Record<string, FileNode> = {};
    for (const [key, value] of Object.entries(treeObj)) {
      if (value && typeof value === 'object') {
        if ('type' in value) {
          // Already has type property
          if (value.type === 'file') {
            result[key] = {
              name: key,
              type: 'file',
              size: value.size,
            };
          } else if (value.type === 'directory') {
            result[key] = {
              name: key,
              type: 'directory',
              children: value.children ? transformTree(value.children) : undefined,
            };
          }
        } else {
          // Nested structure without explicit type - treat as directory
          result[key] = {
            name: key,
            type: 'directory',
            children: transformTree(value),
          };
        }
      }
    }
    return result;
  };

  const transformedTree = transformTree(tree);

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        bgcolor: 'rgba(0,0,0,0.2)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {Object.entries(transformedTree).map(([name, node]) => (
        <TreeNode
          key={name}
          node={node}
          path={name}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      ))}
    </Box>
  );
}

