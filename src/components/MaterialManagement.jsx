import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import DashboardLayout from "./DashboardLayout";
import { Boxes, AlertTriangle, TrendingUp, TrendingDown, Plus, Trash2, ClipboardList } from "lucide-react";

const DEFAULT_MATERIALS = [
  { id: "1", name: "Cement", unit: "Bags", stock: 120, reorderLimit: 50 },
  { id: "2", name: "Sand", unit: "Tons", stock: 35, reorderLimit: 15 },
  { id: "3", name: "Steel Bars", unit: "Tons", stock: 8, reorderLimit: 10 },
  { id: "4", name: "Bricks", unit: "Pcs", stock: 8000, reorderLimit: 2000 },
  { id: "5", name: "Aggregates", unit: "Tons", stock: 22, reorderLimit: 10 },
];

export default function MaterialManagement() {
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem("materials");
    return saved ? JSON.parse(saved) : DEFAULT_MATERIALS;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("material_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [newMaterialForm, setNewMaterialForm] = useState({
    name: "",
    unit: "Bags",
    reorderLimit: "",
    initialStock: "",
  });

  const [transactionForm, setTransactionForm] = useState({
    materialId: "",
    type: "IN", // IN = Incoming, OUT = Outgoing
    quantity: "",
    note: "",
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem("material_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Set default material in transaction dropdown
  useEffect(() => {
    if (materials.length > 0 && !transactionForm.materialId) {
      setTransactionForm((prev) => ({ ...prev, materialId: materials[0].id }));
    }
  }, [materials, transactionForm.materialId]);

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const { name, unit, reorderLimit, initialStock } = newMaterialForm;
    if (!name || !reorderLimit || !initialStock) return;

    const newMat = {
      id: Date.now().toString(),
      name,
      unit,
      stock: parseFloat(initialStock),
      reorderLimit: parseFloat(reorderLimit),
    };

    setMaterials((prev) => [...prev, newMat]);
    setNewMaterialForm({
      name: "",
      unit: "Bags",
      reorderLimit: "",
      initialStock: "",
    });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const { materialId, type, quantity, note } = transactionForm;
    if (!materialId || !quantity || parseFloat(quantity) <= 0) return;

    const qty = parseFloat(quantity);
    const targetMat = materials.find((m) => m.id === materialId);
    if (!targetMat) return;

    // Check stock if outgoing
    if (type === "OUT" && targetMat.stock < qty) {
      alert(`Insufficient stock! Current stock of ${targetMat.name} is only ${targetMat.stock} ${targetMat.unit}.`);
      return;
    }

    // Update stock level
    setMaterials((prev) =>
      prev.map((m) => {
        if (m.id === materialId) {
          const newStock = type === "IN" ? m.stock + qty : m.stock - qty;
          return { ...m, stock: newStock };
        }
        return m;
      })
    );

    // Record transaction log
    const newTx = {
      id: Date.now().toString(),
      materialId,
      materialName: targetMat.name,
      unit: targetMat.unit,
      type,
      quantity: qty,
      date: new Date().toLocaleString(),
      note: note || "N/A",
    };

    setTransactions((prev) => [newTx, ...prev]);
    setTransactionForm((prev) => ({
      ...prev,
      quantity: "",
      note: "",
    }));
  };

  const handleDeleteMaterial = (id) => {
    if (window.confirm("Are you sure? This will delete the material from inventory.")) {
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      // Optionally clean up transactions
      setTransactions((prev) => prev.filter((tx) => tx.materialId !== id));
    }
  };

  const exportToExcel = () => {
    // Generate Sheets
    const stockWorksheet = XLSX.utils.json_to_sheet(
      materials.map((m) => ({
        "Material Name": m.name,
        Unit: m.unit,
        "Current Stock": m.stock,
        "Reorder Threshold": m.reorderLimit,
        Status: m.stock <= m.reorderLimit ? "LOW STOCK" : "Healthy",
      }))
    );

    const logWorksheet = XLSX.utils.json_to_sheet(
      transactions.map((tx) => ({
        Date: tx.date,
        Material: tx.materialName,
        Type: tx.type === "IN" ? "IN (Restock)" : "OUT (Usage)",
        Quantity: tx.quantity,
        Unit: tx.unit,
        Note: tx.note,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, stockWorksheet, "Stock Levels");
    XLSX.utils.book_append_sheet(workbook, logWorksheet, "Transaction Logs");
    XLSX.writeFile(workbook, "material_inventory.xlsx");
  };

  const lowStockCount = materials.filter(m => m.stock <= m.reorderLimit).length;
  const incomingCount = transactions.filter(t => t.type === "IN").length;
  const outgoingCount = transactions.filter(t => t.type === "OUT").length;

  return (
    <DashboardLayout>
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Material & Inventory Tracker</h2>
          <p className="text-slate-500 text-sm">Monitor stock levels, log issues/restocks, and receive low-inventory alerts.</p>
        </div>
        <button
          onClick={exportToExcel}
          className="self-start md:self-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-sm hover:shadow transition-all duration-200 text-sm flex items-center gap-2 cursor-pointer"
        >
          Export Stock Report
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Items</span>
            <span className="text-xl font-bold text-slate-800">{materials.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className={`p-3 rounded-xl ${lowStockCount > 0 ? "bg-rose-50 text-rose-600 animate-pulse" : "bg-slate-50 text-slate-400"}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</span>
            <span className={`text-xl font-bold ${lowStockCount > 0 ? "text-rose-600" : "text-slate-800"}`}>
              {lowStockCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Restocks (IN)</span>
            <span className="text-xl font-bold text-slate-800">{incomingCount} times</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Usages (OUT)</span>
            <span className="text-xl font-bold text-slate-800">{outgoingCount} times</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side: Stocks & Transaction Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Inventory Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-blue-600" /> Current Stock Inventory
              </h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-100">
                {materials.length} Items Listed
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-xs uppercase">
                    <th className="p-4">Material Name</th>
                    <th className="p-4">Current Stock</th>
                    <th className="p-4">Unit</th>
                    <th className="p-4">Reorder Limit</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {materials.map((m) => {
                    const isLow = m.stock <= m.reorderLimit;
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{m.name}</td>
                        <td className={`p-4 font-extrabold ${isLow ? "text-rose-600" : "text-slate-800"}`}>
                          {m.stock}
                        </td>
                        <td className="p-4 text-slate-500 text-xs font-semibold">{m.unit}</td>
                        <td className="p-4 text-slate-650 font-bold">{m.reorderLimit}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`inline-block px-3 py-0.5 text-xs font-bold rounded-full ${
                              isLow
                                ? "bg-rose-50 text-rose-700 border border-rose-100 animate-pulse"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {isLow ? "Low Stock" : "Healthy"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteMaterial(m.id)}
                            className="text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center justify-end gap-1 cursor-pointer ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction History Log Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> Recent Transactions Log
              </h3>
            </div>
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm italic">
                No inventory transactions logged yet. Use the form to restock or issue material.
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[300px]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-550 font-bold uppercase">
                      <th className="p-3">Time</th>
                      <th className="p-3">Material</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Quantity</th>
                      <th className="p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-750 font-medium font-sans">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-400 whitespace-nowrap">{tx.date}</td>
                        <td className="p-3 font-bold text-slate-800">{tx.materialName}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              tx.type === "IN" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                            }`}
                          >
                            {tx.type === "IN" ? "IN" : "OUT"}
                          </span>
                        </td>
                        <td className="p-3 font-extrabold text-slate-800">
                          {tx.quantity} <span className="text-slate-400 font-normal">{tx.unit}</span>
                        </td>
                        <td className="p-3 text-slate-500 italic max-w-[150px] truncate" title={tx.note}>
                          {tx.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="space-y-6 animate-fade-in">
          {/* Log Transaction Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Log Material Flow
            </h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Select Material
                </label>
                <select
                  value={transactionForm.materialId}
                  onChange={(e) => setTransactionForm({ ...transactionForm, materialId: e.target.value })}
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  required
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.stock} {m.unit} avail)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Flow Direction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionForm({ ...transactionForm, type: "IN" })}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                      transactionForm.type === "IN"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-350 shadow-sm"
                        : "border-slate-200 text-slate-450 hover:bg-slate-50"
                    }`}
                  >
                    📥 IN (Restock)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionForm({ ...transactionForm, type: "OUT" })}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                      transactionForm.type === "OUT"
                        ? "bg-amber-50 text-amber-700 border-amber-355 shadow-sm"
                        : "border-slate-200 text-slate-455 hover:bg-slate-50"
                    }`}
                  >
                    📤 OUT (Issue/Usage)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  step="any"
                  value={transactionForm.quantity}
                  onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                  placeholder="e.g. 50"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Note / Destination
                </label>
                <input
                  type="text"
                  value={transactionForm.note}
                  onChange={(e) => setTransactionForm({ ...transactionForm, note: e.target.value })}
                  placeholder="e.g. Issued to Block B concrete work"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                Log Transaction
              </button>
            </form>
          </div>

          {/* Add New Material Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">
              Add New Material Type
            </h3>
            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-550 mb-1">
                  Material Name
                </label>
                <input
                  type="text"
                  value={newMaterialForm.name}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, name: e.target.value })}
                  placeholder="e.g. PVC Pipes"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-550 mb-1">
                    Unit
                  </label>
                  <select
                    value={newMaterialForm.unit}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, unit: e.target.value })}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Bags">Bags</option>
                    <option value="Tons">Tons</option>
                    <option value="Pcs">Pcs</option>
                    <option value="Meters">Meters</option>
                    <option value="Liters">Liters</option>
                    <option value="Brass">Brass</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-550 mb-1">
                    Initial Stock
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newMaterialForm.initialStock}
                    onChange={(e) => setNewMaterialForm({ ...newMaterialForm, initialStock: e.target.value })}
                    placeholder="e.g. 100"
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-550 mb-1">
                  Reorder Alert Limit
                </label>
                <input
                  type="number"
                  step="any"
                  value={newMaterialForm.reorderLimit}
                  onChange={(e) => setNewMaterialForm({ ...newMaterialForm, reorderLimit: e.target.value })}
                  placeholder="e.g. 20 (Triggers Alert)"
                  className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-blue-900 to-slate-900 hover:from-black hover:to-black text-white rounded-xl font-bold text-sm shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                Register Material
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
