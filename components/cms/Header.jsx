import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { grey, red } from '@mui/material/colors';

const headerHeight = 80;

export default function Header({ onLogout }) {
  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(90deg, #ffffff, #e5e7eb)',
        height: headerHeight,
        justifyContent: 'center',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: headerHeight }}>
        <Box display="flex" flexDirection="column" gap={0.5}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: grey[800] }}>
            <img src="/images/rbm-logo.svg" alt="RBM Logo" style={{ height: 22, marginRight: 8, verticalAlign: 'middle', filter: 'brightness(0) saturate(100%) invert(15%) sepia(100%) saturate(7472%) hue-rotate(0deg) brightness(99%) contrast(118%)' }} />
            .comIQ Studio
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey[600],
              fontStyle: 'italic',
              fontSize: '0.875rem',
              lineHeight: 1.2,
            }}
          >
            Content Orchestration & Release Engine — Powerful, AI-driven content deployment workspace
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2" sx={{ color: grey[700] }}>Hello, Admin</Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={onLogout}
            sx={{
              color: red[600],
              borderColor: red[400],
              textTransform: 'uppercase',
              '&:hover': {
                borderColor: red[600],
                backgroundColor: red[50],
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

Header.propTypes = {
  onLogout: PropTypes.func,
};

Header.defaultProps = {
  onLogout: () => {},
};