'use client';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import NextTopLoader from 'nextjs-toploader';

type ClientProvidersProps = {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <>
      <NextTopLoader />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
