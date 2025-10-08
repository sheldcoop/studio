
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container flex flex-1 items-center justify-center py-4 md:py-8">
      {children}
    </div>
  );
}
