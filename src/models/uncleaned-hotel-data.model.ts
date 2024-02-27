export interface UncleanedHotelDataModel extends Partial<DataModel> {}

export type UncleanedAmenitiesModel = Record<string, ReadonlyArray<string>> | ReadonlyArray<string>;

export type UncleanedImagesModel = Record<string, ReadonlyArray<UncleanedImageModel>>;

export type UncleanedImageModel =
  | {
      url: string;
      description: string;
    }
  | {
      link: string;
      caption: string;
    };

interface DataModel {
  Id: string;
  DestinationId: number;
  Name: string;
  Latitude: number;
  Longitude: number;
  Address: string;
  City: string;
  Country: string;
  PostalCode: string;
  Description: string;
  Facilities: ReadonlyArray<string>;
  hotel_id: string;
  destination_id: number;
  hotel_name: string;
  details: string;
  amenities: UncleanedAmenitiesModel;
  images: UncleanedImagesModel;
  booking_conditions: ReadonlyArray<string>;
  location: {
    address: string;
    country: string;
  };
  id: string;
  destination: number;
  name: string;
  lat: number;
  lng: number;
  info: string;
  address: string;
}
