import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Claim from "@/models/Claim";

export const GET = async (request, { params }) => {
  const { id } = params;

  try {
    await connect();

    const claim = await Claim.findById(id, {}).populate('assignedTo', { password: 0 }).populate('user', { password:0 });

    return new NextResponse(JSON.stringify(claim), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  const { id } = params;

  try {
    await connect();

    await Claim.findByIdAndDelete(id);

    return new NextResponse("Claim has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
    const { id } = params;
  
    try {
      await connect();
      const body = await request.json();
    
      const data = await Claim.findOneAndUpdate({_id: id}, { 
          title: body?.title,
          url: body?.url,
          supportUrl:body?.supportUrl,
          refuterUrl: body?.refuterUrl,
          summary: body?.summary,
          assignedTo: body?.assignedTo,
          isVerified: body?.isVerified,
          isGenuine: body?.isGenuine,
        }, {new: true});

      return new NextResponse("Claim has been Updated", { status: 200 });
    } catch (err) {
      return new NextResponse("Database Error", { status: 500 });
    }
  };
