import { HotelDataBySupplierModel, HotelModel } from '../models';

export function convertToHotelModel(data: HotelDataBySupplierModel): HotelModel {
  return {
    id: data.id,
    destinationId: data.destinationId,
    name: data.name || '',
    location: {
      lat: data.lat,
      lng: data.lng,
      address: data.address || '',
      city: data.city,
      country: data.country,
    },
    description: data.description,
    amenities: data.amenities || null,
    images: data.images || null,
    bookingConditions: data.bookingConditions || null,
  };
}
