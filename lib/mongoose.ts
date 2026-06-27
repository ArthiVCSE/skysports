// lib/mongoose.ts
import mongoose from "mongoose";

function getMongoUri() {
  return process.env.MONGODB_URI || process.env.url;
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function dbConnect() {
  const mongoUri = getMongoUri();
  if (!mongoUri) {
    throw new Error("Please define MONGODB_URI or url in .env");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    } as mongoose.ConnectOptions;
    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export const getModel = <T>(name: string, schema: mongoose.Schema<T>) => {
  if (mongoose.models[name]) {
    return mongoose.model<T>(name);
  }
  return mongoose.model<T>(name, schema);
};
