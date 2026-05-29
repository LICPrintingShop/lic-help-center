import { NextResponse } from "next/server";
import { ORDER_STAGES } from "@/lib/stages";
import {
  getCurrentStageFromCheckedItems,
  normalizeStage,
  updateOrderStage,
} from "@/lib/orderStore";

function extractOrderId(payload: any): string {
  const candidates = [
    payload.orderId,
    payload.order_id,
    payload["order id"],
    payload["Order Id"],
    payload["OrderID"],
    payload.cardName,
    payload.card_name,
    payload.card?.name,
    payload.row?.orderId,
    payload.row?.order_id,
    payload.row?.["Order Id"],
    payload.data?.orderId,
    payload.data?.order_id,
    payload.inputData?.orderId,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const value = String(candidate).trim();
    if (!value) continue;
    return value.split(" - ")[0].trim();
  }

  return "";
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return [value.trim()].filter(Boolean);
  }

  if (value && typeof value === "object") {
    return Object.values(value)
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  return [];
}

function extractCheckedStages(payload: any): string[] {
  const candidates = [
    payload.checkedStages,
    payload.checked_items,
    payload.checkedItems,
    payload.checklist,
    payload.checklistItems,
    payload.checklist_items,
    payload.row?.checkedStages,
    payload.data?.checkedStages,
    payload.inputData?.checkedStages,
    payload.row?.checklist,
    payload.data?.checklist,
    payload.inputData?.checklist,
  ];

  return candidates.flatMap(toStringArray);
}

function extractStage(payload: any): string {
  const candidates = [
    payload.stage,
    payload.listName,
    payload.list_name,
    payload.list,
    payload.status,
    payload["Stage"],
    payload["stage"],
    payload.row?.stage,
    payload.row?.["Stage"],
    payload.row?.["stage"],
    payload.data?.stage,
    payload.data?.["Stage"],
    payload.inputData?.stage,
    payload.inputData?.["Stage"],
  ];

  for (const candidate of candidates) {
    if (candidate == null) continue;
    const value = String(candidate).trim();
    if (value) return value;
  }

  return "";
}

async function handleUpdateRequest(body: any) {
  const orderId = extractOrderId(body);
  const rawStage = extractStage(body);
  const checkedStages = extractCheckedStages(body);
  const stage = checkedStages.length
    ? getCurrentStageFromCheckedItems(checkedStages)
    : normalizeStage(rawStage);

  if (!orderId || (!rawStage && !checkedStages.length)) {
    return NextResponse.json(
      { error: "orderId and stage are required" },
      { status: 400 }
    );
  }

  if (!ORDER_STAGES.includes(stage as any)) {
    return NextResponse.json(
      {
        error: `Invalid stage. Must be one of: ${ORDER_STAGES.join(", ")}`,
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