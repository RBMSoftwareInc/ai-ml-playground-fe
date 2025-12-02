'use client';

import { useState } from 'react';
import FormWrapper from '../FormWrapper';
import GenericTheory from '../forms/GenericTheory';
import DatasetViewer from '../forms/DatasetViewer';
import InsightsPanel from '../forms/InsightsPanel';
import CopilotPanel from '../forms/AskGene';
import DemoPlayer from '../forms/DemoPlayer';
import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';
import { apiFetch, assetBaseUrl } from '../../lib/api';

const vssTheory = `
Visual similarity search uses deep visual embeddings so customers can shop by inspiration.
Keep embeddings fresh for new drops, normalize backgrounds, and blend metadata filters (price, size, availability)
to keep results actionable.
`;

function UploadForm({
  onUpload,
  loading,
  setFile,
  fileName,
}: {
  onUpload: () => void;
  loading: boolean;
  setFile: (file: File | null) => void;
  fileName: string | null;
}) {
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 4,
        border: '1px dashed rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          border: '1px dashed rgba(255,255,255,0.2)',
          p: 4,
          textAlign: 'center',
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Drop an inspiration image
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Upload PNG/JPG up to 5 MB. We’ll extract embeddings and return visually similar catalog picks.
        </Typography>
        <Button
          component="label"
          variant="outlined"
          sx={{ mt: 3, borderRadius: 999, px: 4 }}
        >
          Choose file
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0] || null;
              setFile(file);
            }}
          />
        </Button>
        {fileName && (
          <Typography variant="caption" display="block" sx={{ mt: 2, color: 'rgba(255,255,255,0.7)' }}>
            {fileName}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        disabled={loading}
        onClick={onUpload}
        sx={{ width: '100%', py: 1.5, fontWeight: 600 }}
      >
        {loading ? 'Searching...' : '🔍 Find Similar Looks'}
      </Button>
    </Paper>
  );
}

function SimilarResults({ images }: { images: string[] }) {
  if (!images.length) {
    return (
      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <Typography color="text.secondary">Upload a reference image to see visually similar catalog items.</Typography>
      </Paper>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 2,
      }}
    >
      {images.map((img, index) => (
        <Paper
          key={index}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box
            component="img"
            src={img.startsWith('http') ? img : `${assetBaseUrl}/${img.replace(/^\/+/, '')}`}
            alt={`similar-${index}`}
            sx={{ width: '100%', height: 180, objectFit: 'cover' }}
          />
        </Paper>
      ))}
    </Box>
  );
}

export default function VisualSimilarityPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const data = await apiFetch('/api/v1/vss/upload', {
        method: 'POST',
        body: formData,
      });
      setImages(data.similar_images || []);
    } catch (error) {
      console.error('Visual search failed', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormWrapper
      title="Visual Similarity Search"
      subtitle="Upload inspiration images and instantly surface visually similar products from your catalog."
      metaLabel="PRODUCT DISCOVERY"
    >
      {{
        form: (
          <UploadForm
            onUpload={handleUpload}
            loading={loading}
            setFile={(f) => {
              setFile(f);
              setFileName(f?.name || null);
            }}
            fileName={fileName}
          />
        ),
        result: <SimilarResults images={images} />,
        theory: <GenericTheory content={vssTheory} />,
        dataset: <DatasetViewer />,
        insights: <InsightsPanel />,
        ask: <CopilotPanel contextType="vss" />,
        demo: <DemoPlayer />,
      }}
    </FormWrapper>
  );
}