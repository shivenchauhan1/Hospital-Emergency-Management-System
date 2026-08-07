import React from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HospitalPage from './pages/HospitalPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-slate-950">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-6">
        <HospitalPage />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
