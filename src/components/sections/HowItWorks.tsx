import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, Brain, Scale, CheckCircle, ArrowDown } from 'lucide-react';
import { HOW_IT_WORKS } from '../../constants/data';

const HowItWorks = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            Cómo funciona
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Empieza en cuatro simples pasos
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border transform -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {HOW_IT_WORKS.map((step, index) => {
              const isEven = index % 2 === 0;
              const iconMap = {
                1: MessageSquare,
                2: Brain,
                3: Scale,
                4: CheckCircle,
              };
              const Icon = iconMap[index + 1 as keyof typeof iconMap];

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center ${
                    index !== HOW_IT_WORKS.length - 1 ? 'mb-12 lg:mb-0' : ''
                  }`}
                >
                  {/* Step Number */}
                  <div className="hidden lg:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-primary rounded-full items-center justify-center text-white font-bold text-lg z-10">
                    {step.step}
                  </div>

                  {/* Content */}
                  <div className={`lg:mb-0 ${isEven ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16 lg:col-start-2'}`}>
                    <div className="lg:hidden flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {step.step}
                      </div>
                      <ArrowDown className="text-muted" size={24} />
                    </div>

                    <div className="bg-background rounded-2xl p-8 border border-border">
                      <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                        <Icon size={28} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-text mb-3">{step.title}</h3>
                      <p className="text-muted">{step.description}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
