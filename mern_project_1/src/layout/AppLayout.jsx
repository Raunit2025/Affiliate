
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}

export default AppLayout;
