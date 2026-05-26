"use client";

export default function Home() {
  return (
    <main style={styles.page}>
      <div style={styles.container}>

        <section style={styles.hero}>
          <div style={styles.badge}>LIC PRINT SHOP</div>

          <h1 style={styles.title}>
            BIR Receipts & Invoices
            <br />
            Made Simple
          </h1>

          <p style={styles.subtitle}>
            A polished help desk for fast printing requests, order tracking, and updates from LIC Print Shop.
          </p>

          <p style={styles.trustLine}>
            BIR-accredited • Hassle-free • Fast updates
          </p>
        </section>

        <a href="/order" style={styles.primaryButton}>
          <div>
            <div style={styles.primaryTitle}>Order BIR Receipts & Invoice</div>
            <div style={styles.primaryDesc}>Submit details and get a quick quote</div>
          </div>
          <span style={styles.arrow}>→</span>
        </a>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>How to place an order</div>
            <div style={styles.sectionNote}>Follow these simple steps</div>
          </div>

          <div style={styles.guideCard}>
            <div style={styles.guideStep}>
              <strong>1.</strong> Click <em>Place an order</em> and fill in your business details, contact info, and printing options.
            </div>
            <div style={styles.guideStep}>
              <strong>2.</strong> Choose whether your order has an <strong>ATP</strong> (Authorization to Print).
            </div>
            <div style={styles.guideNote}>
              If your order <strong>has ATP</strong>, you can complete the request online and attach any proof documents.
            </div>
            <div style={styles.guideNote}>
              If your order <strong>does not have ATP</strong>, you must rely on a <strong>walk-in</strong> visit to the store for verification before printing can begin.
            </div>
            <div style={styles.guideStep}>
              <strong>3.</strong> Submit your request and use the order ID to track progress on the Track page.
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionLabel}>Quick access</div>
            <div style={styles.sectionNote}>Everything you need in one place</div>
          </div>

          <div style={styles.grid}>
            <a href="/track" style={styles.card}>
              <span style={styles.icon}>📦</span>
              <div>
                <div style={styles.cardTitle}>Track orders</div>
                <div style={styles.cardDesc}>See status updates instantly.</div>
              </div>
            </a>

            <a href="http://licprintingshop.net/" target="_blank" style={styles.card}>
              <span style={styles.icon}>🌐</span>
              <div>
                <div style={styles.cardTitle}>Official site</div>
                <div style={styles.cardDesc}>Learn more about our services.</div>
              </div>
            </a>

            <a href="https://www.facebook.com/licprintingshop" target="_blank" style={styles.card}>
              <span style={styles.icon}>📘</span>
              <div>
                <div style={styles.cardTitle}>Facebook</div>
                <div style={styles.cardDesc}>Message support quickly.</div>
              </div>
            </a>

            <a href="https://www.instagram.com/lic.printingshop/" target="_blank" style={styles.card}>
              <span style={styles.icon}>📸</span>
              <div>
                <div style={styles.cardTitle}>Instagram</div>
                <div style={styles.cardDesc}>See recent print samples.</div>
              </div>
            </a>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionLabel}>System status</div>

          <div style={styles.statusContainer}>
            <div style={styles.statusCard}>
              <span style={styles.statusDot} />
              Online & stable
            </div>
            <div style={styles.statusCard}>
              <span style={styles.statusDot} />
              Request flow enabled
            </div>
            <div style={styles.statusCard}>
              <span style={styles.statusDot} />
              Customer support ready
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          Fast • Reliable • Automated • User-friendly
        </footer>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "36px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 24%), radial-gradient(circle at bottom right, rgba(16,185,129,0.14), transparent 28%), #03050c",
    color: "#f9fafb",
    fontFamily: "Inter, Arial, sans-serif"
  },

  container: {
    width: "100%",
    maxWidth: "640px",
    borderRadius: "32px",
    padding: "36px",
    background: "rgba(15,23,42,0.92)",
    boxShadow: "0 30px 80px rgba(0, 0, 0, 0.35)",
    border: "1px solid rgba(148,163,184,0.12)"
  },

  hero: {
    marginBottom: "32px"
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(99,102,241,0.14)",
    color: "#c7d2fe",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "18px",
    border: "1px solid rgba(99,102,241,0.25)"
  },

  title: {
    fontSize: "3.2rem",
    lineHeight: 1.03,
    margin: 0,
    fontWeight: 800,
    letterSpacing: "-0.04em"
  },

  subtitle: {
    marginTop: "18px",
    color: "rgba(226,232,240,0.82)",
    fontSize: "1rem",
    lineHeight: 1.75,
    maxWidth: "42rem"
  },

  trustLine: {
    marginTop: "14px",
    color: "rgba(226,232,240,0.72)",
    fontSize: "0.95rem",
    lineHeight: 1.7,
    letterSpacing: "0.02em"
  },

  primaryButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "22px 26px",
    borderRadius: "26px",
    textDecoration: "none",
    background: "linear-gradient(135deg, #e2e8f0 0%, #ffffff 100%)",
    color: "#0f172a",
    fontWeight: 700,
    boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
    marginBottom: "30px"
  },

  arrow: {
    fontSize: "1.4rem"
  },

  primaryTitle: {
    fontSize: "1.05rem",
    marginBottom: "6px"
  },

  primaryDesc: {
    fontSize: "0.95rem",
    color: "rgba(15,23,42,0.7)"
  },

  section: {
    marginBottom: "28px"
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "18px"
  },

  sectionLabel: {
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#93c5fd"
  },

  sectionNote: {
    color: "rgba(226,232,240,0.75)",
    fontSize: "0.95rem"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px"
  },

  card: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
    padding: "18px 20px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.25s ease, border-color 0.25s ease, background 0.25s ease"
  },

  icon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    background: "rgba(99,102,241,0.18)",
    fontSize: "1.4rem"
  },

  cardTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "4px"
  },

  cardDesc: {
    fontSize: "0.94rem",
    color: "rgba(226,232,240,0.72)"
  },

  statusContainer: {
    display: "grid",
    gap: "14px"
  },

  guideCard: {
    display: "grid",
    gap: "14px",
    padding: "22px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.12)",
    marginBottom: "24px"
  },

  guideStep: {
    color: "#e2e8f0",
    fontSize: "0.96rem",
    lineHeight: 1.7,
  },

  guideNote: {
    color: "rgba(226,232,240,0.82)",
    fontSize: "0.94rem",
    lineHeight: 1.7,
    paddingLeft: "16px",
    borderLeft: "3px solid rgba(99,102,241,0.7)",
    marginBottom: "0px"
  },

  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 18px",
    borderRadius: "18px",
    background: "rgba(15,23,42,0.8)",
    border: "1px solid rgba(148,163,184,0.18)",
    color: "#e2e8f0"
  },

  statusDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#34d399"
  },

  footer: {
    marginTop: "6px",
    paddingTop: "18px",
    fontSize: "0.92rem",
    color: "rgba(226,232,240,0.62)"
  }
};