import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth", "");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth${path}${request.nextUrl.search}`;
  
  const response = await fetch(url, {
    headers: {
      ...Object.fromEntries(request.headers),
      host: new URL(process.env.NEXT_PUBLIC_API_URL!).host,
    },
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth", "");
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth${path}${request.nextUrl.search}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...Object.fromEntries(request.headers),
      host: new URL(process.env.NEXT_PUBLIC_API_URL!).host,
    },
    body: request.body,
    duplex: "half",
  } as RequestInit);

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}