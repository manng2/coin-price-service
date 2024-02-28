import { AmenitiesNameModel, AmenitiesTypeModel, ImageModel, ImageTypeModel } from '../models/hotel.model';

// TODO: Default data is in case supplier doesn't have this data

export const defaultAmenities: Record<AmenitiesTypeModel, AmenitiesNameModel[]> = {
  [AmenitiesTypeModel.GENERAL]: [],
  [AmenitiesTypeModel.ROOM]: [],
};

export const defaultImages: Record<ImageTypeModel, ReadonlyArray<ImageModel>> = {
  [ImageTypeModel.ROOM]: [],
  [ImageTypeModel.AMENITY]: [],
};
