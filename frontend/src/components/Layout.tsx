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
  { to: "/users", label: "Kasir", icon: "👥", roles: ["admin"] }, // admin only
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-800 flex flex-col">
        <div className="px-6 py-5 border-b border-slate-700">
          <h2 className="text-sky-400 font-bold text-lg">🏪 KasirApp</h2>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navLinks
            .filter((link) => link.roles.includes(user?.role ?? ""))
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
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

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
