import express from 'express';
import { getHotelData } from '../controllers/hotel.controller';
import { redisCacheMiddleware } from '../middlewares/redis.middleware';

export const hotelRoute = express.Router();

hotelRoute.get('/', redisCacheMiddleware(), getHotelData);
