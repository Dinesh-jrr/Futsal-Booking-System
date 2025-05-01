// app/layout.tsx
import "./globals.css";
import ClientProviders from "@/components/ClientProvider";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-center"  toastOptions={{
    style: {
      background: 'green',color:"white"
    },
  }}/>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
