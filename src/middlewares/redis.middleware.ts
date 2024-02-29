import { NextFunction, Request, Response } from 'express';
import { RedisClientType, SetOptions, createClient } from 'redis';
import zlib from 'zlib';
import { requestToKey } from '../utils/request-to-key.util';

let client: RedisClientType;

function isRedisWorking() {
  return !!client?.isOpen;
}

async function writeData(key: string, data: any, options: SetOptions, isCompressed: boolean): Promise<void> {
  if (isRedisWorking()) {
    let dataToCache = JSON.stringify(data);
    if (isCompressed) {
      dataToCache = zlib.deflateSync(dataToCache).toString('base64');
    }

    try {
      await client.set(key, dataToCache, options);
      console.log('- INFO: Set new data to ', key);
    } catch (e) {
      console.error(`Failed to cache data for key=${key}`, e);
    }
  }
}

async function readData(key: string, isCompressed: boolean) {
  let cachedValue = undefined;
  if (isRedisWorking()) {
    cachedValue = await client.get(key);
    console.log('- INFO: Read value from key', key);
    if (cachedValue) {
      console.log('- INFO: Founded value for key', key);
      if (isCompressed) {
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
    }).on('error', (error) => {
      console.error(`- ERROR: Redis client error: ${error}`);
    }) as RedisClientType;

    try {
      await client.connect();
      console.log('- INFO: Connected to Redis successfully!');
    } catch (e) {
      console.error('Connection to Redis failed with error:', e);
    }
  }
}

export function redisCacheMiddleware(
  options = {
    EX: 60 * 60 * 6,
  },
  isCompressed = true,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (isRedisWorking()) {
      const key = requestToKey(req);
      const cachedValue = await readData(key, isCompressed);
      if (cachedValue) {
        try {
          return res.json(JSON.parse(cachedValue as unknown as string));
        } catch {
          return res.send(cachedValue);
        }
      } else {
        const oldSend = res.send;
        res.send = function (data) {
          res.send = oldSend;

          if (res.statusCode.toString().startsWith('2')) {
            writeData(key, data, options, isCompressed).then();
          }

          return res.send(data);
        };

        next();
      }
    } else {
      next();
    }
  };
}
