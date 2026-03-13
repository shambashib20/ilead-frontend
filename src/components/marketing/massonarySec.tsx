function MassonarySec() {
  return (
    <section className="massonary-sec " style={{ paddingTop: "60px" }}>
      <div className="container">
        <div className="text-center mt-5">
          <div
            className="max-w-[800px] w-[800px] "
            style={{ marginInline: "auto" }}
          >
            <h2
              className="font-[family-name:var(--font-display-semibold)]"
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "#000",
                margin: "0 0 16px 0",
                lineHeight: "1.3",
              }}
            >
              Take Your Sales & Customer Management to the Next Level for any
              Industry?
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.75",
                margin: "0 0 12px 0",
              }}
            >
              ETC CRM a complete, all-in-one solution designed to streamline
              your sales process, strengthen customer relationships and boost
              team productivity. Work smarter. Respond faster. Convert better.
              View Demo
            </p>
          </div>
          <img
            src="/img/ETC_CRM_IMAGE.png"
            alt=""
            className="max-w-full "
            style={{ marginInline: "auto" }}
          />
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
            View Demo
          </button>
        </div>
      </div>
    </section>
  );
}

export default MassonarySec;
