export const NAVIGATION_LINKS = [
  { name: 'Inicio', href: '#home' },
  { name: 'Servicios', href: '#services' },
  { name: 'Beneficios', href: '#benefits' },
  { name: 'Cómo funciona', href: '#how-it-works' },
  { name: 'Testimonios', href: '#testimonials' },
  { name: 'Preguntas frecuentes', href: '#faq' },
] as const;

export const HERO_STATS = [
  { value: 500, label: 'Técnicos verificados', suffix: '+' },
  { value: 95, label: 'Satisfacción del cliente', suffix: '%' },
  { value: 8, label: 'Tiempo de respuesta promedio', suffix: ' min' },
  { value: 4.9, label: 'Calificación promedio', suffix: '★' },
] as const;

export const PARTNERS = [
  { name: 'TechCorp', logo: 'TC' },
  { name: 'HomeFix', logo: 'HF' },
  { name: 'ServicePro', logo: 'SP' },
  { name: 'BuildMaster', logo: 'BM' },
  { name: 'RepairHub', logo: 'RH' },
] as const;

export const PROBLEMS = [
  {
    icon: 'shield-alert',
    title: 'Sin confianza',
    description: 'Contratar desconocidos sin verificación crea riesgos de seguridad e incertidumbre.',
  },
  {
    icon: 'dollar-sign',
    title: 'Precios ocultos',
    description: 'Costos impredecibles y cargos sorpresa hacen imposible planificar el presupuesto.',
  },
  {
    icon: 'file-x',
    title: 'Sin garantías',
    description: 'Sin contratos formales, la mala calidad del trabajo no tiene solución.',
  },
  {
    icon: 'clock',
    title: 'Pérdida de tiempo',
    description: 'Llamar a varios técnicos y esperar cotizaciones hace perder horas.',
  },
  {
    icon: 'lock-open',
    title: 'Riesgos de seguridad',
    description: 'Permitir que trabajadores desconocidos entren a tu hogar sin verificación de antecedentes.',
  },
] as const;

export const SOLUTIONS = [
  {
    icon: 'user-check',
    title: 'Técnicos verificados',
    description: 'Cada técnico pasa por exhaustivas verificaciones de antecedentes y habilidades.',
  },
  {
    icon: 'star',
    title: 'Reseñas reales',
    description: 'Reseñas y calificaciones auténticas de clientes te ayudan a tomar decisiones informadas.',
  },
  {
    icon: 'tag',
    title: 'Precios transparentes',
    description: 'Precios claros desde el inicio, sin cargos ocultos ni sorpresas.',
  },
  {
    icon: 'brain',
    title: 'Recomendaciones con IA',
    description: 'Nuestro algoritmo inteligente encuentra el técnico perfecto para tus necesidades.',
  },
  {
    icon: 'credit-card',
    title: 'Pagos seguros',
    description: 'Transacciones protegidas con sistema de pago en custodia.',
  },
  {
    icon: 'map-pin',
    title: 'Seguimiento del servicio',
    description: 'Actualizaciones en tiempo real de la ubicación del técnico y el progreso del trabajo.',
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Describe tu problema',
    description: 'Cuéntanos qué necesitas y cuál es tu ubicación.',
  },
  {
    step: 2,
    title: 'Recibe recomendaciones con IA',
    description: 'Nuestro algoritmo te conecta con los mejores técnicos disponibles.',
  },
  {
    step: 3,
    title: 'Compara técnicos',
    description: 'Revisa perfiles, calificaciones y precios para elegir el mejor.',
  },
  {
    step: 4,
    title: 'Contrata con confianza',
    description: 'Reserva tu servicio con calidad garantizada y pago seguro.',
  },
] as const;

export const CUSTOMER_BENEFITS = [
  {
    icon: 'shield-check',
    title: 'Profesionales verificados',
    description: 'Todos los técnicos tienen verificación de antecedentes y habilidades certificadas.',
  },
  {
    icon: 'clock',
    title: 'Respuesta rápida',
    description: 'Tiempo de respuesta promedio de solo 8 minutos.',
  },
  {
    icon: 'wallet',
    title: 'Precios justos',
    description: 'Precios transparentes sin costos ocultos.',
  },
  {
    icon: 'award',
    title: 'Garantía de calidad',
    description: 'Satisfacción garantizada o te devolvemos tu dinero.',
  },
] as const;

