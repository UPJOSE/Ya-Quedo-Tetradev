import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { UserCheck, Star, Tag, Brain, CreditCard, MapPin, CheckCircle } from 'lucide-react';
import Card from '../ui/Card';
import { SOLUTIONS } from '../../constants/data';

const iconMap = {
  'user-check': UserCheck,
  'star': Star,
  'tag': Tag,
  'brain': Brain,
  'credit-card': CreditCard,
  'map-pin': MapPin,
};

const Solution = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="services" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            YA QUEDÓ resuelve cada problema
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Hemos construido una plataforma que aborda cada punto débil de los servicios tradicionales para el hogar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLUTIONS.map((solution, index) => {
            const Icon = iconMap[solution.icon as keyof typeof iconMap] || CheckCircle;
            return (
              <motion.div
                key={solution.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card hover className="p-8 h-full">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">{solution.title}</h3>
                  <p className="text-muted">{solution.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Solution;
