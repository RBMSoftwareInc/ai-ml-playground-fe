

import React, { useState } from 'react';
import axios from 'axios';

export default function WebAuthnLogin() {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [message, setMessage] = useState('');

  const bufferDecode = (value) => Uint8Array.from(atob(value.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const bufferEncode = (value) => btoa(String.fromCharCode(...new Uint8Array(value))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const handleStart = async () => {
    try {
      const url = mode === 'register' ? '/register/options' : '/login/options';
      const res = await axios.post(url, { username });
      const options = res.data;

      if (mode === 'register') {
        options.challenge = bufferDecode(options.challenge);
        options.user.id = bufferDecode(options.user.id);
        const cred = await navigator.credentials.create({ publicKey: options });

        const credential = {
          id: cred.id,
          rawId: bufferEncode(cred.rawId),
          type: cred.type,
          response: {
            attestationObject: bufferEncode(cred.response.attestationObject),
            clientDataJSON: bufferEncode(cred.response.clientDataJSON)
          }
        };

        await axios.post('/register/verify', credential);
        setMessage('Registered successfully!');
      } else {
        options.challenge = bufferDecode(options.challenge);
        options.allowCredentials = options.allowCredentials.map(cred => ({
          ...cred,
          id: bufferDecode(cred.id)
        }));

        const assertion = await navigator.credentials.get({ publicKey: options });

        const credential = {
          id: assertion.id,
          rawId: bufferEncode(assertion.rawId),
          type: assertion.type,
          response: {
            authenticatorData: bufferEncode(assertion.response.authenticatorData),
            clientDataJSON: bufferEncode(assertion.response.clientDataJSON),
            signature: bufferEncode(assertion.response.signature),
            userHandle: assertion.response.userHandle ? bufferEncode(assertion.response.userHandle) : null,
          }
        };

        await axios.post('/login/verify', credential);
        setMessage('Logged in successfully!');
      }
    } catch (error) {
      console.error(error);
      setMessage('Operation failed.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>.comIQ Studio Biometric Login</h2>
      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <div style={{ margin: '10px 0' }}>
        <button onClick={() => setMode('register')}>Register</button>
        <button onClick={() => setMode('login')}>Login</button>
      </div>
      <button onClick={handleStart}>{mode === 'register' ? 'Start Registration' : 'Start Login'}</button>
      <p>{message}</p>
    </div>
  );
}
