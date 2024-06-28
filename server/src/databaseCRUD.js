import { MongoClient } from 'mongodb';

// Function that connects to MongoDB cluster
// take parameter for uri, instantiates a MongoClient
// asynchronously connects, logs error if cannot connect
export async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        console.log('Connecting to MongoDB cluster ScootEZ');

        await mongoClient.connect();
        console.log('Successfully connected to MongoDB cluster ScootEZ');

        return mongoClient;
    }
    catch (error) {
        console.error('Connection to MongoDB cluster failed', error);
        process.exit();
    }
}

export async function executeCrudOperations() {
    const uri = process.env.DB_URI;
    let mongoClient;

    try {
        mongoClient = await connectToCluster(uri);
    }
    finally {
        await mongoClient.close();
    }
}