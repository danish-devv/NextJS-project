import connectDb from "@/lib/db";
import userModel from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { name, email, password } = await req.json();
  await connectDb();
  let existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { message: "This email already exist" },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json({}, { status: 400 });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const createUser = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });

  return NextResponse.json({ createUser }, { status: 201 });
};
