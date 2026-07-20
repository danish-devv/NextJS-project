import mongoose from "mongoose";

interface userI {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<userI>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true },
);

const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
