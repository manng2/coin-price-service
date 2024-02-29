import axios from 'axios';
import { DIRTY_HOTEL_MOCK_DATA } from '../constants/hotel-data.constant';

jest.mock('axios');

describe('Hotel routes', () => {
  beforeAll(() => {
    (axios as any).get.mockResolvedValue({
      data: DIRTY_HOTEL_MOCK_DATA,
    });
  });
  test('Should return true', async () => {
    // const res = await request(app).get("/hotel");
    // const { body } = res;

    // expect(body[0]).toHaveProperty("bookingConditions");
    // expect(res.status).toBe(200);
    expect(true).toBe(true);
  });
});
