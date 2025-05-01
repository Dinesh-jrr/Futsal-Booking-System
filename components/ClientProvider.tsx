'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

type ClientProvidersProps = {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
    <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'green',
            color: 'white',
          },
        }}
      />
      <NextTopLoader />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
