export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex-1 py-4 md:py-8">{children}</div>
  );
}
