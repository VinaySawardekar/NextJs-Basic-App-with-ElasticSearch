import { NextResponse } from "next/server";

export const POST = async ( request ) => {

  try {
    const body = await request.json();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SEARCH_KEY}`,
    };
    const response = await fetch(`${process.env.ELASTIC_SEARCH_API_ENDPOINT}`, {
      method: "POST",
      body: JSON.stringify({
        query: body.query
      }),
      headers: headers,
    }).then(function (response) {
      return response.json();
    });

    return new NextResponse(JSON.stringify(response), { status: 200 });
  } catch (err) {
    return new NextResponse("Database Error", { status: 500 });
  }
};

