import ClientProviders from '@/components/ClientProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ClientOnly from '@/components/ClientOnly';
import { Toaster } from 'sonner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <ClientOnly>
          <Sidebar />
        </ClientOnly>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ClientProviders>
  );
}
