import axios from 'axios';
import { HotelDataBySupplierModel } from '../../models';
import { supplierService } from '../../services';
import {
  CLEANED_HOTEL_MOCK_DATA,
  CLEANED_HOTEL_MOCK_DATA_TEST_MERGING,
  DIRTY_HOTEL_MOCK_DATA,
  DIRTY_HOTEL_MOCK_DATA_TEST_MERGING,
} from '../constants/hotel-data.constant';

jest.mock('axios');

describe('Supplier Service', () => {
  test('should return a list of suppliers', async () => {
    const suppliers = await supplierService.getAllSuppliers();
    expect(suppliers.length).toBeGreaterThan(0);
  });

  describe('Procurement of Hotel Data', () => {
    let hotelData: ReadonlyArray<HotelDataBySupplierModel> = [];
    const cleanedMockData = CLEANED_HOTEL_MOCK_DATA;

    beforeAll(async () => {
      (axios.get as any).mockResolvedValue({
        data: DIRTY_HOTEL_MOCK_DATA,
      });
      hotelData = await supplierService.getHotelDataBySuppliers(['ecma']);
    });

    test('should return hotel data from suppliers', async () => {
      expect(hotelData.length).toBeGreaterThan(0);
    });

    test('cleaned data should match cleaned mock data', async () => {
      hotelData.forEach((data, index) => {
        Object.keys(data).forEach((key) => {
          expect(data[key as keyof HotelDataBySupplierModel]).toEqual(cleanedMockData[index][key as keyof HotelDataBySupplierModel]);
        });
      });
    });

    describe('Test Filtering of Hotel Data', () => {
      beforeAll(async () => {
        (axios.get as any).mockResolvedValue({
          data: DIRTY_HOTEL_MOCK_DATA,
        });
      });

      test('should return filtered hotel data', async () => {
        const data = await supplierService.getHotelDataBySuppliers(['ecma'], {
          hotels: ['1'],
        });
        expect(data.filter((it) => it.id === '1').length).toBe(data.length);
      });

      test('should return filtered destination data', async () => {
        const data = await supplierService.getHotelDataBySuppliers(['ecma'], {
          destination: 1,
        });
        expect(data.filter((it) => it.destinationId === 1).length).toBe(data.length);
      });
    });
  });

  describe('Merging of Hotel Data', () => {
    let hotelData: ReadonlyArray<HotelDataBySupplierModel> = [];
    const cleanedHotelData: HotelDataBySupplierModel[] = CLEANED_HOTEL_MOCK_DATA_TEST_MERGING;

    beforeAll(async () => {
      (axios.get as any).mockResolvedValue({
        data: DIRTY_HOTEL_MOCK_DATA_TEST_MERGING,
      });

      hotelData = await supplierService.getHotelDataBySuppliers(['ecma']);
    });
    test('image data should be merged', () => {
      hotelData.forEach((data, index) => {
        expect(data.images).toEqual(cleanedHotelData[index].images);
      });
    });

    test('amenities should be merged', () => {
      hotelData.forEach((data, index) => {
        expect(data.amenities).toEqual(cleanedHotelData[index].amenities);
      });
    });

    test('booking conditions should be merged', () => {
      hotelData.forEach((data, index) => {
        expect(new Set(data.bookingConditions)).toEqual(new Set(cleanedHotelData[index].bookingConditions));
      });
    });
  });
});
