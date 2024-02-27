type AmenityTypeModel = "general" | "room";
type ImageTypeModel = "rooms" | "site";

export interface PaperFliesHotelModel {
  hotel_id: string;
  destination_id: number;
  hotel_name: string;
  location: {
    address: string;
    country: string;
  };
  details: string;
  amenities: Record<AmenityTypeModel, ReadonlyArray<string>>;
  images: Record<
    ImageTypeModel,
    ReadonlyArray<{
      link: string;
      caption: string;
    }>
  >;
  booking_conditions: ReadonlyArray<string>;
}
