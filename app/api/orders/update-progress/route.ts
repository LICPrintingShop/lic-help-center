import { NextResponse } from "next/server";
import { handleUpdateRequest } from "@/lib/orderUpdateHandler";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    return await handleUpdateRequest(body);
  } catch (error) {
    console.error("Error updating order stage:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let body: any;
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const text = await request.text();
      try {
        body = JSON.parse(text);
      } catch {
        body = Object.fromEntries(new URLSearchParams(text));
      }
    } else {
      body = await request.json().catch(() => ({}));
    }

    return await handleUpdateRequest(body);
  } catch (error) {
    console.error("Error updating order stage (POST):", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
