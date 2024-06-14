import { Collection, MongoClient } from 'mongodb';

export let dbClient: MongoClient;
export let chartLogs: Collection;

export async function initMongoDBClient(uri: string): Promise<void> {
  dbClient = new MongoClient(uri);

  await dbClient
    .connect()
    .then(() => {
      const db = dbClient.db('coin-price-serice');
      console.log('Connected Database');

      chartLogs = db.collection('chart_logs');
    })
    .catch(() => {
      console.log('Cannot connect');
    });
}
