import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { STATISTICS } from '../../constants/data';

const Statistics = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-24 bg-secondary">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Números que hablan
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Nuestro impacto en el mercado de servicios para el hogar
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATISTICS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl lg:text-6xl font-bold text-white mb-2">
                {inView && `${stat.value.toFixed(stat.value % 1 !== 0 ? 1 : 0)}${stat.suffix}`}
              </div>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
