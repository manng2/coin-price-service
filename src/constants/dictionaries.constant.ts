import { HotelDataBySupplierModel } from '../models';
import { AmenitiesNameModel, AmenitiesTypeModel, ImageModel, ImageTypeModel } from '../models/hotel.model';

export const HOTEL_DATA_KEY_DICTIONARY: Record<keyof HotelDataBySupplierModel, string[]> = {
  id: ['Id', 'id', 'hotel_id'],
  destinationId: ['DestinationId', 'destination', 'destination_id'],
  name: ['Name', 'name', 'hotel_name'],
  lat: ['Latitude', 'lat'],
  lng: ['Longitude', 'lng'],
  address: ['Address', 'address', 'location.address'],
  city: ['City'],
  country: ['Country', 'location.country'],
  description: ['Description', 'info', 'details'],
  amenities: ['Facilities', 'amenities'],
  images: ['images'],
  bookingConditions: ['booking_conditions'],
};

export const AMENITY_NAME_DICTIONARY: Record<AmenitiesNameModel, string[]> = {
  [AmenitiesNameModel.POOL]: ['pool'],
  [AmenitiesNameModel.WIFI]: ['wifi'],
  [AmenitiesNameModel.AIR_CON]: ['air conditioner', 'air conditioning', 'aircon'],
  [AmenitiesNameModel.BATHTUB]: ['bath tub', 'bathtub'],
  [AmenitiesNameModel.BREAKFAST]: ['breakfast'],
  [AmenitiesNameModel.BAR]: ['minibar', 'bar'],
  [AmenitiesNameModel.DRY_CLEANING]: ['drycleaning', 'dry cleaning'],
  [AmenitiesNameModel.BUSINESS_CENTER]: ['businesscenter', 'business center', 'business center'],
  [AmenitiesNameModel.KETTLE]: ['kettle'],
  [AmenitiesNameModel.TV]: ['tv'],
  [AmenitiesNameModel.HAIRDRYER]: ['hairdryer', 'hair dryer'],
  [AmenitiesNameModel.IRON]: ['iron'],
  [AmenitiesNameModel.COFFEE_MACHINE]: ['coffeemachine', 'coffee machine'],
  [AmenitiesNameModel.CHILDCARE]: ['childcare', 'child care'],
  [AmenitiesNameModel.OUTDOOR_POOL]: ['outdoor pool', 'outdoorpool'],
  [AmenitiesNameModel.INDOOR_POOL]: ['indoor pool', 'indoorpool'],
};

export const AMENITY_TYPE_DICTIONARY: Record<AmenitiesTypeModel, string[]> = {
  [AmenitiesTypeModel.GENERAL]: ['general', 'other'],
  [AmenitiesTypeModel.ROOM]: ['room'],
};

export const AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY: Record<AmenitiesTypeModel, AmenitiesNameModel[]> = {
  [AmenitiesTypeModel.GENERAL]: [
    AmenitiesNameModel.BUSINESS_CENTER,
    AmenitiesNameModel.POOL,
    AmenitiesNameModel.COFFEE_MACHINE,
    AmenitiesNameModel.CHILDCARE,
    AmenitiesNameModel.OUTDOOR_POOL,
    AmenitiesNameModel.INDOOR_POOL,
  ],
  [AmenitiesTypeModel.ROOM]: [
    AmenitiesNameModel.WIFI,
    AmenitiesNameModel.BATHTUB,
    AmenitiesNameModel.BREAKFAST,
    AmenitiesNameModel.KETTLE,
    AmenitiesNameModel.TV,
    AmenitiesNameModel.HAIRDRYER,
    AmenitiesNameModel.AIR_CON,
    AmenitiesNameModel.DRY_CLEANING,
    AmenitiesNameModel.IRON,
    AmenitiesNameModel.BAR,
  ],
};

export const IMAGE_TYPE_DICTIONARY: Record<ImageTypeModel, string[]> = {
  [ImageTypeModel.ROOM]: ['rooms', 'room'],
  [ImageTypeModel.AMENITY]: ['site', 'amenities'],
};

export const IMAGE_DATA_KEY_DICTIONARY: Record<keyof ImageModel, string[]> = {
  description: ['description', 'caption'],
  link: ['link', 'url'],
};
