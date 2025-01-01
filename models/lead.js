import mongoose from "mongoose";

function isContacted() {
  return this.leadStatus !== "NEW";
}

const leadSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: true,
    },
    KamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KAM",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Phone number must be a 10 digit number"], 
    },
    leadStatus: {
      type: String,
      enum: ["NEW", "CONTACTED", "NOT INTERESTED", "CONVERTED"],
      default: "NEW",
    },
    callFrequency: {
      // number of days between calls
      type: Number,
      required: true,
    },
    pointOfContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "POC",
        required: true,
      },
    ],
    interactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interaction",
      },
    ],
    lastContactedDate: {
      type: Date,
      required: isContacted,
    },
    order: {
      type: Number,
      default: 0 
    }
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
