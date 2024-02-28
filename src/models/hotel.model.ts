import { Nullable } from "./core.model";

export enum ImageTypeModel {
  ROOM = "rooms",
  AMENITY = "amenity",
}

export enum AmenitiesTypeModel {
  GENERAL = 'general',
  ROOM = 'room'
}

export interface ImageModel {
  link: string;
  description: string;
}

export enum AmenitiesNameModel {
  POOL = "pool",
  WIFI = "wifi",
  AIR_CON = "airCon",
  BATHTUB = "bathTub",
  BREAKFAST = "breakfast",
  BAR = "bar",
  DRY_CLEANING = "dryCleaning",
  BUSINESS_CENTER = "businessCenter",
  KETTLE = "kettle",
  TV = "tv",
  HAIRDRYER = "hairDryer",
  OUTDOOR_POOL = "outdoorPool",
  INDOOR_POOL = "indoorPool",
  CHILDCARE = "childcare",
  COFFEE_MACHINE = "coffeeMachine",
  IRON = "iron",
}

export interface HotelModel {
  id: string;
  destinationId: number;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  description: string;
  amenities: Nullable<Record<AmenitiesTypeModel, AmenitiesNameModel[]>>;
  images: Nullable<Record<ImageTypeModel, ReadonlyArray<ImageModel>>>;
  bookingConditions: Nullable<ReadonlyArray<string>>;
}
