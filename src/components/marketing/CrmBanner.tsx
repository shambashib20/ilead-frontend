function CRMBanner() {
  return (
    <section style={{ padding: "20px 24px", backgroundColor: "#ffffff" }}>
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          background: "linear-gradient(0, #0b172c, #19325c)",
          borderRadius: "12px",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "20px",
        }}
      >
        {/* Left: Icon + Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            flex: "1 1 300px",
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
              fontSize: "22px",
              fontWeight: 700,
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
            gap: "6px",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
        >
          Talk To Our Expert &nbsp;›
        </button>
      </div>
    </section>
  );
}

export default CRMBanner;
