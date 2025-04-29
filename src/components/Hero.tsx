import React from 'react';
import { Search } from 'lucide-react';
import Button from './UI/Button';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen -mt-[var(--header-height)]">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg"
          alt="Luxury home exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50"></div>
      </div>
      
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 pt-[var(--header-height)]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Find Your Dream Home
        </h1>
        <p className="text-xl text-white mb-8 max-w-2xl">
          Discover the perfect property from our curated selection of premium listings
        </p>
        
        <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg w-full max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="City, neighborhood, or address"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <select className="py-3 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Price</option>
                <option value="100000-300000">$100k - $300k</option>
                <option value="300000-500000">$300k - $500k</option>
                <option value="500000-1000000">$500k - $1M</option>
                <option value="1000000+">$1M+</option>
              </select>
              
              <select className="py-3 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
              
              <Button size="lg" className="whitespace-nowrap">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;