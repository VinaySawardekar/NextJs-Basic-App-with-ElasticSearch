import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Claim from "@/models/Claim";
import User from "@/models/User";

export const GET = async (request) => {
  const url = new URL(request.url);

  const email = url.searchParams.get("id");

  try {
    await connect();
    const user = await User.findOne({
      email,
    });
    let userClaims;
    if (user && user.role === "editor"){
      userClaims = await Claim.find({ assignedTo: user?._id, isVerified: true })
      .populate('user', { password: 0 })
      .populate('assignedTo', { password: 0 }).sort({ updatedAt: -1 });
    }

    return new NextResponse(JSON.stringify(userClaims), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

