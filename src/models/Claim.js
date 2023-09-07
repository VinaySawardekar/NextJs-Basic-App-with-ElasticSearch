import mongoose, { Mongoose } from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    title: {
      type: String,
      require: true,
    },
    url: {
      type: String,
      require: true,
    },
    supportUrl: {
      type: String,
    },
    refuterUrl: {
      type: String,
    },
    summary: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    isGenuine: {
      type: String,
      default: 'null',
      lowercase: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true, 
    }
  },
  { timestamps: true }
);

//If the User collection does not exist create a new one.
export default mongoose.models.Claim || mongoose.model("Claim", userSchema);
