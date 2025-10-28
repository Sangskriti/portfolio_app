import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import TemplateSelection from './pages/TemplateSelection';
import MultiStepForm from './pages/MultiStepForm';
import ProfessionalsList from './pages/ProfessionalsList';
import PortfolioPage from './pages/PortfolioPage';

export default function App(){
  return (
    <div>
      <header className="topbar">
        <div className="container">
          <Link to="/"><strong>PortfolioGen</strong></Link>
          <nav>
            <Link to="/list">Professionals</Link>
            <Link to="/create">Create</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<TemplateSelection />} />
          <Route path="/create" element={<MultiStepForm />} />
          <Route path="/create/:template" element={<MultiStepForm />} />
          <Route path="/list" element={<ProfessionalsList />} />
          <Route path="/portfolio/:id" element={<PortfolioPage />} />
        </Routes>
      </main>
    </div>
  );
}
