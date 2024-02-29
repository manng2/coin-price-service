import axios from 'axios';
import { defaultGetOption } from '../constants';
import { defaultAmenities, defaultImages } from '../constants/default-data.constant';
import {
  AMENITY_NAME_DICTIONARY,
  AMENITY_TYPE_DICTIONARY,
  AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY,
  HOTEL_DATA_KEY_DICTIONARY,
  IMAGE_DATA_KEY_DICTIONARY,
  IMAGE_TYPE_DICTIONARY,
} from '../constants/dictionaries.constant';
import { AmenitiesNameModel, AmenitiesTypeModel, HotelDataBySupplierModel, ImageModel, ImageTypeModel } from '../models';
import { Nullable } from '../models/core.model';
import { GetOptionModel } from '../models/get-option.model';
import { HotelQueryModel } from '../models/hotel.query.model';
import { UncleanedAmenitiesModel, UncleanedHotelDataModel, UncleanedImageModel, UncleanedImagesModel } from '../models/uncleaned-hotel-data.model';
import { generateDataMappingFromDictionary } from '../utils';

// TODO: Remove Any

const hotelFieldMapping = generateDataMappingFromDictionary<keyof HotelDataBySupplierModel>(HOTEL_DATA_KEY_DICTIONARY);
const amenitiesNameMapping = generateDataMappingFromDictionary<AmenitiesNameModel>(AMENITY_NAME_DICTIONARY);
const amenitiesTypeMapping = generateDataMappingFromDictionary<AmenitiesTypeModel>(AMENITY_TYPE_DICTIONARY);
const amenitiesNameToTypeMapping = generateDataMappingFromDictionary<AmenitiesTypeModel>(AMENITY_TYPE_TO_AMENITY_NAME_DICTIONARY);
const imageTypeMapping = generateDataMappingFromDictionary<ImageTypeModel>(IMAGE_TYPE_DICTIONARY);
const imageFieldMapping = generateDataMappingFromDictionary<keyof ImageModel>(IMAGE_DATA_KEY_DICTIONARY);

/**
 * Get value of the key in the uncleaned hotel data model
 * @param value: Uncleaned Hotel Data Model
 * @param key: Key of Uncleaned Hotel Data Model, can have format like this: 'a.b.c' to access nested object
 * @returns Value of the key in the object (might be null if the key is invalid)
 */
function getValueByKey(value: UncleanedHotelDataModel, key: string): Nullable<Object> {
  const keys = key.split('.');
  let res = value;

  for (const k of keys) {
    if (res && typeof res === 'object' && k in res) {
      res = res[k as keyof UncleanedHotelDataModel] as Object;
    } else {
      console.log('- WARNING: Invalid key', key, 'in', value);
      return null;
    }
  }

  return res;
}

/**
 * Mapping data from uncleaned hotel data model to hotel data by supplier model
 * @param data: Uncleaned Hotel Data Model
 * @param key: Key of Uncleaned Hotel Data Model, can have format like this: 'a.b.c' to access nested object
 * @param newKey: Key of Hotel Data By Supplier Model
 * @returns Mapped data
 */
function mappingData(data: UncleanedHotelDataModel, key: keyof UncleanedHotelDataModel, newKey: keyof HotelDataBySupplierModel): Nullable<Object> {
  switch (newKey) {
    case 'amenities': {
      return mappingAmenitiesData(data[key] as UncleanedAmenitiesModel);
    }
    case 'images': {
      return mappingImagesData(data[key] as UncleanedImagesModel);
    }
    default: {
      return getValueByKey(data, key);
    }
  }
}

/**
 * Mapping amenities data from uncleaned amenities model to amenities model
 * @param amenities: Uncleaned Amenities Model
 * @returns Mapped amenities data by hotel data by supplier model
 */
function mappingAmenitiesData(amenities?: UncleanedAmenitiesModel): Record<AmenitiesTypeModel, ReadonlyArray<AmenitiesNameModel>> {
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
      const parsedAmenityName = amenitiesNameMapping[amenity.trim().toLowerCase() as AmenitiesNameModel];
      const type = amenitiesNameToTypeMapping[parsedAmenityName];

      if (type && parsedAmenityName && result[type]) {
        result[type].push(parsedAmenityName);
      }
    });
  } else {
    Object.entries(amenities as Record<string, ReadonlyArray<string>>).forEach(([type, data]) => {
      const newType = amenitiesTypeMapping[type];
      if (newType) {
        result[newType] = data.map((amenity: string) => amenitiesNameMapping[amenity.trim().toLowerCase()]).filter(Boolean) as AmenitiesNameModel[];
      }
    });
  }

  return result;
}

/**
 * Mapping images data from uncleaned images model to images model
 * @param images: Uncleaned Images Model
 * @returns Mapped images data by hotel data by supplier model
 */
function mappingImagesData(images?: UncleanedImagesModel): Record<ImageTypeModel, ReadonlyArray<ImageModel>> {
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
    const newType = imageTypeMapping[type];
    if (newType) {
      result[newType] = data.map((it: UncleanedImageModel) =>
        Object.keys(it).reduce((res, key) => {
          const newKey = imageFieldMapping[key];
          if (newKey) {
            res[newKey] = it[key as keyof UncleanedImageModel];
          }
          return res;
        }, {} as ImageModel),
      );
    }
  });

  return result;
}

