import { FacilitiesNameModel, FacilitiesTypeModel, ImageModel, ImageTypeModel } from "../models/hotel.model";

// TODO: Default data is in case supplier doesn't have this data

export const defaultAmenities: Record<FacilitiesTypeModel, FacilitiesNameModel[]> = {
    [FacilitiesTypeModel.GENERAL]: [],
    [FacilitiesTypeModel.ROOM]: []
}

export const defaultImages: Record<ImageTypeModel, ReadonlyArray<ImageModel>> = {
    [ImageTypeModel.ROOM]: [],
    [ImageTypeModel.FACILITY]: [],
}
