import mongoose from "mongoose";

// Define the POC Schema
const pocSchema = new mongoose.Schema(
  {
    interactions: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interaction",
          }],
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be a 10 digit number"], // Basic phone number validation
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address format"], // Basic email validation
    },
  },
  { timestamps: true }
);

// Export the POC Model
export default mongoose.model("POC", pocSchema);
