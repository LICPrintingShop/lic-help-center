import { NextResponse } from "next/server";
import { updateOrderStage } from "@/lib/orderStore";

async function handleUpdateRequest(body: any) {
  const rawOrderId = body.orderId || body.cardName || "";
  const orderId = String(rawOrderId).trim().split(" - ")[0];
  const stage = body.stage;

  if (!orderId || !stage) {
    return NextResponse.json(
      { error: "orderId and stage are required" },
      { status: 400 }
    );
  }

  const validStages = [
    "PRE-PRINTING STAGE",
    "RUNNING STAGE",
    "COLLATING STAGE",
    "STAPLING/PADDING STAGE",
    "BROWNING STAGE",
    "PACKAGING STAGE",
  ];

  if (!validStages.includes(stage)) {
    return NextResponse.json(
      {
        error: `Invalid stage. Must be one of: ${validStages.join(", ")}`,
      },
      { status: 400 }
    );
  }

  const updatedOrder = await updateOrderStage(orderId, stage);

  if (!updatedOrder) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    );
  }

  // Send data to Zapier webhook and log response for debugging
  if (process.env.ZAPIER_WEBHOOK_URL) {
    try {
      const resp = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event: "order_stage_updated",
          orderId: updatedOrder.orderId,
          stage: updatedOrder.stage,
          updatedAt: updatedOrder.updatedAt,
          order: updatedOrder,
        }),
      });

      if (!resp.ok) {
        console.error(`Zapier webhook failed: ${resp.status} ${resp.statusText}`);
      }
    } catch (zapierError) {
      console.error("Zapier webhook error:", zapierError);
    }
  }

  return NextResponse.json({
    success: true,
    orderId: updatedOrder.orderId,
    stage: updatedOrder.stage,
    updatedAt: updatedOrder.updatedAt,
  });
}

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

    // Support both JSON and form-encoded bodies commonly sent by webhooks
    let body: any;
    if (contentType.includes("application/json")) {
      body = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data") ) {
      const text = await request.text();
      // try to parse as JSON fallback
      try {
        body = JSON.parse(text);
      } catch {
        // parse urlencoded
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