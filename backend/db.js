const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
let client;

async function connectToDatabase() {
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();

  const db = client.db();
  return db.collection('users');
}

async function closeDatabase() {
  if (client) {
    await client.close();
  }
}

module.exports = {
  connectToDatabase,
  closeDatabase,
};
