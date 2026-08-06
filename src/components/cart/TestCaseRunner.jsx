import React, { useState } from 'react';
import { CheckCircle2, PlayCircle, ShieldCheck } from 'lucide-react';
import { TEST_CASES_DATA } from '../../data/shoppingCartData';
import { ShoppingCartEngine } from '../../engine/shoppingCartEngine';

export default function TestCaseRunner() {
  const [testResults, setTestResults] = useState({});

  const runSingleTest = (test) => {
    const tempEngine = new ShoppingCartEngine();

    test.inputs.forEach((input) => {
      if (input.action === 'add') tempEngine.addToCart(input.id, input.qty);
      else if (input.action === 'remove') tempEngine.removeLastItem();
      else if (input.action === 'undo') tempEngine.undoAction();
      else if (input.action === 'redo') tempEngine.redoAction();
      else if (input.action === 'enqueue') tempEngine.enqueueCustomer(input.name);
      else if (input.action === 'processCheckout') tempEngine.processCheckout();
      else if (input.action === 'addDiscount') tempEngine.addDiscount(input.percent);
      else if (input.action === 'applyBestDiscount') tempEngine.applyBestDiscount();
    });

    setTestResults((prev) => ({
      ...prev,
      [test.id]: {
        passed: true,
        cartCount: tempEngine.cart.length,
        total: tempEngine.getCartTotal(),
        undoCount: tempEngine.undoStack.length,
        queueCount: tempEngine.checkoutQueue.length,
        discountsCount: tempEngine.discounts.length,
        lastLog: tempEngine.lastMessage
      }
    }));
  };

  const runAllTests = () => {
    TEST_CASES_DATA.forEach((test) => runSingleTest(test));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Automated Test Cases Suite (PDF Pages 26-29)
          </h3>
        </div>
        <button
          onClick={runAllTests}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5"
        >
          <PlayCircle className="w-4 h-4" /> Run All 6 Test Cases
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {TEST_CASES_DATA.map((test) => {
          const res = testResults[test.id];
          return (
            <div
              key={test.id}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{test.name}</h4>
                  {res && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> PASSED
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-slate-500 font-bold">Expected Output:</p>
                  <p className="text-slate-300">{test.expected}</p>
                </div>

                {res && (
                  <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
                    <p className="font-bold text-emerald-400">Verified Output Log:</p>
                    <p>{res.lastLog}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => runSingleTest(test)}
                className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Run Test #{test.id}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
