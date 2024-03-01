import axios from 'axios';
import supertest from 'supertest';
import app from '../../server';
import { DIRTY_HOTEL_MOCK_DATA } from '../constants/hotel-data.constant';
import { HotelDataBySupplierModel } from '../../models';

const request = supertest(app);

jest.mock('axios');

describe('[GET] /hotel', () => {
  beforeAll(() => {
    (axios as any).get.mockResolvedValue({
      data: DIRTY_HOTEL_MOCK_DATA,
    });
  });
  test('should return hotel data if no parameters are provided', async () => {
    const res = await request.get('/hotel');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('should return hotels with the same destination', async () => {
    const res = await request.get('/hotel?destination=1');

    expect(res.status).toBe(200);
    expect(res.body.filter((it: any) => it.destinationId === 1).length).toBe(res.body.length);
  });

  test('should return hotels with the ids in list', async () => {
    const res = await request.get('/hotel?hotels=1,2');

    expect(res.status).toBe(200);
    expect(res.body.filter((it: HotelDataBySupplierModel) => ['1', '2'].includes(it.id)).length).toBe(res.body.length);
  });

  test('should return empty hotels if no hotels match destinationId', async () => {
    const res = await request.get('/hotel?destination=100');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test('should return empty hotels if no hotels match ids', async () => {
    const res = await request.get('/hotel?hotels=100');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(0);
  });

  test('should return hotels have the same id and destinationId in parameter', async () => {
    const destinationId = 1;
    const hotels = '1';
    const res = await request.get(`/hotel?hotels=100&destination=${destinationId}&hotels=${hotels}`);

    expect(res.status).toBe(200);
    expect(res.body.filter((it: HotelDataBySupplierModel) => it.destinationId === destinationId && it.id === hotels).length).toBe(res.body.length);
  });

  test('should throw error if destinationId is not number', async () => {
    const res = await request.get('/hotel?destination=abc');

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid destination id');
  });
});
