
import { Header } from '@/components/app/header';
import { Footer } from '@/components/app/footer';
import { AuthProvider } from '../auth-provider';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-8">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
