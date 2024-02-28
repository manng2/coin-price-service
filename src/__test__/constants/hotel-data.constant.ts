import {
  UncleanedHotelDataModel,
  HotelDataBySupplierModel,
  AmenitiesNameModel,
} from "../../models";

const uncleanedMockData1: UncleanedHotelDataModel = {
  Id: "1",
  DestinationId: 1,
  Name: "Hotel 1",
  Latitude: 1,
  Longitude: 1,
  Address: "Address 1",
  City: "City 1",
  Country: "Country 1",
  PostalCode: "Postal Code 1",
  Description: "Description 1",
  Facilities: ["Facility 1"],
};

const cleanedMockData1: HotelDataBySupplierModel = {
  id: "1",
  destinationId: 1,
  name: "Hotel 1",
  lat: 1,
  lng: 1,
  address: "Address 1",
  city: "City 1",
  country: "Country 1",
  description: "Description 1",
  bookingConditions: ["Booking Condition 1"],
  amenities: {
    general: [],
    room: [],
  },
  images: {
    rooms: [],
    amenity: [],
  },
};

const uncleanedMockData2: UncleanedHotelDataModel = {
  hotel_id: "2",
  destination_id: 2,
  hotel_name: "Hotel 2",
  details: "Description 2",
  amenities: [
    AmenitiesNameModel.BREAKFAST,
    AmenitiesNameModel.BAR,
    AmenitiesNameModel.BATHTUB,
  ],
  images: {
    room: [
      {
        url: "URL 2",
        description: "Description 2",
      },
    ],
    site: [
      {
        link: "Link 2",
        caption: "Caption 2",
      },
    ],
  },
  booking_conditions: ["Booking Condition 2"],
};

const cleanedMockData2: HotelDataBySupplierModel = {
  id: "2",
  destinationId: 2,
  name: "Hotel 2",
  lat: 2,
  lng: 2,
  address: "Address 2",
  city: "City 2",
  country: "Country 2",
  description: "Description 2",
  bookingConditions: ["Booking Condition 2"],
  amenities: {
    general: [],
    room: [AmenitiesNameModel.BREAKFAST, AmenitiesNameModel.BAR, AmenitiesNameModel.BATHTUB],
  },
  images: {
    rooms: [
      {
        link: "URL 2",
        description: "Description 2",
      },
    ],
    amenity: [
      {
        link: "Link 2",
        description: "Caption 2",
      },
    ],
  },
};

const uncleanedMockData3: UncleanedHotelDataModel = {
  id: "3",
  destination: 3,
  name: "Hotel 3",
  lat: 3,
  lng: 3,
  info: "Description 3",
  address: "Address 3",
  amenities: {
    general: [],
    room: [AmenitiesNameModel.BATHTUB, AmenitiesNameModel.BREAKFAST, AmenitiesNameModel.BAR],
  },
};

const cleanedMockData3: HotelDataBySupplierModel = {
  id: "3",
  destinationId: 3,
  name: "Hotel 3",
  lat: 3,
  lng: 3,
  address: "Address 3",
  city: "City 3",
  country: "Country 3",
  description: "Description 3",
  bookingConditions: [],
  amenities: {
    general: [],
    room: [AmenitiesNameModel.BATHTUB, AmenitiesNameModel.BREAKFAST, AmenitiesNameModel.BAR],
  },
  images: {
    rooms: [],
    amenity: [],
  },
};

export const DIRTY_HOTEL_MOCK_DATA = [uncleanedMockData1, uncleanedMockData2, uncleanedMockData3];
export const CLEANED_HOTEL_MOCK_DATA = [cleanedMockData1, cleanedMockData2, cleanedMockData3];

const uncleanedMockDataMerging1: UncleanedHotelDataModel = {
  Id: "1",
  DestinationId: 1,
  Name: "Hotel 1",
  Latitude: 1,
  Longitude: 1,
  Address: "Address 1",
  City: "City 1",
  Country: "Country 1",
  PostalCode: "Postal Code 1",
  Description: "Description 1",
  Facilities: ["Facility 1"],
  amenities: {
    general: [AmenitiesNameModel.BUSINESS_CENTER],
    room: [AmenitiesNameModel.BATHTUB, AmenitiesNameModel.KETTLE],
  },
  images: {
    room: [
      {
        url: "URL 1",
        description: "Description 1",
      }
    ],
    amenities: [
      {
        url: "URL 1",
        description: "Description 1",
      }
    ]
  },
  booking_conditions: ["Booking Condition 2", "Booking Condition 3"],
};

const uncleanedMockDataMerging1_1: UncleanedHotelDataModel = {
  hotel_id: "1",
  destination_id: 1,
  hotel_name: "Hotel 1",
  details: "Description 1",
  amenities: [
    AmenitiesNameModel.BREAKFAST,
    AmenitiesNameModel.BAR,
    AmenitiesNameModel.BATHTUB,
    AmenitiesNameModel.BUSINESS_CENTER
  ],
  images: {
    room: [
      {
        url: "URL 2",
        description: "Description 2",
      },
    ],
    site: [
      {
        link: "Link 2",
        caption: "Caption 2",
      },
    ],
  },
  booking_conditions: ["Booking Condition 1"],
}

const cleanedMockDataMerging1: HotelDataBySupplierModel = {
  id: "1",
  destinationId: 1,
  name: "Hotel 1",
  lat: 1,
  lng: 1,
  address: "Address 1",
  city: "City 1",
  country: "Country 1",
  description: "Description 1",
  bookingConditions: ["Booking Condition 1", "Booking Condition 2", "Booking Condition 3"],
  amenities: {
    general: [AmenitiesNameModel.BUSINESS_CENTER],
    room: [AmenitiesNameModel.BATHTUB, AmenitiesNameModel.KETTLE, AmenitiesNameModel.BREAKFAST, AmenitiesNameModel.BAR],
  },
  images: {
    rooms: [
      {
        link: "URL 1",
        description: "Description 1",
      },
      {
        link: "URL 2",
        description: "Description 2",
      }
    ],
    amenity: [
      {
        link: "URL 1",
        description: "Description 1",
      },
      {
        link: "Link 2",
        description: "Caption 2",
      }
    ]
  },
}

export const DIRTY_HOTEL_MOCK_DATA_TEST_MERGING = [uncleanedMockDataMerging1, uncleanedMockDataMerging1_1];
export const CLEANED_HOTEL_MOCK_DATA_TEST_MERGING = [cleanedMockDataMerging1];
