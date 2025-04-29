import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import DatePicker from 'react-datepicker';
import { format, parse, startOfWeek, getDay, addDays, isBefore, isAfter } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Property, PropertyPricing } from '../../types/admin';
import { adminApi } from '../../lib/admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Button from '../UI/Button';
import { Plus, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface PropertyCalendarProps {
  property: Property;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'booking' | 'maintenance' | 'blocked';
  status: string;
  price?: number;
  allDay?: boolean;
}

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<PropertyPricing>) => void;
  initialData?: Partial<PropertyPricing>;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [startDate, setStartDate] = useState<Date | null>(initialData?.start_date ? new Date(initialData.start_date) : null);
  const [endDate, setEndDate] = useState<Date | null>(initialData?.end_date ? new Date(initialData.end_date) : null);
  const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
  const [minNights, setMinNights] = useState(initialData?.min_nights?.toString() || '1');
  const [maxNights, setMaxNights] = useState(initialData?.max_nights?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      start_date: startDate?.toISOString().split('T')[0],
      end_date: endDate?.toISOString().split('T')[0],
      amount: parseFloat(amount),
      min_nights: parseInt(minNights),
      max_nights: maxNights ? parseInt(maxNights) : undefined,
      price_type: 'seasonal',
      currency: 'USD',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Set Seasonal Pricing</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <div className="flex gap-4">
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholderText="Start date"
              />
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholderText="End date"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price per night ($)</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum nights</label>
              <input
                type="number"
                value={minNights}
                onChange={e => setMinNights(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum nights</label>
              <input
                type="number"
                value={maxNights}
                onChange={e => setMaxNights(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min={parseInt(minNights)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Pricing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PropertyCalendar: React.FC<PropertyCalendarProps> = ({ property }) => {
  const [view, setView] = React.useState(Views.MONTH);
  const [date, setDate] = React.useState(new Date());
  const [selectedDates, setSelectedDates] = React.useState<[Date | null, Date | null]>([null, null]);
  const [showPricingModal, setShowPricingModal] = React.useState(false);
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['bookings', property.id],
    queryFn: () => adminApi.getBookings(property.id),
  });

  const { data: pricing } = useQuery({
    queryKey: ['pricing', property.id],
    queryFn: () => property.pricing || [],
  });

  const createPricingMutation = useMutation({
    mutationFn: (data: Partial<PropertyPricing>) => 
      adminApi.createPricing({ ...data, property_id: property.id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing', property.id] });
      setShowPricingModal(false);
    },
  });

  const events: CalendarEvent[] = React.useMemo(() => {
    const calendarEvents: CalendarEvent[] = [];

    // Add bookings
    bookings?.forEach(booking => {
      calendarEvents.push({
        id: booking.id,
        title: `Booking: ${booking.guest_count} guests`,
        start: new Date(booking.check_in_date),
        end: new Date(booking.check_out_date),
        type: 'booking',
        status: booking.status,
        allDay: true,
      });
    });

    // Add maintenance events
    property.maintenance_events?.forEach(event => {
      calendarEvents.push({
        id: event.id,
        title: `Maintenance: ${event.title}`,
        start: new Date(event.start_date),
        end: new Date(event.end_date),
        type: 'maintenance',
        status: event.status,
      });
    });

    // Add pricing events
    pricing?.forEach(price => {
      if (price.start_date && price.end_date) {
        calendarEvents.push({
          id: price.id,
          title: `$${price.amount}/night`,
          start: new Date(price.start_date),
          end: new Date(price.end_date),
          type: 'blocked',
          status: 'pricing',
          price: price.amount,
          allDay: true,
        });
      }
    });

    return calendarEvents;
  }, [bookings, property.maintenance_events, pricing]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setSelectedDates([start, end]);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#3B82F6'; // Default blue

    switch (event.type) {
      case 'booking':
        switch (event.status) {
          case 'confirmed':
            backgroundColor = '#059669'; // Green
            break;
          case 'pending':
            backgroundColor = '#F59E0B'; // Yellow
            break;
          case 'cancelled':
            backgroundColor = '#DC2626'; // Red
            break;
        }
        break;
      case 'maintenance':
        backgroundColor = '#6366F1'; // Indigo
        break;
      case 'blocked':
        backgroundColor = '#9333EA'; // Purple
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
      },
    };
  };

  const handleAddPricing = (data: Partial<PropertyPricing>) => {
    createPricingMutation.mutateAsync(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Property Calendar</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowPricingModal(true)}
          >
            <DollarSign size={16} className="mr-1" />
            Set Pricing
          </Button>
        </div>
      </div>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          tooltipAccessor={(event: CalendarEvent) => event.title}
          popup
          className="rounded-lg"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-green-600 mr-2"></div>
          <span className="text-sm text-gray-600">Confirmed Bookings</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-yellow-500 mr-2"></div>
          <span className="text-sm text-gray-600">Pending Bookings</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-indigo-500 mr-2"></div>
          <span className="text-sm text-gray-600">Maintenance</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded bg-purple-600 mr-2"></div>
          <span className="text-sm text-gray-600">Seasonal Pricing</span>
        </div>
      </div>

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        onSubmit={handleAddPricing}
      />
    </div>
  );
};

export default PropertyCalendar;