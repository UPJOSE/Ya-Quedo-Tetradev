import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PARTNERS } from '../../constants/data';

const TrustedBy = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className="py-16 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center text-muted font-medium mb-12"
        >
          Confían en nosotros las principales organizaciones
        </motion.p>

        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-16">
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex items-center gap-3 text-muted hover:text-text transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-lg">
                {partner.logo}
              </div>
              <span className="text-xl font-semibold">{partner.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