export const TECHNICIAN_BENEFITS = [
  {
    icon: 'users',
    title: 'Más clientes',
    description: 'Acceso a miles de clientes potenciales.',
  },
  {
    icon: 'trending-up',
    title: 'Reputación digital',
    description: 'Construye tu perfil profesional y tus reseñas.',
  },
  {
    icon: 'landmark',
    title: 'Pagos seguros',
    description: 'Ingresos confiables con transacciones protegidas.',
  },
  {
    icon: 'calendar-check',
    title: 'Horario flexible',
    description: 'Trabaja cuando quieras, en los trabajos que elijas.',
  },
] as const;

export const STATISTICS = [
  { value: 3000, label: 'Servicios completados', suffix: '+' },
  { value: 500, label: 'Profesionales', suffix: '+' },
  { value: 95, label: 'Usuarios satisfechos', suffix: '%' },
  { value: 4.9, label: 'Calificación promedio', suffix: '★' },
] as const;

export const TESTIMONIALS = [
  {
    name: 'María González',
    occupation: 'Propietaria de casa',
    location: 'Lima, Perú',
    rating: 5,
    image: 'MG',
    quote: 'YA QUEDÓ transformó la forma en que encuentro servicios para el hogar. El electricista llegó en 10 minutos y hizo un trabajo excelente. ¡Finalmente un servicio en el que puedo confiar!',
  },
  {
    name: 'Carlos Rodríguez',
    occupation: 'Dueño de pequeña empresa',
    location: 'Arequipa, Perú',
    rating: 5,
    image: 'CR',
    quote: 'Como técnico, esta plataforma ha duplicado mi cartera de clientes. Los pagos seguros y el sistema de reseñas hacen todo más profesional y confiable.',
  },
  {
    name: 'Ana Martínez',
    occupation: 'Profesional',
    location: 'Cusco, Perú',
    rating: 5,
    image: 'AM',
    quote: 'Antes me angustiaba buscar plomeros. Ahora solo describo mi problema y me conectan con profesionales verificados. Las recomendaciones con IA son exactas.',
  },
] as const;

export const FAQS = [
  {
    question: '¿Cómo se verifican los técnicos?',
    answer: 'Cada técnico pasa por una verificación exhaustiva de antecedentes, identidad y evaluación de habilidades. También verificamos su historial laboral y exigimos certificaciones válidas para servicios especializados.',
  },
  {
    question: '¿Qué pasa si no estoy satisfecho con el servicio?',
    answer: 'Ofrecemos garantía de satisfacción. Si el trabajo no cumple con los estándares acordados, puedes solicitar un reembolso a través de nuestro sistema de pagos seguro. También contamos con un proceso de resolución de disputas para asegurar resultados justos.',
  },
  {
    question: '¿Cómo funciona el sistema de recomendaciones con IA?',
    answer: 'Nuestra IA analiza múltiples factores como tu ubicación, tipo de servicio, urgencia, disponibilidad del técnico, calificaciones, experiencia y desempeño en trabajos anteriores para recomendar la mejor opción para tus necesidades.',
  },
  {
    question: '¿Mi información de pago está segura?',
    answer: 'Por supuesto. Utilizamos encriptación y procesamiento de pagos a nivel bancario. Tu pago se mantiene en custodia hasta que el servicio se complete según tu satisfacción, protegiendo tanto a clientes como a técnicos.',
  },
  {
    question: '¿Puedo convertirme en técnico en la plataforma?',
    answer: '¡Sí! Damos la bienvenida a técnicos calificados. Deberás completar nuestro proceso de verificación, proporcionar certificaciones válidas y aprobar nuestra evaluación de habilidades. Postúlate en nuestra página "Conviértete en técnico".',
  },
  {
    question: '¿Qué servicios están disponibles?',
    answer: 'Actualmente ofrecemos trabajo eléctrico, plomería, cerrajería, reparación de computadoras, reparación de electrodomésticos, pintura y mantenimiento general del hogar. Continuamente expandimos nuestras categorías según la demanda.',
  },
] as const;

export const FOOTER_LINKS = {
  company: [
    { name: 'Nosotros', href: '#' },
    { name: 'Carreras', href: '#' },
    { name: 'Prensa', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  resources: [
    { name: 'Centro de ayuda', href: '#' },
    { name: 'Seguridad', href: '#' },
    { name: 'Términos de servicio', href: '#' },
    { name: 'Política de privacidad', href: '#' },
  ],
  legal: [
    { name: 'Política de privacidad', href: '#' },
    { name: 'Términos de servicio', href: '#' },
    { name: 'Política de cookies', href: '#' },
    { name: 'Licencias', href: '#' },
  ],
} as const;

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: '#', icon: 'github' },
  { name: 'LinkedIn', href: '#', icon: 'linkedin' },
  { name: 'Instagram', href: '#', icon: 'instagram' },
  { name: 'Facebook', href: '#', icon: 'facebook' },
] as const;
