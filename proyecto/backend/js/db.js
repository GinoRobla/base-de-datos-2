const { MongoClient } = require('mongodb');

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'inventario-tienda'; 

const client = new MongoClient(MONGO_URI);

async function connectDB() { 
    await client.connect();
    console.log("Conectado a la base de datos");
    
    return client.db(DB_NAME);
}

module.exports = { connectDB };