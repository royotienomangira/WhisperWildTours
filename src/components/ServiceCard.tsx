import { Check } from 'lucide-react';
import type { Service } from '../lib/supabase';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1">
      <div className="relative h-64 overflow-hidden">
        <img
          src={service.image_url}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold">
          ${service.price.toLocaleString()}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        <div className="space-y-2 mb-6">
          {service.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
              <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onBook(service)}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
