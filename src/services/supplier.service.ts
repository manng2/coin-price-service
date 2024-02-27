import { defaultGetOption } from "../constants";
import { defaultAmenities, defaultImages } from "../constants/default-data.constant";
import { HOTEL_DATA_KEY_DICTIONARY, FACILITY_NAME_DICTIONARY, FACILITY_TYPE_DICTIONARY, IMAGE_TYPE_DICTIONARY, IMAGE_DATA_KEY_DICTIONARY, FACILITY_TYPE_TO_FACILITY_NAME_DICTIONARY } from "../constants/dictionaries.constant";
import { Nullable } from "../models/core.model";
import {
  FacilitiesNameModel,
  FacilitiesTypeModel,
  HotelModel,
  ImageModel,
  ImageTypeModel,
} from "../models/hotel.model";
import { UncleanedAmenitiesModel, UncleanedHotelDataModel, UncleanedImageModel, UncleanedImagesModel } from "../models/uncleaned-hotel-data.model";
import { generateDataMappingFromDictionary } from "../utils";

// TODO: Remove Any

const hotelFieldMapping = generateDataMappingFromDictionary<keyof HotelModel>(
  HOTEL_DATA_KEY_DICTIONARY
);
const facilitiesNameMapping =
  generateDataMappingFromDictionary<FacilitiesNameModel>(
    FACILITY_NAME_DICTIONARY
  );
const facilitiesTypeMapping =
  generateDataMappingFromDictionary<FacilitiesTypeModel>(
    FACILITY_TYPE_DICTIONARY
  );
const facilitiesNameToTypeMapping =
  generateDataMappingFromDictionary<FacilitiesTypeModel>(
    FACILITY_TYPE_TO_FACILITY_NAME_DICTIONARY
  );
const imageTypeMapping = generateDataMappingFromDictionary<ImageTypeModel>(
  IMAGE_TYPE_DICTIONARY
);
const imageFieldMapping = generateDataMappingFromDictionary<keyof ImageModel>(
  IMAGE_DATA_KEY_DICTIONARY
);

function getValueByKey(value: UncleanedHotelDataModel, key: string): null | Object {
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
  newKey: keyof HotelModel
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
): Record<FacilitiesTypeModel, FacilitiesNameModel[]> {
  if (!amenities) {
    return {
      [FacilitiesTypeModel.GENERAL]: [],
      [FacilitiesTypeModel.ROOM]: [],
    };
  }

  const result: Record<FacilitiesTypeModel, FacilitiesNameModel[]> = {
    [FacilitiesTypeModel.GENERAL]: [],
    [FacilitiesTypeModel.ROOM]: [],
  };

  if (Array.isArray(amenities)) {
    (amenities as ReadonlyArray<string>).forEach((amenity) => {
      const parsedAmenityName = facilitiesNameMapping.get(
        amenity.trim().toLowerCase()
      ) as FacilitiesNameModel;
      const type = facilitiesNameToTypeMapping.get(parsedAmenityName);

      if (type && parsedAmenityName && result[type]) {
        result[type].push(parsedAmenityName);
      }
    });
  } else {
    Object.entries(amenities as Record<string, ReadonlyArray<string>>).forEach(
      ([type, data]) => {
        const newType = facilitiesTypeMapping.get(type);
        if (newType) {
          result[newType] = data
            .map((amenity: string) => facilitiesNameMapping.get(amenity.trim().toLowerCase()))
            .filter(Boolean) as FacilitiesNameModel[];
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
      [ImageTypeModel.FACILITY]: [],
    };
  }

  const result: Record<ImageTypeModel, ReadonlyArray<ImageModel>> = {
    [ImageTypeModel.ROOM]: [],
    [ImageTypeModel.FACILITY]: [],
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

function cleaningData(data: UncleanedHotelDataModel): HotelModel {
  const result: Partial<HotelModel> = {};

  Object.keys(data).forEach((key) => {
    const newKey = hotelFieldMapping.get(key);

    if (newKey) {
      result[newKey] = mappingData(data, key as keyof UncleanedHotelDataModel, newKey) as any;
    }
  })

  return result as HotelModel;
}

function combineAmenitiesData(first: Record<FacilitiesTypeModel, FacilitiesNameModel[]>, second: Record<FacilitiesTypeModel, FacilitiesNameModel[]>): Record<FacilitiesTypeModel, FacilitiesNameModel[]> {
  const generalMap: Partial<Record<FacilitiesNameModel, boolean>> = {};
  const roomMap: Partial<Record<FacilitiesNameModel, boolean>> = {};

  first.general.forEach((it) => generalMap[it] = true);
  second.general.forEach((it) => generalMap[it] = true);
  first.room.forEach((it) => roomMap[it] = true);
  second.room.forEach((it) => roomMap[it] = true);

  return {
    general: Object.keys(generalMap) as FacilitiesNameModel[],
    room: Object.keys(roomMap) as FacilitiesNameModel[],
  };
}

function combineImagesData(first: Record<ImageTypeModel, ReadonlyArray<ImageModel>>, second: Record<ImageTypeModel, ReadonlyArray<ImageModel>>): Record<ImageTypeModel, ReadonlyArray<ImageModel>> {
  const roomImages: ImageModel[] = [];
  const facilityImages: ImageModel[] = [];

  first.rooms.forEach((it) => roomImages.push(it));
  second.rooms.forEach((it) => roomImages.push(it));
  first.facility.forEach((it) => facilityImages.push(it));
  second.facility.forEach((it) => facilityImages.push(it));

  return {
    [ImageTypeModel.ROOM]: roomImages,
    [ImageTypeModel.FACILITY]: facilityImages,
  };
}

function combineHotelData(first: HotelModel, second: HotelModel): HotelModel {
  console.log(first, second)
  return {
    ...first,
    ...second,
    amenities: combineAmenitiesData(first.amenities || defaultAmenities, second.amenities || defaultAmenities),
    images: combineImagesData(first.images || defaultImages, second.images || defaultImages)
  };
}

function mergingData(data: HotelModel[]): HotelModel[] {
  const result: Record<string, HotelModel> = {};

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

async function getAllSuppliers(): Promise<string[]> {
  return new Promise((resolve) => resolve(["acme", "patagonia", "paperflies"]));
}

async function getHotelDataBySuppliers(
  suppliers: string[],
  options?: {
    batch: number;
  }
): Promise<HotelModel[]> {
  return new Promise(async (resolve, reject) => {
    const { batch } = options || defaultGetOption;
    const result: HotelModel[] = [];
    let size = suppliers.length;
    let start = 0;

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
        it.forEach((d) => result.push(cleaningData(d)));
      });

      size -= batch;
      start += batch;
    }

    resolve(mergingData(result));
  });
}

export const supplierService = {
  getAllSuppliers,
  getHotelDataBySuppliers,
};
