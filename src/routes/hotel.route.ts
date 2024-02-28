import express from 'express';
import { getHotelData } from '../controllers/hotel.controller';

export const hotelRoute = express.Router();

hotelRoute.get('/', getHotelData);
