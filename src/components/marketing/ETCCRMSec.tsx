import React from "react";

// --- Icons ---
const RealEstateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f8b12d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="38"
    height="38"
  >
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const JobsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f8b12d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="38"
    height="38"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const B2BIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f8b12d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="38"
    height="38"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
  </svg>
);

const EcommerceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f8b12d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="38"
    height="38"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
  </svg>
);

const HealthIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f8b12d"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="38"
    height="38"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// --- Types ---
interface IndustryCardProps {
  icon: React.ReactNode;
  label: string;
}

// --- Industry Card ---
const IndustryCard: React.FC<IndustryCardProps> = ({ icon, label }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      backgroundColor: "#ffffff",
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "12px 8px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      cursor: "pointer",
      minHeight: "170px",
    }}
  >
    {icon}
    <span
      style={{
        color: "#333",
        fontSize: "16px",
        fontWeight: 500,
        textAlign: "center",
        lineHeight: "1.4",
        display: "inline-block",
        width: "max-content",
      }}
    >
      {label}
    </span>
  </div>
);

// --- Main Component ---
function ETCCRMSection() {
  const industries = [
    { icon: <RealEstateIcon />, label: "Real Estate" },
    { icon: <JobsIcon />, label: "Jobs &\nRecruiters" },
    { icon: <B2BIcon />, label: "B2B/B2C" },
    { icon: <EcommerceIcon />, label: "E-Commerce" },
    {
      icon: (
        <svg
          width="46"
          height="46"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 6H18C19.1046 6 20 6.89543 20 8V16C20 17.1046 19.1046 18 18 18H6C4.89543 18 4 17.1046 4 16V8C4 6.89543 4.89543 6 6 6Z"
            stroke="#f8b12d"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6"
            stroke="#f8b12d"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M8 12H16"
            stroke="#f8b12d"
            stroke-width="2"
            stroke-linecap="round"
          />
          <path
            d="M8 16H16"
            stroke="#f8b12d"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      ),
      label: "Travel",
    },
    { icon: <HealthIcon />, label: "Health Care" },
  ];

  return (
    <section style={{ backgroundColor: "#fff", padding: "32px 16px" }}>
      <div className="container">
        {/* Outer beige card */}
        <div
          style={{
            backgroundColor: "#f5f0e8",
            border: "1px solid #e3d9c8",
            borderRadius: "16px",
            padding: "36px 32px",
          }}
        >
          {/* Inner flex layout */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "center",
            }}
          >
            {/* LEFT — text + button */}
            <div style={{ flex: "1 1 280px", minWidth: "240px" }}>
              <h3
                className="font-[family-name:var(--font-display-semibold)]"
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  marginBottom: "14px",
                  lineHeight: "1.3",
                  margin: "0 0 14px 0",
                }}
              >
                Industries Using Our CRM Solutions
              </h3>

              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.75",
                  margin: "0 0 12px 0",
                  textAlign: "justify",
                }}
              >
                Our advanced CRM Software empowers businesses across multiple
                sectors with smart tools for lead management, customer tracking,
                sales automation, and faster communication. We proudly support
                industries like Real Estate, Job &amp; Recruitment,
                Matrimonials, B2B, Ecommerce, Education, Travel, and Health
                Care, helping them simplify operations and boost productivity.
              </p>

              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.75",
                  margin: "0 0 28px 0",
                }}
              >
                With our cloud-based CRM, teams can manage inquiries, automate
                follow-ups, nurture leads, and improve customer experience with
                ease. Its customizable dashboards, workflow automation, and
                real-time insights help businesses close more deals and deliver
                better service. Designed for all industries, our CRM ensures
                efficiency, scalability, and higher conversions.
              </p>

              <button
                style={{
                  backgroundColor: "#e53935 ",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 600,
                  padding: "10px 22px",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  letterSpacing: "0.2px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e53935")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e53935")
                }
              >
                Get a Quote &nbsp;→
              </button>
            </div>

            {/* RIGHT — industry grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
                flexShrink: 0,
                width: "100%",
                maxWidth: "540px",
              }}
            >
              {industries.map((industry, idx) => (
                <IndustryCard
                  key={idx}
                  icon={industry.icon}
                  label={industry.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ETCCRMSection;
