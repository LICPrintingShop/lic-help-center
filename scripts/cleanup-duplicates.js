#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ordersPath = path.join(process.cwd(), "data", "orders.json");

function cleanupDuplicates() {
  try {
    if (!fs.existsSync(ordersPath)) {
      console.log("✗ No orders.json file found at", ordersPath);
      return;
    }

    const fileContent = fs.readFileSync(ordersPath, "utf8");
    const orders = JSON.parse(fileContent);

    if (!Array.isArray(orders)) {
      console.log("✗ orders.json is not an array");
      return;
    }

    console.log(`📊 Total orders before cleanup: ${orders.length}`);

    const seen = new Set();
    const cleaned = orders.filter((order) => {
      if (seen.has(order.orderId)) {
        console.log(`  ⊘ Removing duplicate: ${order.orderId}`);
        return false;
      }
      seen.add(order.orderId);
      return true;
    });

    const removedCount = orders.length - cleaned.length;

    if (removedCount === 0) {
      console.log("✓ No duplicates found. Orders are clean.");
      return;
    }

    fs.writeFileSync(ordersPath, JSON.stringify(cleaned, null, 2), "utf8");

    console.log(`✓ Cleanup complete!`);
    console.log(`  - Removed: ${removedCount} duplicate(s)`);
    console.log(`  - Kept: ${cleaned.length} unique order(s)`);
  } catch (error) {
    console.error("✗ Cleanup failed:", error.message);
    process.exit(1);
  }
}

cleanupDuplicates();
