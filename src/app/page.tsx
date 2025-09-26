
import AppLayout from './(app)/layout';
import DashboardPage from './(app)/dashboard/page';

export default function RootPage() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
