import React, { useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';

const ContentRenderer = ({ content }) => {
  const contentRef = useRef(null);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (contentRef.current) {
        const { offsetWidth, offsetHeight } = contentRef.current;
        setDimensions({ width: offsetWidth, height: offsetHeight });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [content]);

  const { type, title, content: contentData, style } = content || {};
  const displayTitle = title || 'Content';
  const displayDescription = contentData?.text || contentData?.description || '';

  return (
    <Box ref={contentRef} sx={{ ...style }}>
      <Typography variant="h6">{displayTitle}</Typography>
      {contentData?.url && <img src={contentData.url} alt={displayTitle} style={{ maxWidth: '100%' }} />}
      {displayDescription && <Typography variant="body2">{displayDescription}</Typography>}
      {type === 'Widget' && contentData?.text && <Typography variant="body2">{contentData.text}</Typography>}
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Dimensions: {dimensions.width}px x {dimensions.height}px
      </Typography>
    </Box>
  );
};

export default ContentRenderer;