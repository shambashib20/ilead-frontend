import { useEffect, useState } from "react";

function AICRMBanner() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      style={{
        background: "linear-gradient(0, #0b172c, #19325c)",
        padding: isMobile ? "40px 20px" : "60px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          maxWidth: "880px",
          margin: "0 auto",
        }}
      >
        <h2
          className="font-[family-name:var(--font-display-semibold)]"
          style={{
            fontSize: isMobile ? "24px" : "28px",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 16px 0",
            lineHeight: "1.3",
          }}
        >
          Power Your Business with Smart CRM Solutions
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#a8bfc9",
            lineHeight: "1.75",
            margin: "0 0 28px 0",
          }}
        >
          Let our experts show how ETC CRM can simplify lead management,
          <br />
          automate workflows and strengthen customer relationships.
        </p>

        <button
          style={{
            backgroundColor: "#e53935",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            padding: "12px 28px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            letterSpacing: "0.2px",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e53935")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e53935")
          }
        >
          Schedule a Demo
        </button>
      </div>
    </section>
  );
}

export default AICRMBanner;
