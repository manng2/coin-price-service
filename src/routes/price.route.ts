import express from 'express';
import { getLatestPrice } from '../controllers/price.controller';

export const priceRoute = express.Router();

// priceRoute.get('/', redisCacheMiddleware(), getPrice);
priceRoute.get('/new', getLatestPrice);
