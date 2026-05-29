import { NextResponse } from "next/server";
import { ORDER_STAGES } from "@/lib/stages";
import {
  getCurrentStageFromCheckedItems,
  normalizeStage,
  updateOrderStage,
} from "@/lib/orderStore";

function parseOrderId(value: unknown): string {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }

  const match = text.match(/LIC-[A-Za-z0-9-]+/i);
  if (match) {
    return match[0].toUpperCase();
  }

  const separators = [" | ", "|", " - ", " -", "- ", " — ", "—", ":"];
  for (const separator of separators) {
    if (!text.includes(separator)) {
      continue;
    }

    const parts = text
      .split(separator)
      .map((part) => String(part || "").trim())
      .filter(Boolean);
    const candidate = parts[parts.length - 1];
    if (!candidate) {
      continue;
    }

    const parsed = parseOrderId(candidate);
    if (parsed) {
      return parsed;
    }
  }

  return text;
}

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
    if (!candidate) {
      continue;
    }

    const result = parseOrderId(candidate);
    if (result) {
      return result;
    }
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
    if (candidate == null) {
      continue;
    }

    const value = String(candidate).trim();
    if (value) {
      return value;
    }
  }

  return "";
}

function normalizeStageName(rawStage: string): string {
  const cleaned = normalizeStage(rawStage);
  if (ORDER_STAGES.includes(cleaned as any)) {
    return cleaned;
  }

  const lower = String(rawStage || "").toLowerCase();

  if (lower.includes("payments") || lower.includes("invoice") || lower.includes("station 3")) {
    return "PACKAGING STAGE";
  }

  if (lower.includes("browning") || lower.includes("station 5")) {
    return "BROWNING STAGE";
  }

  if (
    lower.includes("stapling") ||
    lower.includes("padding") ||
    lower.includes("station 4")
  ) {
    return "STAPLING/PADDING STAGE";
  }

  if (lower.includes("collating") || lower.includes("station 2")) {
    return "COLLATING STAGE";
  }

  if (lower.includes("running") || lower.includes("printing") || lower.includes("station 1")) {
    return "RUNNING STAGE";
  }

  if (lower.includes("pre-printing") || lower.includes("pre printing") || lower.includes("station 0")) {
    return "PRE-PRINTING STAGE";
  }

  return cleaned;
}

export async function handleUpdateRequest(body: any) {
  const orderId = extractOrderId(body);
  const rawStage = extractStage(body);
  const checkedStages = extractCheckedStages(body);
  const stage = checkedStages.length
    ? getCurrentStageFromCheckedItems(checkedStages)
    : normalizeStageName(rawStage);

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
