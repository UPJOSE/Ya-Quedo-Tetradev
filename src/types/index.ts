export interface NavLink {
  name: string;
  href: string;
}

export interface Stat {
  value: number;
  label: string;
  suffix: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  name: string;
  occupation: string;
  location: string;
  rating: number;
  image: string;
  quote: string;
}

export interface FAQ {
  question: string;
  answer: string;
}
