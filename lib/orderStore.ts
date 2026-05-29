import fs from "fs/promises";
import os from "os";
import path from "path";

export type OrderStage = (typeof ORDER_STAGES)[number];

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

export const ORDER_STAGES = [
  "PRE-PRINTING STAGE",
  "RUNNING STAGE",
  "COLLATING STAGE",
  "STAPLING/PADDING STAGE",
  "BROWNING STAGE",
  "PACKAGING STAGE",
] as const;

const STAGE_ALIASES: Record<string, OrderStage> = {
  "pre-printing": "PRE-PRINTING STAGE",
  "pre printing": "PRE-PRINTING STAGE",
  "pre-printing stage": "PRE-PRINTING STAGE",
  "pre printing stage": "PRE-PRINTING STAGE",
  "running": "RUNNING STAGE",
  "running stage": "RUNNING STAGE",
  "collating": "COLLATING STAGE",
  "collating stage": "COLLATING STAGE",
  "stapling/padding": "STAPLING/PADDING STAGE",
  "stapling": "STAPLING/PADDING STAGE",
  "padding": "STAPLING/PADDING STAGE",
  "stapling/padding stage": "STAPLING/PADDING STAGE",
  "browning": "BROWNING STAGE",
  "browning stage": "BROWNING STAGE",
  "packaging": "PACKAGING STAGE",
  "packaging stage": "PACKAGING STAGE",
};

const ordersPath = process.env.ORDER_DB_PATH
  ? path.resolve(process.env.ORDER_DB_PATH)
  : process.env.VERCEL
  ? path.join(os.tmpdir(), "lic-help-center-orders.json")
  : path.join(process.cwd(), "data", "orders.json");

async function ensureOrdersFile() {
  try {
    await fs.access(ordersPath);
  } catch {
    await fs.mkdir(path.dirname(ordersPath), { recursive: true });
    await fs.writeFile(ordersPath, "[]", "utf8");
  }
}

export async function readOrders(): Promise<OrderRecord[]> {
  await ensureOrdersFile();
  const file = await fs.readFile(ordersPath, "utf8");
  return JSON.parse(file || "[]") as OrderRecord[];
}

export async function writeOrders(orders: OrderRecord[]) {
  await ensureOrdersFile();
  await fs.writeFile(ordersPath, JSON.stringify(orders, null, 2), "utf8");
}

export function isOrderStage(value: string): value is OrderStage {
  return ORDER_STAGES.includes(value as OrderStage);
}

export function normalizeStage(stage: string): OrderStage {
  const cleaned = String(stage || "").trim();
  const lower = cleaned.toLowerCase();

  if (!cleaned) {
    return "PRE-PRINTING STAGE";
  }

  if (isOrderStage(cleaned)) {
    return cleaned;
  }

  if (STAGE_ALIASES[lower]) {
    return STAGE_ALIASES[lower];
  }

  return "PRE-PRINTING STAGE";
}

export function getCurrentStageFromCheckedItems(items: Array<string | undefined> | undefined): OrderStage {
  if (!items?.length) {
    return "PRE-PRINTING STAGE";
  }

  const validStages = items
    .map((stage) => normalizeStage(String(stage || "")))
    .filter(isOrderStage);

  if (!validStages.length) {
    return "PRE-PRINTING STAGE";
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
  const orders = await readOrders();
  const orderId = `LIC-${Date.now().toString().slice(-6)}-${Math.floor(
    Math.random() * 900 + 100
  )}`;
  const record: OrderRecord = {
    ...data,
    orderId,
    stage: normalizeStage(data.stage || "PRE-PRINTING STAGE"),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(record);
  await writeOrders(orders);
  return record;
}

export async function getOrderById(orderId: string) {
  const orders = await readOrders();
  return orders.find((order) => order.orderId === orderId) || null;
}

export async function updateOrderStage(orderId: string, newStage: string) {
  const orders = await readOrders();
  const order = orders.find((o) => o.orderId === orderId);

  if (!order) {
    return null;
  }

  order.stage = normalizeStage(newStage);
  order.updatedAt = new Date().toISOString();
  await writeOrders(orders);
  return order;
}
