import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}
interface CartItem extends Product {
  qty: number;
}
interface Receipt {
  id: number;
  invoice_no: string;
  total: number;
  change: number;
}

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paid, setPaid] = useState("");
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get<{ data: Product[] }>(`/products?search=${search}`)
      .then((r) => setProducts(r.data.data));
  }, [search]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) setCart((prev) => prev.filter((i) => i.id !== id));
    else setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
  };

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const change = +paid - total;

  const handleCheckout = async () => {
    if (!paid || +paid < total) return alert("Uang tidak cukup");
    const items = cart.map((i) => ({
      product_id: i.id,
      qty: i.qty,
      price: i.price,
    }));
    const { data } = await api.post<{ data: Receipt }>("/transactions", {
      items,
      paid: +paid,
    });
    setReceipt(data.data);
    setCart([]);
    setPaid("");
    api
      .get<{ data: Product[] }>("/products")
      .then((r) => setProducts(r.data.data));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 h-[calc(100vh-4rem)]">
      {/* Products */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">🛒 Kasir</h1>
        <input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => p.stock > 0 && addToCart(p)}
              disabled={p.stock === 0}
              className="bg-white p-4 rounded-xl text-left shadow-sm border-2 border-transparent hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <div className="text-3xl mb-2">🍽️</div>
              <div className="font-semibold text-slate-800 text-sm">
                {p.name}
              </div>
              <div className="text-blue-500 font-bold text-sm mt-1">
                Rp {Number(p.price).toLocaleString("id")}
              </div>
              <div className="text-slate-400 text-xs mt-1">Stok: {p.stock}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col">
        <h2 className="font-bold text-slate-800 text-lg mb-4">🧾 Keranjang</h2>
        <div className="flex-1 overflow-y-auto space-y-2">
          {cart.length === 0 && (
            <p className="text-slate-400 text-sm text-center mt-10">
              Keranjang kosong
            </p>
          )}
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-slate-50 rounded-lg p-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{item.name}</div>
                <div className="text-slate-400 text-xs">
                  Rp {Number(item.price).toLocaleString("id")}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateQty(item.id, item.qty - 1)}
                  className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{item.qty}</span>
                <button
                  onClick={() => updateQty(item.id, item.qty + 1)}
                  className="w-6 h-6 bg-slate-200 hover:bg-slate-300 rounded text-sm font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
          <div className="flex justify-between font-bold text-slate-800">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id")}</span>
          </div>
          <input
            type="number"
            placeholder="Uang bayar..."
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {paid && +paid >= total && (
            <div className="text-emerald-600 text-sm font-medium">
              Kembalian: Rp {change.toLocaleString("id")}
            </div>
          )}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
          >
            Bayar
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-80 text-center shadow-2xl">
            <div className="text-5xl mb-3">✅</div>
            <h2 className="text-emerald-600 font-bold text-xl mb-1">
              Pembayaran Berhasil!
            </h2>
            <p className="text-slate-400 text-sm">{receipt.invoice_no}</p>
            <p className="text-2xl font-bold text-slate-800 my-4">
              Rp {Number(receipt.total).toLocaleString("id")}
            </p>
            <p className="text-slate-500 text-sm">
              Kembalian: Rp {Number(receipt.change).toLocaleString("id")}
            </p>
            <button
              onClick={() => setReceipt(null)}
              className="mt-6 w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
            >
              Transaksi Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
