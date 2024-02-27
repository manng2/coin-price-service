export enum ImageTypeModel {
  ROOM = "rooms",
  FACILITY = "facility",
}

export enum FacilitiesTypeModel {
  GENERAL = 'general',
  ROOM = 'room'
}

export interface ImageModel {
  link: string;
  description: string;
}

export enum FacilitiesNameModel {
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
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  description: string;
  amenities?: Record<FacilitiesTypeModel, FacilitiesNameModel[]>;
  images?: Record<
    ImageTypeModel,
    ReadonlyArray<ImageModel>
  >;
  bookingConditions: ReadonlyArray<string>;
}

// export interface HotelModel {
//   id: string;
//   destinationId: number;
//   name: string;
//   location: {
//     lat: number;
//     lng: number;
//     address: string;
//     city: string;
//     country: string;
//   };
//   description: string;
//   amenities: Record<AmenityModel, ReadonlyArray<string>>;
//   images: Record<
//     ImageModel,
//     ReadonlyArray<{
//       link: string;
//       description: string;
//     }>
//   >;
//   bookingConditions: ReadonlyArray<string>;
// }
