import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Summary {
  today_transactions: number;
  today_revenue: number;
  total_transactions: number;
  total_revenue: number;
  total_products: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: Summary }>("/transactions/stats/summary")
      .then((r) => setStats(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        {
          label: "Transaksi Hari Ini",
          value: stats.today_transactions,
          color: "border-blue-500",
          text: "text-blue-500",
          icon: "📋",
        },
        {
          label: "Pendapatan Hari Ini",
          value: `Rp ${Number(stats.today_revenue).toLocaleString("id")}`,
          color: "border-emerald-500",
          text: "text-emerald-500",
          icon: "💰",
        },
        {
          label: "Total Transaksi",
          value: stats.total_transactions,
          color: "border-violet-500",
          text: "text-violet-500",
          icon: "🧾",
        },
        {
          label: "Total Produk",
          value: stats.total_products,
          color: "border-amber-500",
          text: "text-amber-500",
          icon: "📦",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>
      {loading ? (
        <p className="text-slate-400">Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-xl p-5 border-l-4 ${card.color} shadow-sm`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <div className={`text-2xl font-bold ${card.text}`}>
                {card.value}
              </div>
              <div className="text-slate-500 text-sm mt-1">{card.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
