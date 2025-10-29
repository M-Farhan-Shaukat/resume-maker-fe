import API from "@/app/utils";
import { decryptData } from "@/app/utils/crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import queryString from "query-string";

export async function GET(req) {
  const cookieStore = await cookies();
  const access_token = decryptData(cookieStore.get("authToken")?.value);
  const parsedParams = queryString.parseUrl(req.url).query;
  const page = parsedParams?.page;
  const view = parsedParams?.view;
  const search = parsedParams?.search;
  const orderBy = parsedParams?.orderBy;
  const sortBy = parsedParams?.sortBy;
  
  // Also check if token is passed in Authorization header from client
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = access_token || authHeader;
  
  console.log("Resume listing - Token from cookie:", access_token);
  console.log("Resume listing - Token from header:", authHeader);
  console.log("Resume listing - Final token to use:", token);
  
  try {
    const res = await API.get(
      `/resume?page=${page}&view=${view}&search=${search}&sortBy=${sortBy}&orderBy=${orderBy}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          Authorization: token ? `${token}` : "",
        },
      }
    );

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
      // Create a custom response with error details in the header
      const errorResponse = NextResponse.json(
        {
          message: data?.error || data?.message,
          success: false,
          status: status,
        },
        { status }
      );

      // Add error details to the response header
      errorResponse.headers.set(
        "X-Error-Message",
        data?.message || "An error occurred"
      );
      errorResponse.headers.set("X-Error-Code", status);

      return errorResponse;
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
