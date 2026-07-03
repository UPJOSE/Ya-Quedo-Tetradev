import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShieldAlert, DollarSign, FileX, Clock, LockOpen, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import { PROBLEMS } from '../../constants/data';

const iconMap = {
  'shield-alert': ShieldAlert,
  'dollar-sign': DollarSign,
  'file-x': FileX,
  'clock': Clock,
  'lock-open': LockOpen,
};

const Problem = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            ¿Por qué sigue siendo tan difícil contratar un técnico?
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            La forma tradicional de encontrar servicios para el hogar está rota. Estas son las razones.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROBLEMS.map((problem, index) => {
            const Icon = iconMap[problem.icon as keyof typeof iconMap] || AlertTriangle;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="p-8 h-full">
                  <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon size={28} className="text-warning" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">{problem.title}</h3>
                  <p className="text-muted">{problem.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Problem;
