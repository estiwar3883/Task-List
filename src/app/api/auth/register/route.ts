import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectBD } from "@/lib/mongodb";
import { User } from "@/models/UserDB";

export async function POST(req: Request) {
  await connectBD();

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!name || !email || password.length < 6) {
    return NextResponse.json(
      {
        message: "Name, email, and a password of at least 6 characters are required.",
      },
      {
        status: 400,
      }
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      {
        message: "A user with that email already exists.",
      },
      {
        status: 409,
      }
    );
  }

  const passwordHash = await hash(password, 12);
  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  return NextResponse.json(
    {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    {
      status: 201,
    }
  );
}
