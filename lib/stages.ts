export const ORDER_STAGES = [
  "PRE-PRINTING STAGE",
  "RUNNING STAGE",
  "COLLATING STAGE",
  "STAPLING/PADDING STAGE",
  "BROWNING STAGE",
  "PACKAGING STAGE",
] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];

export function isOrderStage(value: string): value is OrderStage {
  return ORDER_STAGES.includes(value as OrderStage);
}
