import { NextResponse } from "next/server";
import { createOrder, getOrderById, normalizeStage } from "@/lib/orderStore";
import { sendOrderNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const requiredKeys = [
      "tin",
      "taxType",
      "entityType",
      "tradeName",
      "address",
      "phone",
      "email",
      "printingOption",
      "status",
    ];

    for (const key of requiredKeys) {
      if (!body[key]) {
        return NextResponse.json(
          { error: `${key} is required` },
          { status: 400 }
        );
      }
    }

    const order = await createOrder({
      tin: String(body.tin),
      taxType: String(body.taxType),
      entityType: String(body.entityType),
      tradeName: String(body.tradeName),
      address: String(body.address),
      phone: String(body.phone),
      email: String(body.email),
      printingOption: String(body.printingOption),
      status: String(body.status),
      stage: normalizeStage(String(body.stage || "PRE-PRINTING STAGE")),
      proofFileName: String(body.proofFileName || "No proof uploaded"),
    });

    sendOrderNotification(
      order.email,
      order.tradeName,
      order.orderId,
      order.stage
    ).catch((err) => {
      console.error("sendOrderNotification failed:", err);
    });

    const zapierWebhook = process.env.ZAPIER_WEBHOOK_URL;

    if (zapierWebhook) {
      try {
        const zapierResponse = await fetch(zapierWebhook, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event: "order_created",

            orderId: order.orderId,
            tin: order.tin,
            taxType: order.taxType,
            entityType: order.entityType,
            tradeName: order.tradeName,
            address: order.address,
            phone: order.phone,
            email: order.email,
            printingOption: order.printingOption,
            status: order.status,
            stage: order.stage,
            proofFileName: order.proofFileName,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          }),
        });

        if (!zapierResponse.ok) {
          console.error(
            `Zapier webhook failed: ${zapierResponse.status} ${zapierResponse.statusText}`
          );
        }
      } catch (err) {
        console.error("Zapier webhook failed:", err);
      }
    } else {
      console.log("Zapier webhook URL not set. Skipping Zapier integration.");
    }

    return NextResponse.json({
      orderId: order.orderId,
      status: order.status,
      stage: order.stage,
    });
  } catch (error) {
    console.error("Create order failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId query is required" },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Get order failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}