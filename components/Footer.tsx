'use client';

import {
  Box,
  Typography,
  Link,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#111',
        color: '#fff',
        px: { xs: 3, sm: 6 },
        pt: 6,
        pb: 2,
        fontFamily: 'Santoshi',
        marginTop: '50px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        {/* About Us */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            About Us
          </Typography>
          {['Company', 'Services', 'Expertise', 'Contact'].map((item) => (
            <Link
              href="#"
              key={item}
              color="inherit"
              underline="hover"
              display="block"
              sx={{ fontSize: '0.9rem', mb: 0.5 }}
            >
              {item}
            </Link>
          ))}
        </Box>

        {/* For You */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            For You
          </Typography>
          {['Resources', 'FAQs', 'Terms', 'Privacy'].map((item) => (
            <Link
              href="#"
              key={item}
              color="inherit"
              underline="hover"
              display="block"
              sx={{ fontSize: '0.9rem', mb: 0.5 }}
            >
              {item}
            </Link>
          ))}
        </Box>

        {/* Follow Us */}
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Follow Us
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton href="#" color="inherit" size="small">
              <FacebookIcon fontSize="small" />
            </IconButton>
            <IconButton href="#" color="inherit" size="small">
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        mt={6}
        pt={2}
        borderTop="1px solid #333"
        display="flex"
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Typography
          variant="caption"
          color="gray"
          sx={{ fontSize: '0.75rem', textAlign: isMobile ? 'center' : 'left' }}
        >
          ©2025 RBM Software Inc. • All Rights Reserved
        </Typography>

        <Box
          component="img"
          src="/images/rbm-logo.svg"
          alt="RBM Logo"
          sx={{
            height: 30,
            filter: 'brightness(0) invert(1)',
            ml: isMobile ? 0 : 'auto',
          }}
        />
      </Box>
    </Box>
  );
}
