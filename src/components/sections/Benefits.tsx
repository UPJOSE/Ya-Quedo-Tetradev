import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ShieldCheck, Clock, Wallet, Award, Users, TrendingUp, Landmark, CalendarCheck } from 'lucide-react';
import { CUSTOMER_BENEFITS, TECHNICIAN_BENEFITS } from '../../constants/data';

const customerIconMap = {
  'shield-check': ShieldCheck,
  'clock': Clock,
  'wallet': Wallet,
  'award': Award,
};

const technicianIconMap = {
  'users': Users,
  'trending-up': TrendingUp,
  'landmark': Landmark,
  'calendar-check': CalendarCheck,
};

const Benefits = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="benefits" ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            Beneficios para todos
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Ya sea que contrates u ofrezcas servicios, tenemos lo que necesitas
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Customer Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl p-8 border border-border h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-text">Para clientes</h3>
              </div>

              <div className="space-y-6">
                {CUSTOMER_BENEFITS.map((benefit, index) => {
                  const Icon = customerIconMap[benefit.icon as keyof typeof customerIconMap];
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted">{benefit.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Technician Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-3xl p-8 border border-border h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Users size={24} className="text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-text">Para técnicos</h3>
              </div>

              <div className="space-y-6">
                {TECHNICIAN_BENEFITS.map((benefit, index) => {
                  const Icon = technicianIconMap[benefit.icon as keyof typeof technicianIconMap];
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={20} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-text mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted">{benefit.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
