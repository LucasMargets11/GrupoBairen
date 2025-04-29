import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Edit, Eye, Calendar } from 'lucide-react';
import { adminApi } from '../../lib/admin';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { Property, PropertyStatus } from '../../types/admin';
import { formatPrice } from '../../utils/formatters';

const PropertyListPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<PropertyStatus | 'all'>('all');
  const [sortField, setSortField] = React.useState<keyof Property>('created_at');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: () => adminApi.getProperties(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
    },
  });

  const filteredProperties = React.useMemo(() => {
    if (!properties) return [];
    
    let filtered = properties.filter(property => {
      const matchesSearch = 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [properties, searchTerm, statusFilter, sortField, sortDirection]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleSort = (field: keyof Property) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadgeVariant = (status: PropertyStatus) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'primary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Management</h1>
          <p className="text-gray-600 mt-1">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>
        <Button 
          variant="primary"
          onClick={() => navigate('/admin/properties/new')}
        >
          <Plus size={20} className="mr-2" />
          Add Property
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties by title, address, or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('title')}
                  >
                    Property
                    {sortField === 'title' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  <button 
                    className="flex items-center gap-1"
                    onClick={() => handleSort('city')}
                  >
                    Location
                    {sortField === 'city' && (
                      <span className="text-blue-600">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Details</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {property.media && property.media[0] ? (
                        <img 
                          src={property.media[0].url} 
                          alt={property.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Home size={20} className="text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{property.city}, {property.state}</div>
                    <div className="text-sm text-gray-500">{property.zip_code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">
                      {property.bedrooms} beds • {property.bathrooms} baths
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.square_feet} sq ft
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={getStatusBadgeVariant(property.status as PropertyStatus)}>
                      {property.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="text" 
                        size="sm"
                        onClick={() => navigate(`/property/${property.id}`)}
                        title="View property"
                      >
                        <Eye size={18} />
                      </Button>
                      <Button 
                        variant="text" 
                        size="sm"
                        onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                        title="Edit property"
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="text" 
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete property"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProperties.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No properties found. Try adjusting your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PropertyListPage;