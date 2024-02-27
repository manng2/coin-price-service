type ImageTypeModel = "rooms" | "amenities";

export interface PatagoniaHotelModel {
  id: string;
  destination: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
  info: string;
  amenities: ReadonlyArray<string>;
  images: Record<
    ImageTypeModel,
    ReadonlyArray<{
      url: string;
      description: string;
    }>
  >;
}
