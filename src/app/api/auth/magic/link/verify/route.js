import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import  jwt from "jsonwebtoken";

export const GET = async (request) => {

  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  await connect();

  try {
    const user = await User.findOne({
        token: token,
      });

      if (user){
        // Create a magic link token
        const verifyToken = await jwt.verify(token, process.env.JWT_SECRET);
        if (Date(verifyToken.exp) < Date.now()) {
            return new NextResponse(SON.stringify({
                message: "Magic Link Expired. Request a new Magic Link.", 
                email: "", 
                token: ""
              }), {
                status: 400,
              });
          } else {

            const user = await User.findOne({
                email: verifyToken.email,
              });
    
              if (user) {
                // signIn("credentials", {email: user.email, token: user.token});
                return new NextResponse( JSON.stringify({
                    message: "Magic Link Verified Successfully", 
                    email: user.email, 
                    token: user.token
                  }), {
                    status: 200,
                  });
              }   
          }
      }
      return new NextResponse("Something Went Wrong", {
        status: 400,
      });
  } catch (err) {
    return new NextResponse(JSON.stringify({
      message: err.message,
    }), {
      status: 500,
    });
  }
};
