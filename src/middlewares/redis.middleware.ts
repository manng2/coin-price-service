import { NextFunction, Request, Response } from 'express';
import { RedisClientType, SetOptions, createClient } from 'redis';
import zlib from 'zlib';
import { requestToKey } from '../utils/request-to-key.util';

let client: RedisClientType;

function isRedisWorking() {
  return !!client?.isOpen;
}

async function writeData(key: string, data: any, options: SetOptions, compression: boolean): Promise<void> {
  if (isRedisWorking()) {
    let dataToCache = data;
    if (compression) {
      // compress the value with ZLIB to save RAM
      dataToCache = zlib.deflateSync(data).toString('base64');
    }

    try {
      await client.set(key, dataToCache, options);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
}

async function readData(key: string, compressed: any) {
  let cachedValue = undefined;
  if (isRedisWorking()) {
    cachedValue = await client.get(key);
    if (cachedValue) {
      if (compressed) {
        // decompress the cached value with ZLIB
        return zlib.inflateSync(Buffer.from(cachedValue, 'base64')).toString();
      } else {
        return cachedValue;
      }
    }
  }

  return cachedValue;
}

export async function initializeRedisClient() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  if (redisUrl) {
    client = createClient({
      url: redisUrl,
      legacyMode: true,
    }).on('error', (error) => {
      console.error(`Redis client error: ${error}`);
    }) as RedisClientType;

    try {
      // connect to the Redis server
      await client.connect();
      client.set('bc', JSON.stringify([{ a: 1, b: 2 }]));
      console.log(`Connected to Redis successfully!`);
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  }
}

export function redisCacheMiddleware(
  options = {
    EX: 21600, // 6h
  },
  compression = true,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isRedisWorking()) {
      const key = requestToKey(req);
      // if there is some cached data, retrieve it and return it
      const cachedValue = await readData(key, compression);
      console.log('Cached Value ->', cachedValue);
      if (cachedValue) {
        try {
          // if it is JSON data, then return it
          return res.json(JSON.parse(cachedValue as unknown as string));
        } catch {
          // if it is not JSON data, then return it
          return res.send(cachedValue);
        }
      } else {
        // override how res.send behaves
        // to introduce the caching logic
        const oldSend = res.send;
        res.send = function (data) {
          // set the function back to avoid the 'double-send' effect
          res.send = oldSend;

          // cache the response only if it is successful
          if (res.statusCode.toString().startsWith('2')) {
            writeData(key, '123', options, compression).then();
          }

          return res.send(data);
        };

        // continue to the controller function
        next();
      }
    } else {
      // proceed with no caching
      next();
    }
  };
}
