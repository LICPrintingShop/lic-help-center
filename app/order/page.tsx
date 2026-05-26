
"use client";

import { useState } from "react";

export default function OrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [orderId, setOrderId] = useState("");
  const [orderStage, setOrderStage] = useState("PRE-PRINTING STAGE");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const form = new FormData(e.target);

    const paymentStatus = String(form.get("status") || "");
    const proofFile = form.get("proof") as File | null;

    if (
      paymentStatus === "paid" &&
      (!proofFile || proofFile.size === 0)
    ) {
      alert("Proof of payment is required.");
      setLoading(false);
      return;
    }

    const data = {
      tin: String(form.get("tin") || ""),
      taxType: String(form.get("taxType") || ""),
      entityType: String(form.get("entityType") || ""),
      tradeName: String(form.get("tradeName") || ""),
      address: String(form.get("address") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      printingOption: String(form.get("printingOption") || ""),
      status: paymentStatus,
      proofFileName:
        proofFile && proofFile.size > 0
          ? proofFile.name
          : "No proof uploaded",
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Order submission failed.");
      }

      const payload = await res.json();
      setOrderId(payload.orderId);
      setOrderStage(payload.stage || "PRE-PRINTING STAGE");
      setSubmitted(true);
      e.target.reset();
      setStatus("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Failed to send order.");
    } finally {
      setLoading(false);
    }
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

        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.badge}>LIC PRINT SHOP</div>

          <h1 style={styles.title}>Business Printing Order</h1>

          <p style={styles.subtitle}>
            Submit your official printing request
          </p>
        </div>

        {submitted ? (
          <div style={styles.successPage}>
            <div style={styles.successIcon}>✓</div>

            <h2 style={styles.successTitle}>Order Submitted</h2>

            <p style={styles.successSubtitle}>
              Your printing request has been received successfully.
            </p>

            <div style={styles.orderIdLabel}>Tracking number</div>
            <div style={styles.orderIdValue}>{orderId}</div>

            <div style={styles.stageCard}>
              <div style={styles.statusHeader}>CURRENT STAGE</div>
              <div style={styles.stageValue}>{orderStage}</div>
            </div>

            <div style={styles.statusCard}>
              <div style={styles.statusHeader}>ORDER STATUS</div>
              <div style={styles.statusValue}>Pending Review</div>
              <div style={styles.statusText}>
                Your order is currently being reviewed by the LIC Print Shop team.
              </div>
            </div>

            <a
              href={`/track?orderId=${encodeURIComponent(orderId)}`}
              style={styles.trackButton}
            >
              Track this order
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            {errorMessage ? (
              <div style={styles.formError}>{errorMessage}</div>
            ) : null}

            <div style={styles.group}>
              <label style={styles.label}>TIN Number</label>
              <input
                name="tin"
                type="text"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Tax Type</label>
              <select
                name="taxType"
                style={styles.input}
                required
              >
                <option>NON-VAT - Non-Value-Added Tax</option>
                <option>VAT - Value-Added Tax</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Type of Entity</label>
              <select
                name="entityType"
                style={styles.input}
                required
              >
                <option>CORPORATION</option>
                <option>SOLE PROPRIETORSHIP</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Trade Name</label>
              <input
                name="tradeName"
                type="text"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Registered Address</label>
              <textarea
                name="address"
                rows={4}
                style={styles.textarea}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Official Phone Number</label>
              <input
                name="phone"
                type="tel"
                placeholder="+63 912 345 6789"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Official Email</label>
              <input
                name="email"
                type="email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Printing Option</label>
              <select
                name="printingOption"
                style={styles.input}
                required
              >
                <option>7-10 WORKING DAYS PRINTING</option>
                <option>2-3 RUSH PRINTING</option>
              </select>
            </div>

            <div style={styles.group}>
              <label style={styles.label}>Payment Status</label>
              <select
                name="status"
                style={styles.input}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                <option value="">Select payment status</option>
                <option value="paid">PAID</option>
                <option value="unpaid">UNPAID</option>
              </select>
            </div>

            {status === "paid" && (
              <div style={styles.group}>
                <label style={styles.label}>Proof of Payment</label>
                <input
                  name="proof"
                  type="file"
                  accept="image/*"
                  style={styles.input}
                  required
                />
              </div>
            )}

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Sending..." : "Submit Order"}
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
    background: "#0a0a0a",
    color: "#ffffff",
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    fontFamily: "Inter, Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "580px",
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
    transition: "background 0.2s ease",
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
    marginBottom: "30px",
  },
  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    fontSize: "11px",
    letterSpacing: "1px",
    marginBottom: "18px",
    color: "rgba(255,255,255,0.7)",
  },
  title: {
    fontSize: "34px",
    margin: 0,
    fontWeight: 700,
  },
  subtitle: {
    marginTop: "12px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.55)",
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  group: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.75)",
  },
  input: {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#111111",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "15px",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#111111",
    color: "#ffffff",
    fontSize: "14px",
    resize: "vertical",
    outline: "none",
  },
  button: {
    marginTop: "10px",
    padding: "16px",
    borderRadius: "18px",
    border: "none",
    background: "#ffffff",
    color: "#000000",
    fontSize: "15px",
    fontWeight: 700,
    cursor: "pointer",
  },
  formError: {
    borderRadius: "18px",
    padding: "16px",
    background: "rgba(248,113,113,0.12)",
    color: "#fca5a5",
    border: "1px solid rgba(248,113,113,0.3)",
  },
  successPage: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingTop: "60px",
  },
  successIcon: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    background: "#052e16",
    border: "1px solid #14532d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    color: "#22c55e",
    marginBottom: "24px",
  },
  successTitle: {
    fontSize: "34px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  successSubtitle: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.55)",
    maxWidth: "320px",
    lineHeight: 1.6,
    marginBottom: "24px",
  },
  orderIdLabel: {
    fontSize: "12px",
    letterSpacing: "0.18em",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  orderIdValue: {
    fontSize: "1.2rem",
    fontWeight: 700,
    marginBottom: "28px",
  },
  statusCard: {
    width: "100%",
    background: "#111111",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "24px",
  },
  stageCard: {
    width: "100%",
    background: "#111111",
    border: "1px solid rgba(56,189,248,0.25)",
    borderRadius: "24px",
    padding: "24px",
    marginBottom: "24px",
  },
  stageValue: {
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#7dd3fc",
    marginTop: "10px",
  },
  statusHeader: {
    fontSize: "11px",
    letterSpacing: "1px",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "12px",
  },
  statusValue: {
    fontSize: "28px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  statusText: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.5,
  },
  trackButton: {
    width: "100%",
    padding: "18px",
    borderRadius: "18px",
    background: "#ffffff",
    color: "#000000",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 700,
    textAlign: "center",
    display: "block",
  },
};