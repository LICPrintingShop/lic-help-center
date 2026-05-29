export const ORDER_STAGES = [
  "STATION 3 ( PAYMENTS AND INVOICE)",
  "HOLD WITH PROBLEMS",
  "LAYOUTING",
  "PRE-PRINT FOMATTING",
  "NUMBERING",
  "RUNNING",
  "COLLATING",
  "CUTTING & TRIMMING",
  "STAPLING & BROWNING",
  "LABELLING & PACKAGING",
  "FINISH RECEIPT",
  "READY FOR RELEASE",
] as const;

export type OrderStage = (typeof ORDER_STAGES)[number];

export function isOrderStage(value: string): value is OrderStage {
  return ORDER_STAGES.includes(value as OrderStage);
}
