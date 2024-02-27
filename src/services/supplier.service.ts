import { defaultGetOption } from "../constants";
import {
  defaultAmenities,
  defaultImages,
} from "../constants/default-data.constant";
import {
  HOTEL_DATA_KEY_DICTIONARY,
  AMENITY_NAME_DICTIONARY,
  AMENITY_TYPE_DICTIONARY,
  IMAGE_TYPE_DICTIONARY,
  IMAGE_DATA_KEY_DICTIONARY,
  AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY,
} from "../constants/dictionaries.constant";
import { Nullable } from "../models/core.model";
import {
  AmenitiesNameModel,
  AmenitiesTypeModel,
  HotelDataBySupplierModel,
  ImageModel,
  ImageTypeModel,
} from "../models";
import {
  UncleanedAmenitiesModel,
  UncleanedHotelDataModel,
  UncleanedImageModel,
  UncleanedImagesModel,
} from "../models/uncleaned-hotel-data.model";
import { generateDataMappingFromDictionary } from "../utils";
import { HotelQueryModel } from "../models/hotel.query.model";
import { GetOptionModel } from "../models/get-option.model";

// TODO: Remove Any

const hotelFieldMapping = generateDataMappingFromDictionary<keyof HotelDataBySupplierModel>(
  HOTEL_DATA_KEY_DICTIONARY
);
const amenitiesNameMapping =
  generateDataMappingFromDictionary<AmenitiesNameModel>(
    AMENITY_NAME_DICTIONARY
  );
const amenitiesTypeMapping =
  generateDataMappingFromDictionary<AmenitiesTypeModel>(
    AMENITY_TYPE_DICTIONARY
  );
const amenitiesNameToTypeMapping =
  generateDataMappingFromDictionary<AmenitiesTypeModel>(
    AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY
  );
const imageTypeMapping = generateDataMappingFromDictionary<ImageTypeModel>(
  IMAGE_TYPE_DICTIONARY
);
const imageFieldMapping = generateDataMappingFromDictionary<keyof ImageModel>(
  IMAGE_DATA_KEY_DICTIONARY
);

function getValueByKey(
  value: UncleanedHotelDataModel,
  key: string
): null | Object {
  const keys = key.split(".");
  let res = value;

  for (const k of keys) {
    if (res && typeof res === "object" && k in res) {
      res = res[k as keyof UncleanedHotelDataModel] as any;
    } else {
      return null;
    }
  }

  return res;
}

function mappingData(
  data: UncleanedHotelDataModel,
  key: keyof UncleanedHotelDataModel,
  newKey: keyof HotelDataBySupplierModel
): Nullable<Object> {
  switch (newKey) {
    case "amenities": {
      return mappingAmenitiesData(data[key] as UncleanedAmenitiesModel);
    }
    case "images": {
      return mappingImagesData(data[key] as UncleanedImagesModel);
    }
    default: {
      return getValueByKey(data, key);
    }
  }
}

function mappingAmenitiesData(
  amenities: UncleanedAmenitiesModel
): Record<AmenitiesTypeModel, AmenitiesNameModel[]> {
  if (!amenities) {
    return {
      [AmenitiesTypeModel.GENERAL]: [],
      [AmenitiesTypeModel.ROOM]: [],
    };
  }

  const result: Record<AmenitiesTypeModel, AmenitiesNameModel[]> = {
    [AmenitiesTypeModel.GENERAL]: [],
    [AmenitiesTypeModel.ROOM]: [],
  };

  if (Array.isArray(amenities)) {
    (amenities as ReadonlyArray<string>).forEach((amenity) => {
      const parsedAmenityName = amenitiesNameMapping.get(
        amenity.trim().toLowerCase()
      ) as AmenitiesNameModel;
      const type = amenitiesNameToTypeMapping.get(parsedAmenityName);

      if (type && parsedAmenityName && result[type]) {
        result[type].push(parsedAmenityName);
      }
    });
  } else {
    Object.entries(amenities as Record<string, ReadonlyArray<string>>).forEach(
      ([type, data]) => {
        const newType = amenitiesTypeMapping.get(type);
        if (newType) {
          result[newType] = data
            .map((amenity: string) =>
              amenitiesNameMapping.get(amenity.trim().toLowerCase())
            )
            .filter(Boolean) as AmenitiesNameModel[];
        }
      }
    );
  }

  return result;
}

function mappingImagesData(
  images: UncleanedImagesModel
): Record<ImageTypeModel, ReadonlyArray<ImageModel>> {
  if (!images) {
    return {
      [ImageTypeModel.ROOM]: [],
      [ImageTypeModel.AMENITY]: [],
    };
  }

  const result: Record<ImageTypeModel, ReadonlyArray<ImageModel>> = {
    [ImageTypeModel.ROOM]: [],
    [ImageTypeModel.AMENITY]: [],
  };

  Object.entries(images).forEach(([type, data]) => {
    const newType = imageTypeMapping.get(type);
    if (newType) {
      result[newType] = data.map((it: UncleanedImageModel) =>
        Object.keys(it).reduce((res, key) => {
          const newKey = imageFieldMapping.get(key);
          if (newKey) {
            res[newKey] = it[key as keyof UncleanedImageModel];
          }
          return res;
        }, {} as ImageModel)
      );
    }
  });

  return result;
}

