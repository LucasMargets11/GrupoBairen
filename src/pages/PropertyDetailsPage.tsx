import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Property } from '../types';
import PropertyGallery from '../components/PropertyGallery';
import PropertyDetails from '../components/PropertyDetails';
import Button from '../components/UI/Button';
import PropertyGrid from '../components/PropertyGrid';

interface PropertyDetailsPageProps {
  properties: Property[];
}

const PropertyDetailsPage: React.FC<PropertyDetailsPageProps> = ({ properties }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  
  useEffect(() => {
    // Find the current property
    const currentProperty = properties.find(p => p.id === id);
    
    if (currentProperty) {
      setProperty(currentProperty);
      
      // Find similar properties (same city, similar price range, excluding current property)
      const similar = properties.filter(p => 
        p.id !== id && 
        p.city === currentProperty.city &&
        Math.abs(p.price - currentProperty.price) < (currentProperty.price * 0.3)
      ).slice(0, 3);
      
      setSimilarProperties(similar);
      
      // Set page title
      document.title = `${currentProperty.title} | Premier Estates`;
    } else {
      // Property not found, redirect to home
      navigate('/', { replace: true });
    }
  }, [id, properties, navigate]);
  
  if (!property) {
    return <div className="container mx-auto px-4 py-16">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <Button 
        variant="text" 
        className="mb-6 hover:translate-x-[-4px] transition-transform"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={18} className="mr-1" />
        Back to listings
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyGallery images={property.images} title={property.title} />
        </div>
        
        <div>
          <PropertyDetails property={property} />
        </div>
      </div>
      
      {similarProperties.length > 0 && (
        <div className="mt-16">
          <PropertyGrid 
            properties={similarProperties}
            title="Similar Properties"
            subtitle="You might also be interested in these properties in the same area"
          />
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;