function AICRMBanner() {
  return (
    <section
      style={{
        background: "linear-gradient(0, #0b172c, #19325c)",
        padding: "60px 24px",
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
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 16px 0",
            lineHeight: "1.3",
          }}
        >
          Let's put AI to work for CRM
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#a8bfc9",
            lineHeight: "1.75",
            margin: "0 0 28px 0",
          }}
        >
          Our experts can help you get started evaluating a solution to best
          manage your customer relationships.
          <br />
          See how a CRM implementation would work in your specific environment.
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
          Connect With Us
        </button>
      </div>
    </section>
  );
}

export default AICRMBanner;
