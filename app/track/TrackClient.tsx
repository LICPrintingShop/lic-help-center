"use client";

import { useEffect, useState } from "react";

type OrderResult = {
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

const STAGES = [
  "PRE-PRINTING STAGE",
  "RUNNING STAGE",
  "COLLATING STAGE",
  "STAPLING/PADDING STAGE",
  "BROWNING STAGE",
  "PACKAGING STAGE",
];

export default function TrackClient({
  initialOrderId,
}: {
  initialOrderId?: string;
}) {
  const [trackingId, setTrackingId] = useState(initialOrderId || "");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialOrderId) {
      fetchOrder(initialOrderId);
    }
  }, [initialOrderId]);

  async function fetchOrder(orderId: string) {
    if (!orderId.trim()) {
      setError("Please enter your order number to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(
        `/api/orders?orderId=${encodeURIComponent(orderId)}`
      );

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Order not found.");
      }

      const payload: OrderResult = await res.json();
      setOrder(payload);
    } catch (err: any) {
      setError(err?.message || "Unable to find order.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchOrder(trackingId);
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.navRow}>
          <a href="/" style={styles.homeButton}>
            <span style={styles.homeLogo}>🏠</span>
            LIC PRINT SHOP
          </a>
        </div>

        <div style={styles.header}>
          <div style={styles.badge}>LIC PRINT SHOP</div>
          <h1 style={styles.title}>Track your order</h1>
          <p style={styles.subtitle}>
            Enter your order number and get the latest delivery status.
          </p>
        </div>

        {order ? (
          <div style={styles.resultCard}>
            <div style={styles.resultStatus}>{order.status}</div>
            <div style={styles.resultLabel}>Order ID</div>
            <div style={styles.resultValue}>{order.orderId}</div>

            <div style={styles.stageBadge}>{order.stage}</div>
            <div style={styles.stageTimeline}>
              {STAGES.map((stage) => {
                const active = stage === order.stage;
                const completed =
                  STAGES.indexOf(stage) <= STAGES.indexOf(order.stage);
                return (
                  <div key={stage} style={styles.stageItem}>
                    <div
                      style={
                        completed ? styles.stageDotActive : styles.stageDot
                      }
                    />
                    <div style={styles.stageEntry}>
                      <div style={styles.stageTitle}>{stage}</div>
                      {active ? (
                        <div style={styles.stageSubtitle}>Current stage</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={styles.resultField}>
              <span style={styles.fieldName}>Trade name</span>
              <span>{order.tradeName}</span>
            </div>
            <div style={styles.resultField}>
              <span style={styles.fieldName}>Entity type</span>
              <span>{order.entityType}</span>
            </div>
            <div style={styles.resultField}>
              <span style={styles.fieldName}>Payment status</span>
              <span>{order.status}</span>
            </div>
            <div style={styles.resultField}>
              <span style={styles.fieldName}>Proof file</span>
              <span>{order.proofFileName}</span>
            </div>

            <p style={styles.resultText}>
              Your request is stored in the built-in database. Use this same
              order number anytime to look up the status.
            </p>

            <a href="/order" style={styles.backLink}>
              Submit another order
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.group}>
              <label style={styles.label}>Order number</label>
              <input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. LIC-1234-456"
                style={styles.input}
              />
              {error ? <div style={styles.error}>{error}</div> : null}
            </div>

            <button type="submit" style={styles.button}>
              {loading ? "Searching..." : "Track order"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#090b12",
    color: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "560px",
    background: "rgba(15,23,42,0.92)",
    border: "1px solid rgba(148,163,184,0.12)",
    borderRadius: "30px",
    padding: "32px",
    boxShadow: "0 28px 70px rgba(0,0,0,0.28)",
  },
  navRow: {
    display: "flex",
    justifyContent: "flex-start",
    marginBottom: "24px",
  },
  homeButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 700,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  homeLogo: {
    display: "inline-flex",
    width: "26px",
    height: "26px",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    fontSize: "0.95rem",
  },
  header: {
    marginBottom: "26px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(99,102,241,0.15)",
    color: "#c7d2fe",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "16px",
    border: "1px solid rgba(99,102,241,0.25)",
  },
  title: {
    fontSize: "2.6rem",
    lineHeight: 1.05,
    margin: 0,
    fontWeight: 800,
  },
  subtitle: {
    marginTop: "14px",
    color: "rgba(226,232,240,0.78)",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: "42rem",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  group: {
    display: "grid",
    gap: "10px",
  },
  label: {
    fontSize: "0.85rem",
    color: "rgba(226,232,240,0.8)",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "#0f172a",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "#6366f1",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "15px",
  },
  error: {
    color: "#fca5a5",
    fontSize: "0.9rem",
  },
  resultCard: {
    display: "grid",
    gap: "18px",
  },
  resultStatus: {
    textTransform: "uppercase",
    color: "#c7d2fe",
    fontWeight: 700,
    letterSpacing: "0.18em",
  },
  resultLabel: {
    fontSize: "0.85rem",
    color: "rgba(226,232,240,0.75)",
    textTransform: "uppercase",
    letterSpacing: "0.14em",
  },
  resultValue: {
    fontSize: "1.75rem",
    fontWeight: 800,
  },
  stageBadge: {
    display: "inline-flex",
    padding: "10px 16px",
    borderRadius: "999px",
    background: "rgba(99,102,241,0.12)",
    color: "#c7d2fe",
    fontWeight: 700,
    width: "fit-content",
  },
  stageTimeline: {
    display: "grid",
    gap: "16px",
  },
  stageItem: {
    display: "flex",
    gap: "14px",
    alignItems: "flex-start",
  },
  stageDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "rgba(148,163,184,0.35)",
    marginTop: "6px",
  },
  stageDotActive: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#7c3aed",
    marginTop: "6px",
  },
  stageEntry: {
    display: "grid",
    gap: "4px",
  },
  stageTitle: {
    fontWeight: 700,
  },
  stageSubtitle: {
    color: "rgba(226,232,240,0.65)",
    fontSize: "0.95rem",
  },
  resultField: {
    display: "grid",
    gap: "6px",
    background: "rgba(148,163,184,0.08)",
    padding: "16px",
    borderRadius: "20px",
  },
  fieldName: {
    fontSize: "0.85rem",
    color: "rgba(226,232,240,0.65)",
  },
  resultText: {
    color: "rgba(226,232,240,0.78)",
    lineHeight: 1.7,
  },
  backLink: {
    display: "inline-flex",
    padding: "14px 18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    textDecoration: "none",
    justifyContent: "center",
    fontWeight: 700,
  },
};
