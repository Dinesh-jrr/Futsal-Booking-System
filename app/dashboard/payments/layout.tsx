
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="p-4">
        <NextTopLoader />
        <div className="flex h-[calc(100vh-2rem)] bg-background rounded-xl overflow-hidden">
          <Sidebar />
          <main className="flex-1 bg-white rounded-r-xl overflow-y-auto">
            <Header />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
