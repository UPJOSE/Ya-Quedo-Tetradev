import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { NAVIGATION_LINKS } from '../../constants/data';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection('#home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">YQ</span>
            </div>
            <span className="text-2xl font-bold text-text">YA QUEDÓ</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAVIGATION_LINKS.map((link, index) => (
              <motion.button
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => scrollToSection(link.href)}
                className="text-muted hover:text-text transition-colors font-medium"
              >
                {link.name}
              </motion.button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4 relative">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="md" onClick={() => navigate('/catalog')}>
                  <LayoutGrid size={16} className="mr-2" /> Catálogo
                </Button>
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 bg-background hover:bg-border/60 rounded-xl px-3 py-2 transition-colors"
                  >
                    <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">{user?.firstName?.charAt(0)}</span>
                    </div>
                    <span className="text-sm font-medium text-text">{user?.firstName}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-border py-2 z-50">
                      <button onClick={() => { navigate('/profile'); setUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text hover:bg-background transition-colors">
                        <User size={14} className="text-muted" /> Mi perfil
                      </button>
                      <div className="border-t border-border my-1" />
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={14} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="md" onClick={() => navigate('/login')}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                  Comenzar
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-background transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Alternar menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-4">
              {NAVIGATION_LINKS.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left py-2 text-text font-medium hover:text-primary transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <div className="pt-4 space-y-3">
                {isLoggedIn ? (
                  <>
                    <Button variant="outline" size="md" className="w-full" onClick={() => { navigate('/catalog'); setIsMobileMenuOpen(false); }}>
                      <LayoutGrid size={16} className="mr-2" /> Catálogo
                    </Button>
                    <Button variant="outline" size="md" className="w-full" onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                      <User size={16} className="mr-2" /> Mi perfil
                    </Button>
                    <Button variant="ghost" size="md" className="w-full text-red-600" onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" /> Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="md" className="w-full" onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}>
                      Iniciar sesión
                    </Button>
                    <Button variant="primary" size="md" className="w-full" onClick={() => { navigate('/register'); setIsMobileMenuOpen(false); }}>
                      Comenzar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
