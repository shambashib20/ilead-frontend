import { useEffect, useState } from "react";

function CRMBanner() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section style={{ padding: "20px 24px", backgroundColor: "#ffffff" }}>
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          background: "linear-gradient(0, #0b172c, #19325c)",
          borderRadius: "12px",
          padding: isMobile ? "24px 20px" : "28px 32px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // 👈
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        {/* Left: Icon + Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: isMobile ? "center" : "start",
            gap: "18px",
            width: isMobile ? "100%" : "auto",
            flex: isMobile ? "1 1 134px" : "1 1 300px",
          }}
        >
          <img
            src="img/customer-service.png"
            alt="contact-to-etc-crm-for-increseing your-sales"
            className="w-15"
          />
          <h4
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: isMobile ? "12px" : "22px", // 👈
              fontWeight: 700,
              textAlign: isMobile ? "center" : "left",
              lineHeight: "1.5",
            }}
          >
            Increase your Sales and nurture Customer
            <br />
            Relationships with our CRM Software Solution
          </h4>
        </div>

        {/* Right: Button */}
        <button
          style={{
            backgroundColor: "#E53935",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: "6px",
            border: "2px solid transparent",
            cursor: "pointer",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            textAlign: isMobile ? "center" : "left",
            gap: "6px",
            justifyContent: isMobile ? "center" : "space-between",
            transition: "background-color 0.2s ease, color 0.2s ease",
            alignSelf: isMobile ? "flex-start" : "auto", // 👈 mobile pe left align
          }}
        >
          Talk To Our Expert &nbsp;›
        </button>
      </div>
    </section>
  );
}

export default CRMBanner;
