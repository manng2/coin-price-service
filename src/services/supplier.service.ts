import { defaultGetOption } from "../constants";
import {
  FacilitiesNameModel,
  FacilitiesTypeModel,
  HotelModel,
  ImageModel,
  ImageTypeModel,
} from "../models/hotel.model";
import { UncleanedAmenitiesModel, UncleanedHotelDataModel, UncleanedImageModel, UncleanedImagesModel } from "../models/uncleaned-hotel-data.model";

// TODO: Remove Any

const HOTEL_DATA_KEY_DICTIONARY: Record<keyof HotelModel, string[]> = {
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

const FACILITY_NAME_DICTIONARY: Record<FacilitiesNameModel, string[]> = {
  [FacilitiesNameModel.POOL]: ["Pool"],
  [FacilitiesNameModel.WIFI]: ["WiFi", "Wifi"],
  [FacilitiesNameModel.AIR_CON]: ["Air Conditioner", "Air conditioner"],
  [FacilitiesNameModel.BATHTUB]: ["Bath Tub", "BathTub"],
  [FacilitiesNameModel.BREAKFAST]: ["Breakfast", "breakfast"],
  [FacilitiesNameModel.BAR]: ["Bar"],
  [FacilitiesNameModel.DRY_CLEANING]: [
    "DryCleaning",
    "dry cleaning",
    "dryCleaning",
  ],
  [FacilitiesNameModel.BUSINESS_CENTER]: ["BusinessCenter", "Business Center"],
  [FacilitiesNameModel.KETTLE]: ["kettle", "Kettle"],
  [FacilitiesNameModel.TV]: ["tv", "TV"],
  [FacilitiesNameModel.HAIRDRYER]: ["hairDryer", "hairDryer"],
};

const FACILITY_TYPE_DICTIONARY: Record<FacilitiesTypeModel, string[]> = {
  [FacilitiesTypeModel.GENERAL]: ["general", "General", "Other"],
  [FacilitiesTypeModel.ROOM]: ["room", "Room"],
};

const FACILITY_TYPE_TO_FACILITY_NAME_DICTIONARY: Record<
  FacilitiesTypeModel,
  FacilitiesNameModel[]
> = {
  [FacilitiesTypeModel.GENERAL]: [
    FacilitiesNameModel.BAR,
    FacilitiesNameModel.BREAKFAST,
    FacilitiesNameModel.BUSINESS_CENTER,
    FacilitiesNameModel.POOL,
  ],
  [FacilitiesTypeModel.ROOM]: [
    FacilitiesNameModel.WIFI,
    FacilitiesNameModel.BATHTUB,
    FacilitiesNameModel.BREAKFAST,
    FacilitiesNameModel.KETTLE,
    FacilitiesNameModel.TV,
    FacilitiesNameModel.HAIRDRYER,
    FacilitiesNameModel.AIR_CON,
  ],
};

const IMAGE_TYPE_DICTIONARY: Record<ImageTypeModel, string[]> = {
  [ImageTypeModel.ROOM]: ["rooms", "Rooms"],
  [ImageTypeModel.FACILITY]: ["site", "amenities"],
};

const IMAGE_DATA_KEY_DICTIONARY: Record<keyof ImageModel, string[]> = {
  description: ["description", "caption"],
  link: ["link", "url"],
};

function generateDataMappingFromDictionary<T>(
  dictionary: Record<string, string[]>
): Map<string, T> {
  const result = new Map<string, T>();

  Object.entries(dictionary).forEach((pair) => {
    const [key, dirtyKeys] = pair;
    dirtyKeys.forEach((it) => result.set(it, key as T));
  });

  return result;
}

const fieldMapping = generateDataMappingFromDictionary<keyof HotelModel>(
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
const imageDataKeyMapping = generateDataMappingFromDictionary<keyof ImageModel>(
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

function mappingObjectData(
  data: UncleanedHotelDataModel,
  key: string,
  newKey: keyof HotelModel
): Object {
  switch (newKey) {
    case "amenities": {
      return mappingAmenitiesData(data[key as keyof UncleanedHotelDataModel] as UncleanedAmenitiesModel);
    }
    case "images": {
      return mappingImagesData(data[key as keyof UncleanedHotelDataModel] as UncleanedImagesModel);
    }
    default: {
      return {};
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
    amenities.forEach((amenity) => {
      const parsedAmenityName = facilitiesNameMapping.get(
        amenity
      ) as FacilitiesNameModel;
      const type = facilitiesNameToTypeMapping.get(amenity);

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
            .map((amenity: string) => facilitiesNameMapping.get(amenity))
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
          const newKey = imageDataKeyMapping.get(key);
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

function mappingData(data: UncleanedHotelDataModel): HotelModel {
  const result: Partial<HotelModel> = {};

  Object.keys(data).forEach((key) => {
    const newKey = fieldMapping.get(key);

    if (newKey && newKey in result) {
      const mappedData = getValueByKey(data, key);

      if (mappedData && typeof mappedData === "object") {
        result[newKey] = mappingObjectData(data, key, newKey) as any;
      } else {
        result[newKey] = mappedData as any;
      }
    }
  })

  return result as HotelModel;
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
        it.forEach((d) => result.push(mappingData(d)));
      });

      size -= batch;
      start += batch;
    }

    resolve(result);
  });
}

export const supplierService = {
  getAllSuppliers,
  getHotelDataBySuppliers,
};
