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

function App() {
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

export default App;
