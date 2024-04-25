import express from 'express';
import { getLatestPrice, updateJsonData } from '../controllers/price.controller';

export const priceRoute = express.Router();

// priceRoute.get('/', redisCacheMiddleware(), getPrice);
priceRoute.get('/new', getLatestPrice);

priceRoute.get('/updateJsonData', updateJsonData);
