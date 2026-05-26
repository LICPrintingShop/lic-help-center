import fs from "fs/promises";
import os from "os";
import path from "path";

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
  stage: string;
  proofFileName: string;
  createdAt: string;
  updatedAt: string;
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

export async function createOrder(data: Omit<OrderRecord, "orderId" | "createdAt" | "updatedAt">) {
  const orders = await readOrders();
  const orderId = `LIC-${Date.now().toString().slice(-6)}-${Math.floor(
    Math.random() * 900 + 100
  )}`;
  const record: OrderRecord = {
    ...data,
    orderId,
    stage: data.stage || "PRE-PRINTING STAGE",
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

  order.stage = newStage;
  order.updatedAt = new Date().toISOString();
  await writeOrders(orders);
  return order;
}
