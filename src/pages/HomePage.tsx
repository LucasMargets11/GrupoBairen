import React from 'react';
import Hero from '../components/Hero';
import FeaturedSection from '../components/FeaturedSection';
import StatsSection from '../components/StatsSection';
import TestimonialsSection from '../components/TestimonialsSection';
import AgentsSection from '../components/AgentsSection';
import CTASection from '../components/CTASection';
import { Property } from '../types';

interface HomePageProps {
  properties: Property[];
}

const HomePage: React.FC<HomePageProps> = ({ properties }) => {
  return (
    <div className="pt-0">
      <Hero />
      <div className="bg-white">
        <FeaturedSection properties={properties} />
        <StatsSection />
        <TestimonialsSection />
        <AgentsSection />
        <CTASection />
      </div>
    </div>
  );
};

export default HomePage;