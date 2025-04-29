import { supabase } from './supabase';
import { Property, PropertyMedia, PropertyPricing, PropertyAvailability, MaintenanceEvent, Booking } from '../types/admin';

const handleApiError = (error: any) => {
  if (error.message === 'JWT expired') {
    // Handle token expiration
    window.location.href = '/login';
    return;
  }
  
  console.error('API Error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

export const adminApi = {
  async getProperties() {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          media:property_media(*),
          pricing:property_pricing(*),
          availability:property_availability(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Property[];
    } catch (error) {
      handleApiError(error);
    }
  },

  async getProperty(id: string) {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        media:property_media(*),
        pricing:property_pricing(*),
        availability:property_availability(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Property;
  },

  async createProperty(property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  },

  async updateProperty(id: string, updates: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  },

  async deleteProperty(id: string) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadMedia(propertyId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${propertyId}/${Math.random()}.${fileExt}`;
    const filePath = `property-media/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('properties')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('properties')
      .getPublicUrl(filePath);

    const { data, error } = await supabase
      .from('property_media')
      .insert({
        property_id: propertyId,
        media_type: file.type.startsWith('image/') ? 'image' : 'video',
        url: publicUrl,
        title: file.name,
      })
      .select()
      .single();

    if (error) throw error;
    return data as PropertyMedia;
  },

  async deleteMedia(id: string) {
    const { error } = await supabase
      .from('property_media')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async createPricing(pricing: Partial<PropertyPricing>) {
    const { data, error } = await supabase
      .from('property_pricing')
      .insert(pricing)
      .select()
      .single();

    if (error) throw error;
    return data as PropertyPricing;
  },

  async updatePricing(id: string, updates: Partial<PropertyPricing>) {
    const { data, error } = await supabase
      .from('property_pricing')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PropertyPricing;
  },

  async updateAvailability(id: string, updates: Partial<PropertyAvailability>) {
    const { data, error } = await supabase
      .from('property_availability')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as PropertyAvailability;
  },

  async createMaintenanceEvent(event: Partial<MaintenanceEvent>) {
    const { data, error } = await supabase
      .from('maintenance_events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data as MaintenanceEvent;
  },

  async getBookings(propertyId?: string) {
    const query = supabase
      .from('bookings')
      .select('*')
      .order('check_in_date', { ascending: true });

    if (propertyId) {
      query.eq('property_id', propertyId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Booking[];
  },

  async createBooking(booking: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },
};