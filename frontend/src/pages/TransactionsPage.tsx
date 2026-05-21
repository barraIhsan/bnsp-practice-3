import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
  id: number;
  invoice_no: string;
  cashier_name: string;
  total: number;
  paid: number;
  change_amount: number;
  created_at: string;
}
interface TransactionDetail extends Transaction {
  items: {
    id: number;
    product_name: string;
    qty: number;
    price: number;
    subtotal: number;
  }[];
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selected, setSelected] = useState<TransactionDetail | null>(null);

  useEffect(() => {
    api
      .get<{ data: Transaction[] }>("/transactions")
      .then((r) => setTransactions(r.data.data));
  }, []);

  const viewDetail = async (id: number) => {
    const { data } = await api.get<{ data: TransactionDetail }>(
      `/transactions/${id}`,
    );
    setSelected(data.data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">
        🧾 Riwayat Transaksi
      </h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              {[
                "Invoice",
                "Kasir",
                "Total",
                "Bayar",
                "Kembalian",
                "Waktu",
                "",
              ].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-mono text-blue-500 text-xs">
                  {t.invoice_no}
                </td>
                <td className="px-4 py-3">{t.cashier_name}</td>
                <td className="px-4 py-3 font-semibold">
                  Rp {Number(t.total).toLocaleString("id")}
                </td>
                <td className="px-4 py-3">
                  Rp {Number(t.paid).toLocaleString("id")}
                </td>
                <td className="px-4 py-3">
                  Rp {Number(t.change_amount).toLocaleString("id")}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {new Date(t.created_at).toLocaleString("id")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => viewDetail(t.id)}
                    className="px-3 py-1 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-md text-xs font-medium transition-colors"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="font-bold text-lg mb-1">Detail Transaksi</h2>
            <p className="text-slate-400 text-sm mb-5">{selected.invoice_no}</p>
            <table className="w-full text-sm mb-5">
              <thead className="bg-slate-50">
                <tr>
                  {["Produk", "Qty", "Harga", "Subtotal"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 text-left text-slate-500 font-semibold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {selected.items.map((item) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="px-3 py-2">{item.product_name}</td>
                    <td className="px-3 py-2">{item.qty}</td>
                    <td className="px-3 py-2">
                      Rp {Number(item.price).toLocaleString("id")}
                    </td>
                    <td className="px-3 py-2 font-semibold">
                      Rp {Number(item.subtotal).toLocaleString("id")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Rp {Number(selected.total).toLocaleString("id")}</span>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
