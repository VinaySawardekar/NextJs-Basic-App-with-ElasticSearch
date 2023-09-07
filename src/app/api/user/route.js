import { NextResponse } from "next/server";
import connect from "@/utils/db";
import User from "@/models/User";

export const GET = async (request) => {

  const url = new URL(request.url);

  const email = url.searchParams.get("id");

  try {
    await connect();
    const user = await User.findOne({
      email,
    },
    {
        _id:1,
        name:1,
        email:1,
        role:1
    });

    return new NextResponse(JSON.stringify(user), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
