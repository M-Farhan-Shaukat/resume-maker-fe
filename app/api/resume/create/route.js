import { apiHandler } from "@/app/shared/Apihandler";

export async function POST(req) {
  const payload = await req.json();
  const url = "/makeCV";
  
  // Get authorization header from the request
  const authorization = req.headers.get('authorization');
  
  return apiHandler({
    url: url,
    payload: payload,
    method: "POST",
    requireAuth: true,
    headers: {
      ...(authorization && { authorization }),
    },
  });
}
