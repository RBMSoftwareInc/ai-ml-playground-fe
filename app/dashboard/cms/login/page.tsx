"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { grey, red } from '@mui/material/colors';
import Header from '../../../../components/cms/Header';
import Footer from '../../../../components/cms/Footer';


const headerHeight = 80;
const footerHeight = 40;

export default function IQLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState('conventional'); // 'conventional' or 'biometric'
  const [authMode, setAuthMode] = useState('login'); // 'register' or 'login' for biometric
  const [message, setMessage] = useState('');

  const bufferDecode = (value) => {
    const base64 = value
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(value.length + (4 - (value.length % 4)) % 4, '=');
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  };
  
  const bufferEncode = (value) =>
    btoa(String.fromCharCode(...new Uint8Array(value)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

  const handleConventionalLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/cms/auth/conventional/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed.');
      setMessage(data.message);
      router.push('/dashboard/cms');
    } catch (error) {
      setMessage(error.message || 'Login failed.');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const url = authMode === 'register' ? '/register/options' : '/login/options';
      const response = await fetch(`http://localhost:5000/api/v1/cms/auth${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const options = await response.json();
      if (!response.ok) throw new Error(options.message || 'Failed to fetch options.');

      if (authMode === 'register') {
        const publicKey = {
          ...options.public_key,
          challenge: bufferDecode(options.public_key.challenge),
          user: {
            ...options.public_key.user,
            id: bufferDecode(options.public_key.user.id),
            displayName: options.public_key.user.display_name,
          },
          pubKeyCredParams: options.public_key.pub_key_cred_params || options.public_key.pubKeyCredParams,
          excludeCredentials: options.public_key.exclude_credentials || options.public_key.excludeCredentials,
          authenticatorSelection: options.public_key.authenticator_selection || options.public_key.authenticatorSelection,
        };
      
        // Fix nested authenticatorSelection fields
        if (publicKey.authenticatorSelection) {
          publicKey.authenticatorSelection = {
            ...publicKey.authenticatorSelection,
            authenticatorAttachment: publicKey.authenticatorSelection.authenticator_attachment || publicKey.authenticatorSelection.authenticatorAttachment,
            requireResidentKey: publicKey.authenticatorSelection.require_resident_key || publicKey.authenticatorSelection.requireResidentKey,
            residentKey: publicKey.authenticatorSelection.resident_key || publicKey.authenticatorSelection.residentKey,
            userVerification: publicKey.authenticatorSelection.user_verification || publicKey.authenticatorSelection.userVerification,
          };
        }

        const credential = await navigator.credentials.create({ publicKey });

       // Step 4: Prepare the credential for the server
      const credentialData = {
        id: credential.id,
        rawId: btoa(String.fromCharCode(...new Uint8Array(credential.rawId))),
        type: credential.type, // Add the type field
        response: {
          clientDataJSON: btoa(String.fromCharCode(...new Uint8Array(credential.response.clientDataJSON))),
          attestationObject: btoa(String.fromCharCode(...new Uint8Array(credential.response.attestationObject))),
        },
        state_id: options.state_id,
      };
        const verifyResponse = await fetch('http://localhost:5000/api/v1/cms/auth/register/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentialData),
          credentials: 'include',
        });
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) throw new Error(verifyData.message || 'Registration failed.');
        setMessage(verifyData.message);
      } else {
        const publicKey = {
          ...options,
          challenge: bufferDecode(options.challenge),
          allowCredentials: options.allowCredentials.map((cred) => ({
            ...cred,
            id: bufferDecode(cred.id),
          })),
        };

        const assertion = await navigator.credentials.get({ publicKey });

        const credential = {
          id: assertion.id,
          rawId: bufferEncode(assertion.rawId),
          type: assertion.type,
          response: {
            authenticatorData: bufferEncode(assertion.response.authenticatorData),
            clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
            signature: bufferEncode(assertion.response.signature),
            userHandle: assertion.response.userHandle
              ? bufferEncode(assertion.response.userHandle)
              : null,
          },
          state_id: options.state_id,
        };

        const verifyResponse = await fetch('http://localhost:5000/api/v1/cms/auth/login/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credential),
          credentials: 'include',
        });
        const verifyData = await verifyResponse.json();
        if (!verifyResponse.ok) throw new Error(verifyData.message || 'Login failed.');
        setMessage(verifyData.message);
        router.push('/dashboard/cms');
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message || 'Biometric authentication failed.');
    }
  };

  const handleSubmit = () => {
    if (loginMode === 'conventional') {
      handleConventionalLogin();
    } else {
      handleBiometricAuth();
    }
  };

  const handleLogout = () => {
    setMessage('Logged out.');
    setUsername('');
    setPassword('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header onLogout={handleLogout} />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          minHeight: `calc(100vh - ${headerHeight + footerHeight}px)`,
        }}
      >
        {/* Left Panel - Image */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Box
            component="img"
            src="/images/rocketry.png"
            alt="Content Hub Illustration"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              opacity: 0.9,
            }}
          />
        </Box>

        {/* Right Panel - Login Form */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 400,
              p: 4,
              bgcolor: '#f9f9f9',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="h5" gutterBottom color={grey[800]} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              Login to .comIQ Studio
            </Typography>
            <Typography variant="body2" color={grey[600]} textAlign="center" mb={3}>
              Sign in with your credentials or biometric authentication
            </Typography>

            <ToggleButtonGroup
              value={loginMode}
              exclusive
              onChange={(e, newMode) => newMode && setLoginMode(newMode)}
              sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
            >
              <ToggleButton value="conventional">Conventional</ToggleButton>
              <ToggleButton value="biometric">Biometric</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Username or Email"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputLabel-root': { color: grey[700] },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: grey[400] },
                  '&:hover fieldset': { borderColor: grey[600] },
                  '&.Mui-focused fieldset': { borderColor: grey[800] },
                },
              }}
            />

            {loginMode === 'conventional' && (
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiInputLabel-root': { color: grey[700] },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: grey[400] },
                    '&:hover fieldset': { borderColor: grey[600] },
                    '&.Mui-focused fieldset': { borderColor: grey[800] },
                  },
                }}
              />
            )}

            {loginMode === 'biometric' && (
              <ToggleButtonGroup
                value={authMode}
                exclusive
                onChange={(e, newMode) => newMode && setAuthMode(newMode)}
                sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}
              >
                <ToggleButton value="register">Register</ToggleButton>
                <ToggleButton value="login">Login</ToggleButton>
              </ToggleButtonGroup>
            )}

            <Button
              variant="outlined"
              size="small"
              fullWidth
              onClick={handleSubmit}
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
              {loginMode === 'conventional'
                ? 'Login'
                : authMode === 'register'
                ? 'Register Biometric'
                : 'Login with Biometric'}
            </Button>

            {message && (
              <Typography
                variant="body2"
                color={message.includes('failed') ? 'error' : 'success'}
                textAlign="center"
                sx={{ mt: 2 }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}