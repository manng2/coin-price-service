import { defaultGetOption } from "../constants";
import {
  FacilitiesNameModel,
  FacilitiesTypeModel,
  FlattenHotelModel,
} from "../models/hotel.model";

// TODO: Remove any

const DATA_KEY_TO_DIRTY_KEYS: Record<keyof FlattenHotelModel, string[]> = {
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

const FACILITIES_NAME_TO_DIRTY_KEYS: Record<FacilitiesNameModel, string[]> = {
  [FacilitiesNameModel.POOL]: ["Pool"],
  [FacilitiesNameModel.WIFI]: ["WiFi", "Wifi"],
  [FacilitiesNameModel.AIR_CON]: ["Air Conditioner", "Air conditioner"],
  [FacilitiesNameModel.BATHTUB]: ["Bath Tub", "BathTub"],
  [FacilitiesNameModel.BREAKFAST]: ["Breakfast", "breakfast"],
  [FacilitiesNameModel.BAR]: ["Bar"],
  [FacilitiesNameModel.DRY_CLEANING]: ["DryCleaning", "dry cleaning", "dryCleaning"],
  [FacilitiesNameModel.BUSINESS_CENTER]: ["BusinessCenter", "Business Center"],
  [FacilitiesNameModel.KETTLE]: ["kettle", "Kettle"],
  [FacilitiesNameModel.TV]: ["tv", "TV"],
  [FacilitiesNameModel.HAIRDRYER]: ["hairDryer", "hairDryer"],
};

const FACILITIES_TYPE_TO_FACILITIES_NAMES: Record<
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

const FACILITIES_TYPE_TO_DIRTY_KEYS: Record<FacilitiesTypeModel, string[]> = {
  [FacilitiesTypeModel.GENERAL]: ['general', 'General', 'Other'],
  [FacilitiesTypeModel.ROOM]: ['room', 'Room']
}

function generateDataMapping<T>(
  dictionary: Record<string, string[]>
): Map<string, T> {
  const result = new Map<string, T>();

  Object.entries(dictionary).forEach((pair) => {
    const [key, dirtyKeys] = pair;
    dirtyKeys.forEach((it) => result.set(it, key as T));
  });

  return result;
}

const fieldMapping = generateDataMapping<keyof FlattenHotelModel>(DATA_KEY_TO_DIRTY_KEYS);
const facilitiesNameMapping = generateDataMapping<FacilitiesNameModel>(FACILITIES_NAME_TO_DIRTY_KEYS);
const facilitiesTypeMapping = generateDataMapping<FacilitiesTypeModel>(FACILITIES_TYPE_TO_DIRTY_KEYS);
const facilitiesNameToTypeMapping = generateDataMapping<FacilitiesTypeModel>(FACILITIES_TYPE_TO_FACILITIES_NAMES);

function getValueByKey(value: any, key: string): any {
  const keys = key.split(".");
  let res = value;

  for (const k of keys) {
    if (res && typeof res === "object" && k in res) {
      res = res[k];
    } else {
      return undefined;
    }
  }

  return res;
}

function mappingData(data: any): FlattenHotelModel {
  return Object.keys(data).reduce((res, key) => {
    const newKey = fieldMapping.get(key);

    if (newKey) {
      const mappedData = getValueByKey(data, key) as never;

      if (typeof mappedData === 'object') {
        res[newKey] = mappingObjectData(data, key, newKey) as never;
      } else {
        res[newKey] = mappedData;
      }
    }

    return res;
  }, {} as FlattenHotelModel);
}

function mappingObjectData(data: any, key: string, newKey: keyof FlattenHotelModel): any {
  switch (key) {
    case 'amenities': {
      const amenities = data[key];

      if (!amenities) {
        return {};
      }

      const result: Record<FacilitiesTypeModel, Partial<Record<keyof FacilitiesNameModel, boolean>>> = {
        [FacilitiesTypeModel.GENERAL]: {},
        [FacilitiesTypeModel.ROOM]: {}
      }


      if (Array.isArray(amenities)) {
        amenities.forEach(amenity => {
          const parsedAmenityName = facilitiesNameMapping.get(amenity) as FacilitiesNameModel;
          const type = facilitiesNameToTypeMapping.get(amenity);

          if (type) {
            result[type][parsedAmenityName as unknown as keyof FacilitiesNameModel] = true
          }

        })

        return result;
      } else {
        Object.keys(amenities).forEach(type => {
          const newType = facilitiesTypeMapping.get(type);
          if (newType) {
            result[newType] = amenities[type].map((amenity: string) => facilitiesNameMapping.get(amenity))
          }
        })
      }

      return result;
    }
    default: {
      return {}
    }
  }
}

async function getAllSuppliers(): Promise<string[]> {
  return new Promise((resolve) => resolve(["acme", "patagonia", "paperflies"]));
}

async function getHotelDataBySuppliers(
  suppliers: string[],
  options?: {
    batch: number;
  }
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const { batch } = options || defaultGetOption;
    const result: FlattenHotelModel[] = [];
    let size = suppliers.length;
    let start = 0;

    while (size > 0) {
      const data = await Promise.all(
        suppliers
          .slice(start, start + batch)
          .map((supplier) =>
            fetch(
              `https://5f2be0b4ffc88500167b85a0.mockapi.io/suppliers/${supplier}`
            ).then((it) => it.json())
          )
      );

      data.forEach((it) => {
        it.forEach((d: any) => result.push(mappingData(d)));
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
