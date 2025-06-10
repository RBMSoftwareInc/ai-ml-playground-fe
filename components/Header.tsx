'use client';

import React, { useEffect, useState } from 'react';
import { AppBar, Box, Button, ToggleButton, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import ModeToggle from './ModeToggle';
import Link from "next/link";

const phrases = [
  '<RBM Soft e-Commerce AI/ML Arena>'
];

export default function Header() {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/setup/userinfo')
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEndSession = () => {
    // Optionally clear local storage or state
    router.push('/');
  };

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const delay = isDeleting ? 50 : 120;

    const timer = setTimeout(() => {
      const updatedText = isDeleting
        ? currentPhrase.substring(0, charIndex - 1)
        : currentPhrase.substring(0, charIndex + 1);

      setText(updatedText);

      if (!isDeleting && updatedText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), 1000);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setCharIndex(0);
      } else {
        setCharIndex(updatedText.length);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex]);

  return (
    <>
      {/* Header AppBar with white background */}
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <Toolbar>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <img
              src="/images/rbm-logo.svg"
              alt="RBM AI Playground"
              style={{ height: '40px', marginRight: '10px' }}
            />
            <Typography variant="h6" color="red" fontWeight="bold" fontSize='35px'>
              rbm software
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Typewriter Text Line */}
      <Box
        sx={{
          width: '100%',
          bgcolor: 'white',
          py: 1,
          textAlign: 'center',
          fontFamily: 'monospace',
          fontSize: '2.5rem',
          color: 'black',
          fontWeight: 'bold',
          minHeight: '30px',
        }}
      >
        {text}
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            width: '8px',
            height: '1em',
            bgcolor: 'black',
            ml: '2px',
            animation: 'blink 1s steps(2, start) infinite',
          }}
        />
      </Box>


      // Inside your AppBar or header
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap>🛒 E-Com AI Playground</Typography>
        <ModeToggle />
      </Toolbar>
    
      {/* Cursor blink effect */}
      <style jsx global>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </>

    
  );
}
