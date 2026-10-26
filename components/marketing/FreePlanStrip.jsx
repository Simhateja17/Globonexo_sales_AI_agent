import Link from "next/link";
import Icon from "../ui/Icon";
import { FREE_PLAN } from "../../lib/plans";

// Free sits above the three paid cards rather than inside the grid, so the
// paid comparison keeps its three-column layout.
export default function FreePlanStrip({ style }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px 24px",
        padding: "20px 24px",
        marginBottom: "24px",
        borderRadius: "16px",
        border: "1px solid #e7ede9",
        background: "#fff",
        color: "#0a1712",
        boxShadow: "0 2px 8px rgba(10,23,18,.06), 0 1px 2px rgba(10,23,18,.04)",
        ...style,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 320px" }}>
        <div style={{ fontWeight: 800, fontSize: "17px" }}>
          {FREE_PLAN.name} <span style={{ fontWeight: 600, opacity: 0.7 }}>· $0, no card needed</span>
        </div>
        <p style={{ margin: "6px 0 0", fontSize: "14px", lineHeight: 1.55, opacity: 0.85 }}>
          {FREE_PLAN.feats.join(" · ")}. Work email required. Lead enrichment and AI calling come with paid plans.
        </p>
      </div>
      <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", flex: "none", padding: "12px 20px", borderRadius: "999px", background: "#00a86b", color: "#fff", fontWeight: 800, fontSize: "15px", textDecoration: "none" }}>
        Start free <Icon name="arrow" size={16} color="currentColor" />
      </Link>
    </div>
  );
}
