import { Database } from './supabase';

export type Tables = Database['public']['Tables'];

export interface Property extends Tables['properties']['Row'] {
  media?: PropertyMedia[];
  pricing?: PropertyPricing[];
  availability?: PropertyAvailability[];
}

export interface PropertyMedia extends Tables['property_media']['Row'] {}

export interface PropertyPricing extends Tables['property_pricing']['Row'] {}

export interface PropertyAvailability extends Tables['property_availability']['Row'] {}

export interface MaintenanceEvent extends Tables['maintenance_events']['Row'] {}

export interface Booking extends Tables['bookings']['Row'] {}

export interface AdminState {
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
}

export type PropertyStatus = 'draft' | 'published' | 'archived';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type MaintenanceStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
export type PricingType = 'base' | 'seasonal' | 'special' | 'promotion';
export type AvailabilityStatus = 'available' | 'booked' | 'maintenance' | 'blocked';