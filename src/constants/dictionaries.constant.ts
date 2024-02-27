import { FacilitiesNameModel, FacilitiesTypeModel, HotelModel, ImageModel, ImageTypeModel } from "../models/hotel.model";

export const HOTEL_DATA_KEY_DICTIONARY: Record<keyof HotelModel, string[]> = {
  id: ["Id", "id", "hotel_id"],
  destinationId: ["DestinationId", "destination", "destination_id"],
  name: ["Name", "name", "hotel_name"],
  lat: ["Latitude", "lat"],
  lng: ["Longitude", "lng"],
  address: ["Address", "address", "location.address"],
  city: ["City"],
  country: ["Country", "location.country"],
  description: ["Description", "info", "details"],
  amenities: ["Facilities", "amenities"],
  images: ["images"],
  bookingConditions: ["booking_conditions"],
};

export const FACILITY_NAME_DICTIONARY: Record<FacilitiesNameModel, string[]> = {
  [FacilitiesNameModel.POOL]: ["Pool"],
  [FacilitiesNameModel.WIFI]: ["WiFi", "Wifi", "wifi"],
  [FacilitiesNameModel.AIR_CON]: ["Air Conditioner", "Air conditioner"],
  [FacilitiesNameModel.BATHTUB]: ["Bath Tub", "BathTub", "bathtub"],
  [FacilitiesNameModel.BREAKFAST]: ["Breakfast", "breakfast"],
  [FacilitiesNameModel.BAR]: ["Bar", "minibar"],
  [FacilitiesNameModel.DRY_CLEANING]: [
    "DryCleaning",
    "dry cleaning",
    "dryCleaning",
  ],
  [FacilitiesNameModel.BUSINESS_CENTER]: [
    "BusinessCenter",
    "Business Center",
    "business center",
  ],
  [FacilitiesNameModel.KETTLE]: ["kettle", "Kettle"],
  [FacilitiesNameModel.TV]: ["tv", "TV"],
  [FacilitiesNameModel.HAIRDRYER]: ["hairDryer", "hairDryer", "hair dryer"],
  [FacilitiesNameModel.IRON]: ["iron", "Iron"],
  [FacilitiesNameModel.COFFEE_MACHINE]: ["coffeeMachine", "coffee machine"],
  [FacilitiesNameModel.CHILDCARE]: ["childcare", "ChildCare"],
  [FacilitiesNameModel.OUTDOOR_POOL]: ["outdoor pool", "OutdoorPool"],
  [FacilitiesNameModel.INDOOR_POOL]: ["indoor pool", "IndoorPool"],
};

export const FACILITY_TYPE_DICTIONARY: Record<FacilitiesTypeModel, string[]> = {
  [FacilitiesTypeModel.GENERAL]: ["general", "General", "Other"],
  [FacilitiesTypeModel.ROOM]: ["room", "Room"],
};

export const FACILITY_TYPE_TO_FACILITY_NAME_DICTIONARY: Record<
  FacilitiesTypeModel,
  FacilitiesNameModel[]
> = {
  [FacilitiesTypeModel.GENERAL]: [
    FacilitiesNameModel.BAR,
    FacilitiesNameModel.BREAKFAST,
    FacilitiesNameModel.BUSINESS_CENTER,
    FacilitiesNameModel.POOL,
    FacilitiesNameModel.COFFEE_MACHINE,
    FacilitiesNameModel.CHILDCARE,
    FacilitiesNameModel.OUTDOOR_POOL,
    FacilitiesNameModel.INDOOR_POOL,
  ],
  [FacilitiesTypeModel.ROOM]: [
    FacilitiesNameModel.WIFI,
    FacilitiesNameModel.BATHTUB,
    FacilitiesNameModel.BREAKFAST,
    FacilitiesNameModel.KETTLE,
    FacilitiesNameModel.TV,
    FacilitiesNameModel.HAIRDRYER,
    FacilitiesNameModel.AIR_CON,
    FacilitiesNameModel.DRY_CLEANING,
    FacilitiesNameModel.IRON,
  ],
};

export const IMAGE_TYPE_DICTIONARY: Record<ImageTypeModel, string[]> = {
  [ImageTypeModel.ROOM]: ["rooms", "Rooms"],
  [ImageTypeModel.FACILITY]: ["site", "amenities"],
};

export const IMAGE_DATA_KEY_DICTIONARY: Record<keyof ImageModel, string[]> = {
  description: ["description", "caption"],
  link: ["link", "url"],
};
