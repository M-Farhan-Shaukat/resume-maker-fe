import API from "@/app/utils";
import { decryptData } from "@/app/utils/crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import queryString from "query-string";

export async function PUT(req) {
  const parsedParams = queryString.parseUrl(req.url).query;
  const userId = parsedParams?.userId;
  const active = parsedParams?.active;
  const cookieStore = await cookies();
  const access_token = decryptData(cookieStore.get("authToken")?.value);

  const url =
    active == "true"
      ? `/users/${userId}/active`
      : `/users/${userId}/inactive`;

  try {
    const res = await API.put(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Accept: "application/json",
          Authorization: access_token ? `${access_token}` : "",
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
