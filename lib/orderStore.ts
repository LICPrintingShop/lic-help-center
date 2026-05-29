import prisma from "./prisma";
import { ORDER_STAGES, OrderStage, isOrderStage } from "./stages";

export type OrderRecord = {
  orderId: string;
  tin: string;
  taxType: string;
  entityType: string;
  tradeName: string;
  address: string;
  phone: string;
  email: string;
  printingOption: string;
  status: string;
  stage: OrderStage;
  proofFileName: string;
  createdAt: string;
  updatedAt: string;
};

const STAGE_ALIASES: Record<string, OrderStage> = {
  "station 3 (payments and invoice)": "STATION 3 ( PAYMENTS AND INVOICE)",
  "station 3 ( payments and invoice)": "STATION 3 ( PAYMENTS AND INVOICE)",
  "station 3": "STATION 3 ( PAYMENTS AND INVOICE)",
  "payments and invoice": "STATION 3 ( PAYMENTS AND INVOICE)",
  "hold with problems": "HOLD WITH PROBLEMS",
  "layouting": "LAYOUTING",
  "pre-print fomatting": "PRE-PRINT FOMATTING",
  "pre-print formatting": "PRE-PRINT FOMATTING",
  "pre print formatting": "PRE-PRINT FOMATTING",
  "numbering": "NUMBERING",
  "running": "RUNNING",
  "collating": "COLLATING",
  "cutting & trimming": "CUTTING & TRIMMING",
  "cutting and trimming": "CUTTING & TRIMMING",
  "stapling & browning": "STAPLING & BROWNING",
  "stapling and browning": "STAPLING & BROWNING",
  "labelling & packaging": "LABELLING & PACKAGING",
  "labelling and packaging": "LABELLING & PACKAGING",
  "finish receipt": "FINISH RECEIPT",
  "ready for release": "READY FOR RELEASE",
  "pre-printing stage": "STATION 3 ( PAYMENTS AND INVOICE)",
  "running stage": "RUNNING",
  "collating stage": "COLLATING",
  "stapling/padding stage": "STAPLING & BROWNING",
  "stapling": "STAPLING & BROWNING",
  "padding": "STAPLING & BROWNING",
  "browning": "STAPLING & BROWNING",
  "packaging": "LABELLING & PACKAGING",
};


export function normalizeStage(stage: string): OrderStage {
  const cleaned = String(stage || "").trim();
  const lower = cleaned.toLowerCase();

  if (!cleaned) {
    return ORDER_STAGES[0];
  }

  if (isOrderStage(cleaned)) {
    return cleaned;
  }

  if (STAGE_ALIASES[lower]) {
    return STAGE_ALIASES[lower];
  }

  return ORDER_STAGES[0];
}

export function getCurrentStageFromCheckedItems(items: Array<string | undefined> | undefined): OrderStage {
  if (!items?.length) {
    return ORDER_STAGES[0];
  }

  const validStages = items
    .map((stage) => normalizeStage(String(stage || "")))
    .filter(isOrderStage);

  if (!validStages.length) {
    return ORDER_STAGES[0];
  }

  return validStages.reduce((current, next) => {
    const currentIdx = ORDER_STAGES.indexOf(current);
    const nextIdx = ORDER_STAGES.indexOf(next);
    return nextIdx > currentIdx ? next : current;
  }, validStages[0]);
}

export async function createOrder(
  data: Omit<OrderRecord, "orderId" | "createdAt" | "updatedAt">
) {
  const orderId = `LIC-${Date.now().toString().slice(-6)}-${Math.floor(
    Math.random() * 900 + 100
  )}`;

  const stage = normalizeStage(data.stage || "");
  const record = await prisma.order.create({
    data: {
      orderId,
      tin: data.tin,
      taxType: data.taxType,
      entityType: data.entityType,
      tradeName: data.tradeName,
      address: data.address,
      phone: data.phone,
      email: data.email,
      printingOption: data.printingOption,
      status: data.status,
      stage,
      proofFileName: data.proofFileName,
    },
  });

  await prisma.orderHistory.create({
    data: {
      orderId,
      stage,
      note: "Order created",
    },
  });

  return {
    ...record,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getOrderById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { orderId },
    include: { history: true },
  });

  if (!order) {
    return null;
  }

  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    history: order.history.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  };
}

export async function updateOrderStage(orderId: string, newStage: string) {
  const stage = normalizeStage(newStage);
  const existingOrder = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!existingOrder) {
    return null;
  }

  const order = await prisma.order.update({
    where: { orderId },
    data: {
      stage,
    },
  });

  await prisma.orderHistory.create({
    data: {
      orderId,
      stage,
      note: "Stage updated from Trello",
    },
  });

  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
