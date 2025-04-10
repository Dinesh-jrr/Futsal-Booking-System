// app/layout.tsx
import './globals.css';
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <Toaster position="top-center" richColors /> */}
        {children}
      </body>
    </html>
  );
}
