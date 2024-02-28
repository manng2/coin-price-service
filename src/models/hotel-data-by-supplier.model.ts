import { AmenitiesNameModel, AmenitiesTypeModel, ImageModel, ImageTypeModel } from './hotel.model';

export interface HotelDataBySupplierModel {
  id: string;
  destinationId: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  description: string;
  amenities?: Record<AmenitiesTypeModel, AmenitiesNameModel[]>;
  images?: Record<ImageTypeModel, ReadonlyArray<ImageModel>>;
  bookingConditions?: ReadonlyArray<string>;
}
