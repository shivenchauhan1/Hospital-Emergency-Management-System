import React, { useState } from 'react';
import { ShoppingBag, RotateCcw, RotateCw, PlusCircle, Trash2, UserPlus, PlayCircle, Percent, Sparkles, Terminal } from 'lucide-react';

export default function CartInteractiveApp({ engine, onStateChange }) {
  const [selectedProdId, setSelectedProdId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('Alice');
  const [discountInput, setDiscountInput] = useState(15);
  const [activeDiscountRate, setActiveDiscountRate] = useState(0);

  const handleAddToCart = () => {
    engine.addToCart(parseInt(selectedProdId), parseInt(quantity));
    onStateChange();
  };

  const handleRemoveLast = () => {
    engine.removeLastItem();
    onStateChange();
  };

  const handleUndo = () => {
    engine.undoAction();
    onStateChange();
  };

  const handleRedo = () => {
    engine.redoAction();
    onStateChange();
  };

  const handleEnqueueCustomer = () => {
    if (customerName) {
      engine.enqueueCustomer(customerName);
      onStateChange();
      setCustomerName('');
    }
  };

  const handleProcessCheckout = () => {
    engine.processCheckout();
    onStateChange();
  };

  const handleAddDiscount = () => {
    if (discountInput > 0) {
      engine.addDiscount(parseInt(discountInput));
      onStateChange();
    }
  };

  const handleApplyBestDiscount = () => {
    const rate = engine.applyBestDiscount();
    if (rate !== null) {
      setActiveDiscountRate(rate);
    }
    onStateChange();
  };

  const subtotal = engine.getCartTotal();
  const discountAmount = Math.round((subtotal * activeDiscountRate) / 100);
  const grandTotal = subtotal - discountAmount;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Menu Controls & Forms */}
      <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              Interactive Terminal & Menu Controls
            </span>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-cyan-400" />
              Cart System Menu Operations
            </h2>
          </div>
          <button
            onClick={() => {
              engine.reset();
              setActiveDiscountRate(0);
              onStateChange();
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset System
          </button>
        </div>

        {/* Menu Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Action 1: Add to Cart */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase">
              <PlusCircle className="w-4 h-4" /> 1. Add to Cart (Hashmap + List)
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Product:</label>
                <select
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  {Array.from(engine.catalog.values()).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-semibold">Quantity:</label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
                />
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
            >
              Execute: addToCart(id, qty)
            </button>
          </div>

          {/* Action 2: Undo & Redo (Stacks) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase">
              <RotateCcw className="w-4 h-4" /> 4 & 5. Undo / Redo (Stack Operations)
            </h4>
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Undo Action
              </button>
              <button
                onClick={handleRedo}
                className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCw className="w-3.5 h-3.5" /> Redo Action
              </button>
            </div>
            <button
              onClick={handleRemoveLast}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" /> 2. Remove Last Item
            </button>
          </div>

          {/* Action 3: Checkout Queue */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
              <UserPlus className="w-4 h-4" /> 6 & 7. Checkout Queue (FIFO Queue)
            </h4>
            <div className="flex gap-2 text-xs">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
              <button
                onClick={handleEnqueueCustomer}
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Enqueue
              </button>
            </div>
            <button
              onClick={handleProcessCheckout}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5"
            >
              <PlayCircle className="w-3.5 h-3.5" /> Process Next FIFO Checkout
            </button>
          </div>

          {/* Action 4: Discount Priority Queue */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 uppercase">
              <Percent className="w-4 h-4" /> 8 & 9. Discount Engine (Max-Heap)
            </h4>
            <div className="flex gap-2 text-xs">
              <input
                type="number"
                min={5}
                max={50}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200"
              />
              <button
                onClick={handleAddDiscount}
                className="flex-1 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs"
              >
                Add Discount %
              </button>
            </div>
            <button
              onClick={handleApplyBestDiscount}
              className="w-full py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/40 text-purple-200 border border-purple-500/30 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Apply Best Discount (Max-Heap Top)
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Cart Contents & Output Terminal */}
      <div className="lg:col-span-1 space-y-6">
        {/* Cart Contents Panel */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-3">
            <span>3. View Cart Summary</span>
            <span className="text-xs font-mono text-cyan-400">{engine.cart.length} Items</span>
          </h3>

          <div className="space-y-2 text-xs font-mono max-h-48 overflow-y-auto">
            {engine.cart.length === 0 ? (
              <p className="text-slate-500 text-center py-6 italic">(Cart is currently empty)</p>
            ) : (
              engine.cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div>
                    <p className="font-bold text-slate-200">{item.product.name}</p>
                    <p className="text-[10px] text-slate-500">ID: {item.product.id} • ₹{item.product.price} each</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-cyan-400">₹{item.product.price * item.quantity}</p>
                    <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-slate-800 pt-3 space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            {activeDiscountRate > 0 && (
              <div className="flex justify-between text-purple-400 font-semibold">
                <span>Max Discount ({activeDiscountRate}%):</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-white border-t border-slate-800 pt-2">
              <span>Grand Total:</span>
              <span className="text-cyan-400">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* C++ Console Log Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-cyan-400 border-b border-slate-800 pb-2">
            <Terminal className="w-4 h-4" />
            <span className="font-bold uppercase text-[10px]">C++ Console Output Log</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px] pt-1">
            &gt; {engine.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
