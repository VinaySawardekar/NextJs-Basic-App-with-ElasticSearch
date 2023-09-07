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
      userClaims = await Claim.find({ assignedTo: user?._id, isVerified: false })
      .populate('user', { password: 0 })
      .populate('assignedTo', { password: 0 });
    }
    else {
      userClaims = await Claim.find({ user: user?._id })
      .populate('user', { password: 0 })
      .populate('assignedTo', { password: 0 });
    }

    return new NextResponse(JSON.stringify(userClaims), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const POST = async (request) => {

  try {
    await connect();
    const body = await request.json();
    const user = await User.findOne({
      email: body?.user,
    });

    const newClaim = new Claim({
        title: body.title,
        url: body.url,
        supportUrl:body.supportUrl,
        refuterUrl: body.refuterUrl,
        summary: body.summary,
        user: user?._id,
        isVerified: false,
    });

    await newClaim.save();

    return new NextResponse("Claim has been created", { status: 201 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};