/**
 * Procuring data - Map from uncleaned hotel data model to hotel data by supplier model
 * @param data Uncleaned Hotel Data Model
 * @returns Hotel Data By Supplier Model
 */
function cleaningData(data: UncleanedHotelDataModel): HotelDataBySupplierModel {
  const result: Partial<HotelDataBySupplierModel> = {};

  Object.keys(data).forEach((key) => {
    const newKey = hotelFieldMapping[key];

    if (newKey) {
      result[newKey] = mappingData(data, key as keyof UncleanedHotelDataModel, newKey) as any;
    }
  });

  return result as HotelDataBySupplierModel;
}

/**
 * Combine amenities data from two hotel data by supplier model
 * @param first Amenities from first hotel data by supplier model
 * @param second  Amenities from second hotel data by supplier model
 * @returns Combined amenities data
 */
function combineAmenitiesData(
  first: Record<AmenitiesTypeModel, ReadonlyArray<AmenitiesNameModel>>,
  second: Record<AmenitiesTypeModel, ReadonlyArray<AmenitiesNameModel>>,
): Record<AmenitiesTypeModel, ReadonlyArray<AmenitiesNameModel>> {
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

/**
 * Combine images data from two hotel data by supplier model
 * @param first Images from first hotel data by supplier model
 * @param second Images from second hotel data by supplier model
 * @returns Combined images data
 */
function combineImagesData(
  first: Record<ImageTypeModel, ReadonlyArray<ImageModel>>,
  second: Record<ImageTypeModel, ReadonlyArray<ImageModel>>,
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

/**
 * Combine booking conditions data from two hotel data by supplier model
 * @param first Booking conditions from first hotel data by supplier model
 * @param second Booking conditions from second hotel data by supplier model
 * @returns Combined booking conditions data
 */
function combineBookingConditionsData(first: ReadonlyArray<string>, second: ReadonlyArray<string>): string[] {
  const map: Partial<Record<string, boolean>> = {};

  first.forEach((it) => (map[it] = true));
  second.forEach((it) => (map[it] = true));

  return Object.keys(map);
}

/**
 * Merging two hotel data by supplier model has the same id
 * @param first First hotel data by supplier model
 * @param second Second hotel data by supplier model
 * @returns Merged hotel data by supplier model
 */
function combineHotelData(first: HotelDataBySupplierModel, second: HotelDataBySupplierModel): HotelDataBySupplierModel {
  return {
    ...first,
    ...second,
    amenities: combineAmenitiesData(first.amenities || defaultAmenities, second.amenities || defaultAmenities),
    images: combineImagesData(first.images || defaultImages, second.images || defaultImages),
    bookingConditions: combineBookingConditionsData(first.bookingConditions || [], second.bookingConditions || []),
  };
}

/**
 * Merging data from multiple hotel data by supplier model by id
 * @param data Multiple hotel data by supplier model
 * @returns Merged hotel data by supplier model
 */
function mergingData(data: ReadonlyArray<HotelDataBySupplierModel>): HotelDataBySupplierModel[] {
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

function filterHotelDataByQuery(data: ReadonlyArray<UncleanedHotelDataModel>, query?: HotelQueryModel): ReadonlyArray<UncleanedHotelDataModel> {
  const { hotels, destination } = query || {};

  return data.filter((it) => {
    let isMatchedHotelId = true;
    let isMatchedDestination = true;

    if (hotels && hotels.length) {
      const idKeys = HOTEL_DATA_KEY_DICTIONARY.id;

      isMatchedHotelId = idKeys.some((key) => key in it && hotels.includes(it[key as keyof UncleanedHotelDataModel] as string));
    }

    if (destination) {
      const idKeys = HOTEL_DATA_KEY_DICTIONARY.destinationId;

      isMatchedDestination = idKeys.some((key) => key in it && it[key as keyof UncleanedHotelDataModel] === destination);
    }

    return isMatchedHotelId && isMatchedDestination;
  });
}

async function getAllSuppliers(): Promise<ReadonlyArray<string>> {
  return new Promise((resolve) => resolve(['acme', 'patagonia', 'paperflies']));
}

async function getHotelDataBySuppliers(
  suppliers: ReadonlyArray<string>,
  query?: HotelQueryModel,
  options?: GetOptionModel,
): Promise<ReadonlyArray<HotelDataBySupplierModel>> {
  const { batch } = options || defaultGetOption;
  const result: HotelDataBySupplierModel[] = [];
  let size = suppliers.length;
  let start = 0;

  try {
    while (size > 0) {
      const data: UncleanedHotelDataModel[][] = await Promise.all(
        suppliers
          .slice(start, start + batch)
          .map((supplier) => axios.get(`https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/${supplier}`).then((it) => it.data)),
      );

      data.forEach((it) => {
        filterHotelDataByQuery(it, query).forEach((d) => {
          result.push(cleaningData(d));
        });
      });

      size -= batch;
      start += batch;
    }

    return mergingData(result);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export const supplierService = {
  getAllSuppliers,
  getHotelDataBySuppliers,
};
