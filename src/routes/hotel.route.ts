/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *         destinationId:
 *           type: number
 *         name:
 *           type: string
 *         location:
 *           type: Object
 *           properties:
 *              lat:
 *               type: number
 *              lng:
 *               type: number
 *              address:
 *               type: string
 *              city:
 *               type: string
 *              country:
 *               type: string
 *         description:
 *           type: string
 *         amenities:
 *           type: Object
 *         images:
 *           type: Object
 *         bookingConditions:
 *           type: [string]
 *       example:
 *         id: d5fEasz
 *         destinationId: 123
 *         name: Hotel Singapore
 *         location: {
 *          lat: 1.3521,
 *          lng: 103.8198,
 *          address: 123 Street,
 *          city: Singapore,
 *          country: Singapore
 *         }
 */

/**
 * @swagger
 * tags:
 *   name: Hotel
 *   description: Get hotel data
 * /hotels:
 *   get:
 *     summary: Get hotel data
 *     parameters:
 *       - name: hotels
 *         in: query
 *         description: Hotel id
 *         schema:
 *          type: string
 *       - name: destinationId
 *         in: query
 *         description: Destination id
 *         schema:
 *          type: number
 *     responses:
 *       200:
 *         description: Hotel data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       500:
 *         description: Some server error
 *
 */

import express from 'express';
import { getHotelData } from '../controllers/hotel.controller';
import { redisCacheMiddleware } from '../middlewares/redis.middleware';

export const hotelRoute = express.Router();

hotelRoute.get('/', redisCacheMiddleware(), getHotelData);
