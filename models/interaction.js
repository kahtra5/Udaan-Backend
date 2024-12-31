import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },
    contactedPOCId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "POC",
      required: true,
    },
    interactionType: {
      type: String,
      enum: ["call", "email", "visit"],
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
    interactionDate: {
      type: Date,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
   },},
  { timestamps: true }
);

export default mongoose.model("Interaction", interactionSchema);
