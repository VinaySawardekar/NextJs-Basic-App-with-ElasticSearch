import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(
        process.env.MONGODB_URI,
            {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName : process.env.MONGODB_DATABASE,
            } 
        );
  } catch (error) {
    console.log(error);
    throw new Error("Connection failed!");
  }
};

export default connect;