function cleaningData(data: UncleanedHotelDataModel): HotelDataBySupplierModel {
  const result: Partial<HotelDataBySupplierModel> = {};

  Object.keys(data).forEach((key) => {
    const newKey = hotelFieldMapping.get(key);

    if (newKey) {
      result[newKey] = mappingData(
        data,
        key as keyof UncleanedHotelDataModel,
        newKey
      ) as any;
    }
  });

  return result as HotelDataBySupplierModel;
}

function combineAmenitiesData(
  first: Record<AmenitiesTypeModel, AmenitiesNameModel[]>,
  second: Record<AmenitiesTypeModel, AmenitiesNameModel[]>
): Record<AmenitiesTypeModel, AmenitiesNameModel[]> {
  const generalMap: Partial<Record<AmenitiesNameModel, boolean>> = {};
  const roomMap: Partial<Record<AmenitiesNameModel, boolean>> = {};

  first.general.forEach((it) => (generalMap[it] = true));
  second.general.forEach((it) => (generalMap[it] = true));
  first.room.forEach((it) => (roomMap[it] = true));
  second.room.forEach((it) => (roomMap[it] = true));

  return {
    general: Object.keys(generalMap) as AmenitiesNameModel[],
    room: Object.keys(roomMap) as AmenitiesNameModel[],
  };
}

function combineImagesData(
  first: Record<ImageTypeModel, ReadonlyArray<ImageModel>>,
  second: Record<ImageTypeModel, ReadonlyArray<ImageModel>>
): Record<ImageTypeModel, ReadonlyArray<ImageModel>> {
  const roomImages: ImageModel[] = [];
  const amenityImages: ImageModel[] = [];

  first.rooms.forEach((it) => roomImages.push(it));
  second.rooms.forEach((it) => roomImages.push(it));
  first.amenity.forEach((it) => amenityImages.push(it));
  second.amenity.forEach((it) => amenityImages.push(it));

  return {
    [ImageTypeModel.ROOM]: roomImages,
    [ImageTypeModel.AMENITY]: amenityImages,
  };
}

function combineHotelData(first: HotelDataBySupplierModel, second: HotelDataBySupplierModel): HotelDataBySupplierModel {
  return {
    ...first,
    ...second,
    amenities: combineAmenitiesData(
      first.amenities || defaultAmenities,
      second.amenities || defaultAmenities
    ),
    images: combineImagesData(
      first.images || defaultImages,
      second.images || defaultImages
    ),
  };
}

function mergingData(data: HotelDataBySupplierModel[]): HotelDataBySupplierModel[] {
  const result: Record<string, HotelDataBySupplierModel> = {};

  data.forEach((it) => {
    const id = it.id;
    if (id in result) {
      result[id] = combineHotelData(result[id], it);
    } else {
      result[id] = it;
    }
  });

  return Object.values(result);
}

function filterHotelDataByQuery(data: UncleanedHotelDataModel[], query?: HotelQueryModel): UncleanedHotelDataModel[] {
  const { hotels, destination } = query || {};

  return data.filter((it) => {
    let isFilteredByHotel = false;
    let isFilteredByDestination = false;

    if (hotels && hotels.length) {
      const idKeys = HOTEL_DATA_KEY_DICTIONARY.id;

      isFilteredByHotel = idKeys.some((key) => (key in it && hotels.includes(it[key as keyof UncleanedHotelDataModel] as string)))
    }

    if (destination) {
      const idKeys = HOTEL_DATA_KEY_DICTIONARY.destinationId;

      isFilteredByDestination = idKeys.some((key) => (key in it && it[key as keyof UncleanedHotelDataModel] === destination));
    }

    return !isFilteredByDestination && !isFilteredByHotel;
  });
}

async function getAllSuppliers(): Promise<string[]> {
  return new Promise((resolve) =>
    resolve([
      "acme",
      "patagonia",
      "paperflies"
    ])
  );
}

async function getHotelDataBySuppliers(
  suppliers: string[],
  query?: HotelQueryModel,
  options?: GetOptionModel
): Promise<HotelDataBySupplierModel[]> {
  return new Promise(async (resolve, reject) => {
    const { batch } = options || defaultGetOption;
    const result: HotelDataBySupplierModel[] = [];
    let size = suppliers.length;
    let start = 0;

    try {
      while (size > 0) {
        const data: UncleanedHotelDataModel[][] = await Promise.all(
          suppliers
            .slice(start, start + batch)
            .map((supplier) =>
              fetch(
                `https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/${supplier}`
              ).then((it) => it.json())
            )
        );

        data.forEach((it) => {
          filterHotelDataByQuery(it, query).forEach((d) => {
            result.push(cleaningData(d));
          });
        });

        size -= batch;
        start += batch;
      }

      resolve(mergingData(result));
    } catch (error) {
      reject(error);
    }
  });
}

export const supplierService = {
  getAllSuppliers,
  getHotelDataBySuppliers,
};
