import express from 'express';
import { getJsonData, getLatestPrice, updateJsonData, updateLatestCandle } from '../controllers/price.controller';

export const priceRoute = express.Router();

// priceRoute.get('/', redisCacheMiddleware(), getPrice);
priceRoute.get('/new', getLatestPrice);
priceRoute.post('/new', updateLatestCandle);
priceRoute.get('/json', getJsonData);

// Write Json data from beginning
// priceRoute.get('/updateJsonData', updateJsonData);
