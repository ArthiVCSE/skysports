import mongoose from "mongoose";
import { getErrorMessage } from "@/lib/errors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.url!);
    console.log("MongoDB connected");
  } catch (error: unknown) {
    console.log(getErrorMessage(error));
    process.exit(1);
  }
};

export default connectDB;