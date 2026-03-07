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
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22 16.92V19C22.001 19.9485 21.684 20.8689 21.1058 21.6143C20.5277 22.3597 19.7244 22.8856 18.822 23.107C17.9196 23.3284 16.972 23.2319 16.1333 22.834C15.2946 22.4362 14.616 21.7625 14.212 20.926L12.5 17.5C12.1559 16.8439 11.9755 16.1135 11.9755 15.3725C11.9755 14.6315 12.1559 13.9011 12.5 13.245L10 10.745L7.25 13.495C7.99722 14.9253 8.43043 16.496 8.515 18.115C8.53637 18.5654 8.43868 19.0142 8.23143 19.4132C8.02417 19.8122 7.71483 20.1465 7.33696 20.38C6.95909 20.6135 6.52719 20.7371 6.08646 20.7377C5.64573 20.7383 5.21348 20.6159 4.835 20.3835C2.934 19.1555 1.62 17.455 1.178 15.7085C0.735962 13.962 1.123 12.22 2.222 10.72L6.84 4.556C7.28816 3.95341 7.88519 3.47225 8.57355 3.15687C9.2619 2.84149 10.0196 2.70254 10.7775 2.75213C11.5354 2.80171 12.268 3.03805 12.908 3.43775C13.5481 3.83745 14.0736 4.38687 14.435 5.038L17.86 11.5C18.2581 12.2334 18.8245 12.8636 19.51 13.34C20.1955 13.8164 20.9804 14.125 21.807 14.24C22.3621 14.3241 22.8702 14.5873 23.2525 14.986C23.6348 15.3847 23.8671 15.894 23.91 16.437C23.9529 16.98 23.804 17.5205 23.4915 17.96C23.179 18.3995 22.7246 18.7073 22.207 18.823L22 16.92Z"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p
            style={{
              margin: 0,
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: "1.5",
            }}
          >
            Increase your Sales and nurture Customer
            <br />
            Relationships with our CRM Software Solution
          </p>
        </div>

        {/* Right: Button */}
        <button
          style={{
            backgroundColor: "transparent",
            color: "#ffffff",
            fontSize: "12px",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: "6px",
            border: "2px solid #ffffff",
            cursor: "pointer",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "background-color 0.2s ease, color 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#7b1a4b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#ffffff";
          }}
        >
          GET LIVE DEMO NOW &nbsp;›
        </button>
      </div>
    </section>
  );
}

export default CRMBanner;
