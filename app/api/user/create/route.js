import API from "@/app/utils";
import { cookies } from "next/headers";
import queryString from "query-string";
import { NextResponse } from "next/server";
import { decryptData } from "@/app/utils/crypto";

export async function POST(req) {
  const payload = await req.json();
  const cookieStore = await cookies();
  const access_token = decryptData(cookieStore.get("authToken")?.value);
  //
  const url = "/user";
  try {
    const res = await API.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        authorization: access_token ? `${access_token}` : "",
      },
    });
console.log("res=================",res)
    if (res) {
      return NextResponse.json({
        ...res.data,
        success: true,
      });
    }
  } catch (err) {
    if (err.response) {
      // The request was made and the server responded with a status code
      const { data, status } = err.response;
      const errorMessage =
        data?.message ||
        data?.messages ||
        data?.error ||
        "An unexpected error occurred.";
      // Create a custom response with error details in the header
      return NextResponse.json(
        {
          message: errorMessage,
          success: false,
          status: status,
        },
        { status }
      );
    } else if (err.request) {
      // The request was made but no response was received
      return NextResponse.json({
        message: "No response received from the server",
        success: false,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return NextResponse.json({
        message: "Error setting up the request",
        success: false,
      });
    }
  }
}
