const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "chairman"], // "apt" for apartment owner, "chairman" for chairman
    default: "user",
    required: false,
  },
  imageKitPublicKey: { type: String, required: false }, // ImageKit Public Key
  gmailPw: { type: String, required: false },
});

// Define Guard schema
const guardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Define Visitor schema
const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    purpose: { type: String }, // Optional field
    image: { type: String }, // Optional image URL
    vehicleImage: { type: String }, // Optional vehicle image URL
    inTime: { type: Date, required: true },
    outTime: { type: Date },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
    inBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guard", // Reference to the Guard collection
      required: true, // The guard checking in the visitor
    },
    outBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guard", // Reference to the Guard collection
    },
  },
  { timestamps: true }
);

// Define Apartment schema
const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // This references the User model
    required: true,
  },
});

// Define and export models
const User = mongoose.models.User || mongoose.model("User", userSchema);
const Guard = mongoose.models.Guard || mongoose.model("Guard", guardSchema);
const Visitor = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);
const Apartment = mongoose.models.Apartment || mongoose.model("Apartment", apartmentSchema);

module.exports = {
  User,
  Guard,
  Visitor,
  Apartment,
};
