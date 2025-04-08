import ClientProviders from '@/components/ClientProvider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ClientOnly from '@/components/ClientOnly';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientProviders>
      <div className="flex h-screen">
        <ClientOnly>
          <Sidebar />
        </ClientOnly>
        <main className="flex-1">
          <Header />
          {children}
        </main>
      </div>
    </ClientProviders>
  );
}
