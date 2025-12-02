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
import { motion } from 'framer-motion';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 'auto',
        bgcolor: 'rgba(0,0,0,0.95)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        pr: { xs: 3, md: 6 },
        pl: { xs: 3, md: 'calc(280px + 24px)' },
        py: 4,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 4,
          flexWrap: 'wrap',
        }}
      >
        {/* About Us - existing content with updated styling */}
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{
              fontWeight: 600,
              color: '#ff0000',
              mb: 2,
              letterSpacing: '0.5px'
            }}
          >
            About Us
          </Typography>
          {['Company', 'Services', 'Expertise', 'Contact'].map((item) => (
            <Link
              href="#"
              key={item}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                mb: 0.5,
                display: 'block',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ff0000',
                  transform: 'translateX(5px)'
                }
              }}
            >
              {item}
            </Link>
          ))}
        </Box>

        {/* For You - existing content with updated styling */}
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{
              fontWeight: 600,
              color: '#ff0000',
              mb: 2,
              letterSpacing: '0.5px'
            }}
          >
            For You
          </Typography>
          {['Resources', 'FAQs', 'Terms', 'Privacy'].map((item) => (
            <Link
              href="#"
              key={item}
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                mb: 0.5,
                display: 'block',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: '#ff0000',
                  transform: 'translateX(5px)'
                }
              }}
            >
              {item}
            </Link>
          ))}
        </Box>

        {/* Follow Us - existing content with updated styling */}
        <Box>
          <Typography 
            variant="subtitle1" 
            sx={{
              fontWeight: 600,
              color: '#ff0000',
              mb: 2,
              letterSpacing: '0.5px'
            }}
          >
            Follow Us
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton 
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: '#ff0000',
                  bgcolor: 'rgba(255,0,0,0.1)'
                }
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton 
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              href="#" 
              sx={{
                color: 'rgba(255,255,255,0.7)',
                '&:hover': {
                  color: '#ff0000',
                  bgcolor: 'rgba(255,0,0,0.1)'
                }
              }}
            >
              <LinkedInIcon />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Bottom bar with updated styling */}
      <Box
        sx={{
          mt: 6,
          pt: 2,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Typography
          variant="caption"
          sx={{ 
            fontSize: '0.75rem',
            textAlign: isMobile ? 'center' : 'left',
            color: 'rgba(255,255,255,0.5)'
          }}
        >
          ©2025 RBM Software Inc. • All Rights Reserved
        </Typography>

        <Box
          component={motion.img}
          whileHover={{ scale: 1.05 }}
          src="/images/rbm-logo.svg"
          alt="RBM Logo"
          sx={{
            height: 30,
            filter: 'brightness(0) invert(1)',
            ml: isMobile ? 0 : 'auto',
            opacity: 0.7,
            transition: 'opacity 0.3s ease',
            '&:hover': {
              opacity: 1
            }
          }}
        />
      </Box>
    </Box>
  );
}