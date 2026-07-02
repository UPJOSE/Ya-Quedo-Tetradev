import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import TrustedBy from './components/sections/TrustedBy';
import Problem from './components/sections/Problem';
import Solution from './components/sections/Solution';
import AIRecommendation from './components/sections/AIRecommendation';
import HowItWorks from './components/sections/HowItWorks';
import Benefits from './components/sections/Benefits';
import Statistics from './components/sections/Statistics';
import Testimonials from './components/sections/Testimonials';
import FAQ from './components/sections/FAQ';
import CTA from './components/sections/CTA';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import TechnicianDetailPage from './pages/TechnicianDetailPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <Problem />
        <Solution />
        <AIRecommendation />
        <HowItWorks />
        <Benefits />
        <Statistics />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/catalog" element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
      <Route path="/technician/:id" element={<ProtectedRoute><TechnicianDetailPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
