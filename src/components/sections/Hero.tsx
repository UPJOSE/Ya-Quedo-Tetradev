import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Clock, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import { HERO_STATS } from '../../constants/data';

const Hero = () => {
  const navigate = useNavigate();
  const iconMap = {
    'Técnicos verificados': Shield,
    'Satisfacción del cliente': Star,
    'Tiempo de respuesta promedio': Clock,
    'Calificación promedio': Star,
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6"
            >
              <Zap size={16} className="text-primary" />
              <span className="text-primary font-medium text-sm">Confiado por miles de peruanos</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl lg:text-7xl font-bold text-text leading-tight mb-6"
            >
              Encuentra técnicos confiables para tu hogar en{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
                minutos
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted mb-8 max-w-lg"
            >
              Contrata electricistas, plomeros, cerrajeros y profesionales de servicios para el hogar verificados con confianza.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="primary" size="lg" className="group" onClick={() => navigate('/register')}>
                Encuentra un técnico
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                Iniciar sesión
              </Button>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            >
              {HERO_STATS.map((stat) => {
                const Icon = iconMap[stat.label as keyof typeof iconMap];
                return (
                  <div key={stat.label} className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                      <Icon size={16} className="text-primary" />
                      <span className="text-3xl font-bold text-text">
                        {stat.value.toFixed(stat.value % 1 !== 0 ? 1 : 0)}
                        {stat.suffix}
                      </span>
                    </div>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-white rounded-3xl shadow-2xl shadow-primary/10 p-8 border border-border"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                    <Shield size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">Técnico verificado</h3>
                    <p className="text-muted">Disponible ahora</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Zap size={20} className="text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-text">Tiempo de respuesta</p>
                        <p className="text-sm text-muted">8 minutos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-warning">
                      <Star size={16} fill="currentColor" />
                      <span className="font-semibold">4.9</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-text">Experiencia</p>
                        <p className="text-sm text-muted">5+ años</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                      Verificado
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Antecedentes</p>
                    <p className="text-xs text-muted">Verificados</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-border"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Star size={16} className="text-white" fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">Calificación 4.9</p>
                    <p className="text-xs text-muted">500+ reseñas</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
