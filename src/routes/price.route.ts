import express from 'express';
import { getPrice } from '../controllers/price.controller';
import { redisCacheMiddleware } from '../middlewares/redis.middleware';

export const priceRoute = express.Router();

priceRoute.get('/', redisCacheMiddleware(), getPrice);
