export enum ImageTypeModel {
  ROOM = 'rooms',
  AMENITY = 'amenity',
}

export enum AmenitiesTypeModel {
  GENERAL = 'general',
  ROOM = 'room',
}

export interface ImageModel {
  link: string;
  description: string;
}

export enum AmenitiesNameModel {
  POOL = 'pool',
  WIFI = 'wifi',
  AIR_CON = 'airCon',
  BATHTUB = 'bathTub',
  BREAKFAST = 'breakfast',
  BAR = 'bar',
  DRY_CLEANING = 'dryCleaning',
  BUSINESS_CENTER = 'businessCenter',
  KETTLE = 'kettle',
  TV = 'tv',
  HAIRDRYER = 'hairDryer',
  OUTDOOR_POOL = 'outdoorPool',
  INDOOR_POOL = 'indoorPool',
  CHILDCARE = 'childcare',
  COFFEE_MACHINE = 'coffeeMachine',
  IRON = 'iron',
}

export interface HotelDataBySupplierModel {
  id: string;
  destinationId: number;
  lat: number;
  lng: number;
  city: string;
  country: string;
  description: string;
  name: string;
  address?: string;
  amenities?: Record<AmenitiesTypeModel, ReadonlyArray<AmenitiesNameModel>>;
  images?: Record<ImageTypeModel, ReadonlyArray<ImageModel>>;
  bookingConditions?: ReadonlyArray<string>;
}

export interface HotelModel extends Omit<HotelDataBySupplierModel, 'lat' | 'lng' | 'city' | 'address' | 'city' | 'country'> {
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
}
