import API from "@/app/utils";
import { cookies } from "next/headers";
import { decryptData } from "@/app/utils/crypto";
import { NextResponse } from "next/server";

export async function apiHandler({
  url,
  method = "GET",
  params = {},
  headers = {},
  payload = null,
  requireAuth = true, // Add a flag to determine if authentication is required
}) {
  try {
    // Fetch session and access token if authentication is required
    let access_token = null;
    if (requireAuth) {
      // Check if token is already in headers (passed from client)
      if (headers.authorization) {
        access_token = headers.authorization.replace('Bearer ', '');
      } else {
        // Try to get token from localStorage first (client-side)
        if (typeof window !== "undefined") {
          access_token = localStorage.getItem("access_token");
        } else {
          // Server-side: get from cookies
          try {
            const cookieStore = await cookies();
            const authToken = cookieStore.get("authToken")?.value;
            if (authToken) {
              access_token = decryptData(authToken);
            }
          } catch (error) {
            console.log("Error getting token from cookies:", error);
          }
        }
      }
    }
    console.log("access_token=================",access_token);
    console.log("requireAuth=================",requireAuth);
    console.log("typeof window=================",typeof window);
    
    // If no token and auth is required, return error
    if (requireAuth && !access_token) {
      console.log("No access token found and auth is required");
      return NextResponse.json({
        message: "Authentication required. Please login again.",
        success: false,
        status: 401,
      }, { status: 401 });
    }
    
    // Set up the request configuration
    const config = {
      method,
      url,
      params,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        ...(access_token
          ? { authorization: `Bearer ${access_token}` }
          : {}),
        ...headers,
      },
      ...(payload && { data: payload }),
    };
console.log("config=================",config);
    // Make the API call
    console.log("Making API call with config:", config);
    const response = await API(config);
    console.log("API response:", response);
    // Return a successful response
    if (response) {
      return NextResponse.json({
        ...response.data,
        message: response?.data?.message,
        success: true,
      });
    }
  } catch (err) {
    console.log("API Handler Error:", err);
    if (err.response) {
      // The request was made and the server responded with a status code
      const { data, status } = err.response;
      console.log("Error response data:", data);
      console.log("Error response status:", status);

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
      console.log("No response received from server");
      return NextResponse.json({
        message: "No response received from the server....",
        success: false,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error setting up request:", err.message);
      return NextResponse.json({
        message: "Error setting up the request",
        success: false,
      });
    }
  }
}
