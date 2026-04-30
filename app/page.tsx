'use client';

import { useState } from 'react';
import DojahSdk from '@/components/DojahSdk';

const demoUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  userId: 'user-123456',
};

export default function Home() {
  const [shouldRenderDojah, setShouldRenderDojah] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  const handleDojahSubmit = (data?: unknown) => {
    console.log('Dojah SDK Success:', data);
    setStatus({
      type: 'success',
      message: 'KYC verification completed successfully!',
    });
  };

  const handleDojahError = (err: unknown) => {
    console.error('Dojah SDK Error:', err);
    setStatus({
      type: 'error',
      message: `KYC verification failed: ${JSON.stringify(err)}`,
    });
  };

  const handleDojahClose = (err?: unknown) => {
    console.log('Dojah SDK Closed:', err);
    setStatus({
      type: 'info',
      message: 'KYC verification was closed',
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Dojah KYC Demo</h1>
        <p className="subtitle">Capacitor + Next.js Integration</p>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0, marginBottom: 16 }}>Demo User</h3>
        <div className="user-info">
          <div className="user-info-item">
            <span className="user-info-label">First Name</span>
            <span className="user-info-value">{demoUser.firstName}</span>
          </div>
          <div className="user-info-item">
            <span className="user-info-label">Last Name</span>
            <span className="user-info-value">{demoUser.lastName}</span>
          </div>
          <div className="user-info-item">
            <span className="user-info-label">Email</span>
            <span className="user-info-value">{demoUser.email}</span>
          </div>
        </div>
      </div>

      <button
        className="button button-primary"
        onClick={() => setShouldRenderDojah(true)}
        disabled={shouldRenderDojah}
      >
        {shouldRenderDojah ? 'Dojah SDK Running...' : 'Launch Dojah KYC'}
      </button>

      {status && (
        <div className={`status status-${status.type}`}>{status.message}</div>
      )}

      <DojahSdk
        shouldRender={shouldRenderDojah}
        setShouldRender={setShouldRenderDojah}
        userData={demoUser}
        onSubmit={handleDojahSubmit}
        onError={handleDojahError}
        onClose={handleDojahClose}
      />
    </div>
  );
}