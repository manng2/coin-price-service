import { HotelDataBySupplierModel } from "../models";
import { AmenitiesNameModel, AmenitiesTypeModel, HotelModel, ImageModel, ImageTypeModel } from "../models/hotel.model";

export const HOTEL_DATA_KEY_DICTIONARY: Record<keyof HotelDataBySupplierModel, string[]> = {
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

export const AMENITY_NAME_DICTIONARY: Record<AmenitiesNameModel, string[]> = {
  [AmenitiesNameModel.POOL]: ["Pool"],
  [AmenitiesNameModel.WIFI]: ["WiFi", "Wifi", "wifi"],
  [AmenitiesNameModel.AIR_CON]: ["Air Conditioner", "Air conditioner"],
  [AmenitiesNameModel.BATHTUB]: ["Bath Tub", "BathTub", "bathtub"],
  [AmenitiesNameModel.BREAKFAST]: ["Breakfast", "breakfast"],
  [AmenitiesNameModel.BAR]: ["Bar", "minibar", "bar"],
  [AmenitiesNameModel.DRY_CLEANING]: [
    "DryCleaning",
    "dry cleaning",
    "dryCleaning",
  ],
  [AmenitiesNameModel.BUSINESS_CENTER]: [
    "BusinessCenter",
    "Business Center",
    "business center",
  ],
  [AmenitiesNameModel.KETTLE]: ["kettle", "Kettle"],
  [AmenitiesNameModel.TV]: ["tv", "TV"],
  [AmenitiesNameModel.HAIRDRYER]: ["hairDryer", "hairDryer", "hair dryer"],
  [AmenitiesNameModel.IRON]: ["iron", "Iron"],
  [AmenitiesNameModel.COFFEE_MACHINE]: ["coffeeMachine", "coffee machine"],
  [AmenitiesNameModel.CHILDCARE]: ["childcare", "ChildCare"],
  [AmenitiesNameModel.OUTDOOR_POOL]: ["outdoor pool", "OutdoorPool"],
  [AmenitiesNameModel.INDOOR_POOL]: ["indoor pool", "IndoorPool"],
};

export const AMENITY_TYPE_DICTIONARY: Record<AmenitiesTypeModel, string[]> = {
  [AmenitiesTypeModel.GENERAL]: ["general", "General", "Other"],
  [AmenitiesTypeModel.ROOM]: ["room", "Room"],
};

export const AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY: Record<
  AmenitiesTypeModel,
  AmenitiesNameModel[]
> = {
  [AmenitiesTypeModel.GENERAL]: [
    AmenitiesNameModel.BAR,
    AmenitiesNameModel.BREAKFAST,
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
  ],
};

export const IMAGE_TYPE_DICTIONARY: Record<ImageTypeModel, string[]> = {
  [ImageTypeModel.ROOM]: ["rooms", "Rooms"],
  [ImageTypeModel.AMENITY]: ["site", "amenities"],
};

export const IMAGE_DATA_KEY_DICTIONARY: Record<keyof ImageModel, string[]> = {
  description: ["description", "caption"],
  link: ["link", "url"],
};
