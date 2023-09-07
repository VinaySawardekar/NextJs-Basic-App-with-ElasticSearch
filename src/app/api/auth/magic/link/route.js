import User from "@/models/User";
import connect from "@/utils/db";
import { NextResponse } from "next/server";
import  jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export const POST = async (request) => {
  const { email } = await request.json();

  await connect();

  try {
    const user = await User.findOne({
        email
      });

      if (user){
        // Create a magic link token
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES });

        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
          },
        });

        // Generate magic link
        const magicLink = `${process.env.ORIGIN}/magic/link/verify?token=${token}`;

        await transporter.sendMail({
          from: '"Admin" <admin@claim-verification.com>', // sender address
          to: email, // list of receivers
          subject: 'Your Magic Link', // Subject line
          html: `
          <!DOCTYPE html>
            <html>
            <head>
              <title>Your Magic Link</title>
            </head>
            <body>
              <h1>Your Magic Link</h1>
              <p>Click on this link to log in: <a href="${magicLink}">Click</a></p>
              <p>This link will expire in 24 hrs.</p>
              <p>If you did not request this link, please ignore it.</p>
            </body>
           </html>
        `, // HTML body
        });

        let updateUser = await User.findByIdAndUpdate(user._id, {
          token: token,
        },
        {
          new: true,
        })
        return new NextResponse("Mail has been sent Successfully", {
          status: 200,
        });
      }
      return new NextResponse("Something Went Wrong", {
        status: 400,
      });
  } catch (err) {
    console.log(err);
    return new NextResponse(err.message, {
      status: 500,
    });
  }
};
