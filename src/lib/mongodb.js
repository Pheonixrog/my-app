import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const options = { useNewUrlParser: true, useUnifiedTopology: true };

let client;
let clientPromise;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGO_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGO_URI, options);
  clientPromise = client.connect();
}

export default clientPromise;
