import React from 'react';
import { BedDouble, Bath, Ruler, Calendar, Award, Home, Check } from 'lucide-react';
import { Property } from '../types';
import { formatPrice, formatNumber } from '../utils/formatters';
import Button from './UI/Button';
import Badge from './UI/Badge';

interface PropertyDetailsProps {
  property: Property;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
      <div className="flex flex-wrap items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {property.isForSale && <Badge variant="primary">For Sale</Badge>}
            {property.isForRent && <Badge variant="info">For Rent</Badge>}
            {property.isFeatured && <Badge variant="success">Featured</Badge>}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{property.title}</h1>
          <p className="text-gray-600 mt-1 flex items-center">
            <Home size={16} className="mr-1" />
            {property.address}, {property.city}, {property.state} {property.zipCode}
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0">
          <p className="text-3xl font-bold text-blue-900">{formatPrice(property.price)}</p>
          {property.isForRent && <p className="text-gray-600 text-sm">per month</p>}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 border-y border-gray-200 py-6">
        <div className="flex flex-col items-center p-3 text-center">
          <BedDouble size={24} className="text-blue-900 mb-2" />
          <p className="text-xl font-semibold">{property.bedrooms}</p>
          <p className="text-gray-600 text-sm">Bedrooms</p>
        </div>
        
        <div className="flex flex-col items-center p-3 text-center">
          <Bath size={24} className="text-blue-900 mb-2" />
          <p className="text-xl font-semibold">{property.bathrooms}</p>
          <p className="text-gray-600 text-sm">Bathrooms</p>
        </div>
        
        <div className="flex flex-col items-center p-3 text-center">
          <Ruler size={24} className="text-blue-900 mb-2" />
          <p className="text-xl font-semibold">{formatNumber(property.squareFeet)}</p>
          <p className="text-gray-600 text-sm">Square Feet</p>
        </div>
        
        <div className="flex flex-col items-center p-3 text-center">
          <Calendar size={24} className="text-blue-900 mb-2" />
          <p className="text-xl font-semibold">{property.yearBuilt}</p>
          <p className="text-gray-600 text-sm">Year Built</p>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Description</h2>
        <p className="text-gray-700 leading-relaxed">{property.description}</p>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-2 gap-x-4">
          {property.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check size={18} className="text-green-600 mr-2" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="primary" size="lg" fullWidth>
          Schedule a Viewing
        </Button>
        <Button variant="outline" size="lg" fullWidth>
          Contact Agent
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetails;