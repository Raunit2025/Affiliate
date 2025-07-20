// mern_project_1/src/layout/AppLayout.jsx
function AppLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* REMOVED px-4 py-6 from the main tag */}
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default AppLayout;