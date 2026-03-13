function ComSec() {
  return (
    <section className="comm-section">
      <div className="comm-container">
        <div className="comm-content">
          <h2
            className="font-[family-name:var(--font-display-semibold)]"
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "rgb(255, 255, 255)",
              margin: "0px 0px 16px",
              lineHeight: 1.3,
            }}
          >
            Why Choose ETC CRM Software?
          </h2>

          <p>
            In today’s competitive business environment, managing leads,
            customers and sales pipelines efficiently is the key to sustainable
            growth. ETC CRM is designed to simplify your operations, improve
            team productivity, and help you convert more opportunities into
            long-term customers — all from one intelligent platform.
          </p>

          <ul className="comm-list">
            <li>
              <span className="">
                <img
                  src="img/Centralized Lead & Customer Management.png"
                  alt=""
                  className=""
                />
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    marginBottom: "6px",
                    color: "#1e293b",
                    fontWeight: "600",
                  }}
                >
                  Centralized Lead & Customer Management
                </h3>
                <p>
                  Keep all your contacts, inquiries and communication history
                  organized in one secure system, ensuring no lead is ever lost
                  or overlooked.
                </p>
              </div>
            </li>

            <li>
              <span className="icon">
                <img
                  src="img/Smart Automation & Workflow Efficiency.png"
                  alt="centralized-lead-Customer-Management"
                />
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    marginBottom: "6px",
                    color: "#1e293b",
                    fontWeight: "600",
                  }}
                >
                  Smart Automation & Workflow Efficiency
                </h3>
                <p>
                  Automate follow-ups, task assignments, reminders and
                  notifications to reduce manual work and keep your team focused
                  on closing deals.
                </p>
              </div>
            </li>

            <li>
              <span className="icon">
                <img
                  src="img/Secure, Cloud-Based Access.png"
                  alt="smart-automation-workflow-efficiency"
                />
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    marginBottom: "6px",
                    color: "#1e293b",
                    fontWeight: "600",
                  }}
                >
                  Secure, Cloud-Based Access
                </h3>
                <p>
                  Access your CRM anytime, anywhere with secure cloud technology
                  that keeps your business data protected while ensuring
                  uninterrupted performance and reliability.
                </p>
              </div>
            </li>

            <li>
              <span className="icon">
                <img
                  src="img/Seamless Integrations & Scalability.png"
                  alt="secure-cloud-cased-access"
                />
              </span>
              <div>
                <h3
                  style={{
                    fontSize: "18px",
                    marginBottom: "6px",
                    color: "#1e293b",
                    fontWeight: "600",
                  }}
                >
                  Seamless Integrations & Scalability
                </h3>
                <p>
                  Easily connect with third-party tools and scale the system as
                  your business grows — making ETC CRM a flexible solution for
                  startups and enterprises alike.
                </p>
              </div>
            </li>
          </ul>
        </div>

        <div className="comm-visual">
          <img
            src="/img/ETC_CRM_Centralized Lead Management.png"
            alt="University Dashboard"
            className="seamless-integrations-scalability"
          />

          {/* <!-- <div className="floating-tag top">📢 Inter-Department Announcements</div>

          <div className="floating-tag bottom">📄 Policy & Circular Broadcasts</div> --> */}
        </div>
      </div>
    </section>
  );
}

export default ComSec;
