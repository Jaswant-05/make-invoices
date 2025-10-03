'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
        <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}
            solutionChannel='GMP_devsite_samples_v3_rgmautocomplete'
        >
            {children}
        </APIProvider>
    </SessionProvider>
  );
};