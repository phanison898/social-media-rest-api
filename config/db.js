import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("DB connection established");
  } catch (error) {
    console.error("Failed to establish DB connection. Error: ", error);
    process.exit(1);
  }
};

export default connectDB;
