import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Sparkles, Target, TrendingUp, Users, Clock } from 'lucide-react';
import Card from '../ui/Card';

const AIRecommendation = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const factors = [
    { icon: Target, label: 'Ubicación', description: 'Conecta técnicos cerca de ti' },
    { icon: Users, label: 'Tipo de servicio', description: 'Experticia especializada' },
    { icon: Clock, label: 'Disponibilidad', description: 'Listos cuando lo necesitas' },
    { icon: TrendingUp, label: 'Calificaciones', description: 'Profesionales mejor valorados' },
    { icon: Sparkles, label: 'Experiencia', description: 'Años de experticia' },
    { icon: Brain, label: 'Trabajos previos', description: 'Tareas similares completadas' },
  ];

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Brain size={16} className="text-primary" />
              <span className="text-primary font-medium text-sm">Impulsado por IA</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-text mb-6">
              Emparejamiento inteligente para resultados perfectos
            </h2>

            <p className="text-xl text-muted mb-8">
              Nuestro motor de recomendaciones con IA analiza múltiples factores para encontrar el técnico ideal para tus necesidades específicas.
            </p>

            <div className="grid grid-cols-2 gap-6">
              {factors.map((factor, index) => {
                const Icon = factor.icon;
                return (
                  <motion.div
                    key={factor.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text mb-1">{factor.label}</h4>
                      <p className="text-sm text-muted">{factor.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-text">Recomendación con IA</h3>
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={16} />
                  <span className="text-sm font-medium">98% compatibilidad</span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Technician Card */}
                <div className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold">
                      JR
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-text">Juan Rodríguez</h4>
                      <p className="text-sm text-muted">Electricista • 8 años de exp</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-warning">
                        <span className="text-lg font-bold">4.9</span>
                        <span className="text-sm">★</span>
                      </div>
                      <p className="text-xs text-muted">234 reseñas</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">Verificado</span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">Disponible ahora</span>
                    <span className="px-3 py-1 bg-background text-muted rounded-full text-xs font-medium">A 2.3 km</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-text">156</p>
                      <p className="text-xs text-muted">Trabajos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text">98%</p>
                      <p className="text-xs text-muted">Éxito</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text">8min</p>
                      <p className="text-xs text-muted">Respuesta</p>
                    </div>
                  </div>
                </div>

                {/* Match Factors */}
                <div className="p-4 bg-background rounded-xl border border-border">
                  <h4 className="font-semibold text-text mb-3">¿Por qué este emparejamiento?</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Proximidad de ubicación</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-accent rounded-full" />
                        </div>
                        <span className="text-xs font-medium text-text">95%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Experticia del servicio</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[90%] h-full bg-accent rounded-full" />
                        </div>
                        <span className="text-xs font-medium text-text">90%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted">Compatibilidad de calificación</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-accent rounded-full" />
                        </div>
                        <span className="text-xs font-medium text-text">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendation;
