import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../lib/admin';
import PropertyCard from '../components/UI/PropertyCard';
import { Property } from '../types';
import { MapPin, Search, Filter, Home, DollarSign, Ruler } from 'lucide-react';
import Button from '../components/UI/Button';

// Sample properties data
const sampleProperties = [
  {
    id: '1',
    title: 'Modern Downtown Loft',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    price: 425000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: 'Floor-to-ceiling windows, exposed brick, updated kitchen',
    features: ['Floor-to-ceiling windows', 'Exposed brick', 'Updated kitchen'],
    images: ['https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg'],
    isFeatured: true,
    isForSale: true,
    isForRent: false,
    yearBuilt: 2015,
    location: { lat: 40.7128, lng: -74.0060 },
    property_type: 'apartment'
  },
  {
    id: '2',
    title: 'Suburban Family Home',
    address: '456 Oak Lane',
    city: 'Greenwich',
    state: 'CT',
    zipCode: '06830',
    price: 689000,
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 2800,
    description: 'Large backyard, 2-car garage, recently renovated',
    features: ['Large backyard', '2-car garage', 'Recently renovated'],
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
    isFeatured: false,
    isForSale: true,
    isForRent: false,
    yearBuilt: 1995,
    location: { lat: 41.0262, lng: -73.6282 },
    property_type: 'house'
  },
  {
    id: '3',
    title: 'Luxury Beachfront Condo',
    address: '789 Ocean Drive',
    city: 'Miami Beach',
    state: 'FL',
    zipCode: '33139',
    price: 895000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    description: 'Ocean views, private balcony, resort-style amenities',
    features: ['Ocean views', 'Private balcony', 'Resort amenities'],
    images: ['https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg'],
    isFeatured: true,
    isForSale: true,
    isForRent: false,
    yearBuilt: 2018,
    location: { lat: 25.7907, lng: -80.1300 },
    property_type: 'condo'
  },
  {
    id: '4',
    title: 'Historic Townhouse',
    address: '321 Maple Ave',
    city: 'Boston',
    state: 'MA',
    zipCode: '02108',
    price: 750000,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2200,
    description: 'Original hardwood floors, period details, courtyard',
    features: ['Original hardwood', 'Period details', 'Private courtyard'],
    images: ['https://images.pexels.com/photos/1115804/pexels-photo-1115804.jpeg'],
    isFeatured: false,
    isForSale: true,
    isForRent: false,
    yearBuilt: 1890,
    location: { lat: 42.3601, lng: -71.0589 },
    property_type: 'townhouse'
  },
  {
    id: '5',
    title: 'Mountain View Retreat',
    address: '567 Pine Ridge Road',
    city: 'Aspen',
    state: 'CO',
    zipCode: '81611',
    price: 1200000,
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 3500,
    description: 'Panoramic views, wraparound deck, gourmet kitchen',
    features: ['Panoramic views', 'Wraparound deck', 'Gourmet kitchen'],
    images: ['https://images.pexels.com/photos/3312883/pexels-photo-3312883.jpeg'],
    isFeatured: true,
    isForSale: true,
    isForRent: false,
    yearBuilt: 2010,
    location: { lat: 39.1911, lng: -106.8175 },
    property_type: 'house'
  },
  {
    id: '6',
    title: 'Urban Studio Apartment',
    address: '890 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    price: 289000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 600,
    description: 'Modern finishes, built-in storage, city views',
    features: ['Modern finishes', 'Built-in storage', 'City views'],
    images: ['https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg'],
    isFeatured: false,
    isForSale: true,
    isForRent: false,
    yearBuilt: 2020,
    location: { lat: 37.7749, lng: -122.4194 },
    property_type: 'apartment'
  }
];

const PropertiesPage: React.FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [bedroomCount, setBedroomCount] = useState<string>('all');

  const filteredProperties = React.useMemo(() => {
    return sampleProperties.filter(property => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriceRange = priceRange === 'all' || (() => {
        const price = property.price;
        switch (priceRange) {
          case 'under-500k': return price < 500000;
          case '500k-1m': return price >= 500000 && price < 1000000;
          case '1m-2m': return price >= 1000000 && price < 2000000;
          case 'over-2m': return price >= 2000000;
          default: return true;
        }
      })();

      const matchesType = propertyType === 'all' || property.property_type === propertyType;
      const matchesBedrooms = bedroomCount === 'all' || property.bedrooms >= parseInt(bedroomCount);

      return matchesSearch && matchesPriceRange && matchesType && matchesBedrooms;
    });
  }, [searchTerm, priceRange, propertyType, bedroomCount]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="absolute inset-0">
          <img 
            src="https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg"
            alt="Luxury home"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Find Your Dream Home
          </h1>
          <p className="text-xl text-center mb-8 max-w-2xl">
            Discover exceptional properties that match your lifestyle and aspirations
          </p>
          
          {/* Search Bar */}
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Price</option>
                <option value="under-500k">Under $500k</option>
                <option value="500k-1m">$500k - $1M</option>
                <option value="1m-2m">$1M - $2M</option>
                <option value="over-2m">Over $2M</option>
              </select>

              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter Stats */}
        <div className="flex flex-wrap items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredProperties.length} Available Properties
            </h2>
            <p className="text-gray-600 mt-1">
              Showing results for your search
            </p>
          </div>

          <div className="flex gap-4 mt-4 md:mt-0">
            <select
              value={bedroomCount}
              onChange={(e) => setBedroomCount(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Any Bedrooms</option>
              <option value="1">1+ Bed</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
              <option value="5">5+ Beds</option>
            </select>

            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setPriceRange('all');
                setPropertyType('all');
                setBedroomCount('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Property Grid and Map */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Property Grid */}
          <div className="w-full lg:w-3/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className="cursor-pointer transform transition-transform hover:scale-[1.02]"
                >
                  <PropertyCard property={property} />
                </div>
              ))}
              {filteredProperties.length === 0 && (
                <div className="col-span-2 py-12 text-center text-gray-500">
                  <Home size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-xl font-medium mb-2">No properties found</p>
                  <p>Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-24 h-[calc(100vh-6rem)]">
            <div className="bg-white rounded-lg shadow-md p-4 h-full">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${
                    selectedProperty
                      ? `${selectedProperty.address},${selectedProperty.city},${selectedProperty.state}`
                      : 'United States'
                  }`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {!selectedProperty && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
                    <div className="text-center">
                      <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Select a property to view its location</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;