import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}
const emptyForm = { name: "", category: "", price: 0, stock: 0 };

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () =>
    api
      .get<{ data: Product[] }>(`/products?search=${search}`)
      .then((r) => setProducts(r.data.data));

  useEffect(() => {
    load();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editId) await api.put(`/products/${editId}`, form);
    else await api.post("/products", form);
    setShowModal(false);
    setForm(emptyForm);
    setEditId(null);
    load();
    setLoading(false);
  };

  const handleEdit = (p: Product) => {
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      stock: p.stock,
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus produk ini?")) return;
    await api.delete(`/products/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Produk</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditId(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg text-sm transition-colors"
        >
          + Tambah Produk
        </button>
      </div>

      <input
        placeholder="Cari produk..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              {["Nama", "Kategori", "Harga", "Stok", "Aksi"].map((h) => (
                <th key={h} className="px-4 py-3 text-left">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-slate-500">{p.category}</td>
                <td className="px-4 py-3">
                  Rp {Number(p.price).toLocaleString("id")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.stock > 10 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                  >
                    {p.stock}
                  </span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-3 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-medium hover:bg-amber-200 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-3 py-1 bg-red-100 text-red-600 rounded-md text-xs font-medium hover:bg-red-200 transition-colors"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold mb-6">
              {editId ? "Edit" : "Tambah"} Produk
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Nama Produk", key: "name", type: "text" },
                { label: "Kategori", key: "category", type: "text" },
                { label: "Harga", key: "price", type: "number" },
                { label: "Stok", key: "stock", type: "number" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(form as Record<string, string | number>)[f.key]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        [f.key]:
                          f.type === "number"
                            ? +e.target.value
                            : e.target.value,
                      })
                    }
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-colors"
                >
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
