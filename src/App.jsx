import React, { useState, useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import HospitalPage from './pages/HospitalPage';
import HomePage from './pages/HomePage';
import VisualizerPage from './pages/VisualizerPage';
import BenchmarkPage from './pages/BenchmarkPage';
import ComparePage from './pages/ComparePage';
import ComplexityPage from './pages/ComplexityPage';
import TeamPage from './pages/TeamPage';

export default function App() {
  const [activePage, setActivePage] = useState('hospital');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Module Content */}
      <main className="flex-1 px-4 lg:px-8 py-6">
        {activePage === 'hospital' && <HospitalPage />}
        {activePage === 'home' && (
          <HomePage
            setActivePage={setActivePage}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        )}
        {activePage === 'visualizer' && (
          <VisualizerPage
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={setSelectedAlgorithm}
          />
        )}
        {activePage === 'benchmark' && <BenchmarkPage />}
        {activePage === 'compare' && <ComparePage />}
        {activePage === 'complexity' && <ComplexityPage />}
        {activePage === 'team' && <TeamPage />}
      </main>

      {/* Footer */}
      <Footer setActivePage={setActivePage} />
    </div>
  );
}
