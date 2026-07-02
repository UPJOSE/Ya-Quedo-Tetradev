import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, MapPin } from 'lucide-react';
import Card from '../ui/Card';
import { TESTIMONIALS } from '../../constants/data';

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="testimonials" ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Experiencias reales de clientes y técnicos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <Card hover className="p-8 h-full">
                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="text-warning fill-warning" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text mb-6 leading-relaxed">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center text-white font-bold">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-semibold text-text">{testimonial.name}</h4>
                    <p className="text-sm text-muted">{testimonial.occupation}</p>
                    <div className="flex items-center gap-1 text-xs text-muted mt-1">
                      <MapPin size={12} />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
