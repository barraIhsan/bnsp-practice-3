import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const navLinks = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: "📊",
    roles: ["admin", "kasir"],
  },
  { to: "/cashier", label: "Kasir", icon: "🛒", roles: ["admin", "kasir"] },
  { to: "/products", label: "Produk", icon: "📦", roles: ["admin", "kasir"] },
  {
    to: "/transactions",
    label: "Transaksi",
    icon: "🧾",
    roles: ["admin", "kasir"],
  },
  { to: "/users", label: "Pengguna", icon: "👥", roles: ["admin"] },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const filteredLinks = navLinks.filter((link) =>
    link.roles.includes(user?.role ?? ""),
  );

  const Sidebar = () => (
    <aside className="w-56 bg-slate-800 flex flex-col h-full">
      <div className="px-6 py-5 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-sky-400 font-bold text-lg">🏪 KasirApp</h2>
        {/* close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sky-400 text-slate-900"
                  : "text-slate-300 hover:bg-slate-700"
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <p className="text-slate-400 text-xs mb-1">{user?.username}</p>
        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="mt-3 w-full py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col w-56 fixed inset-y-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-56 transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile topbar */}
        <header className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-600 hover:text-slate-900 text-xl"
          >
            ☰
          </button>
          <span className="font-bold text-slate-800">🏪 KasirApp</span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
