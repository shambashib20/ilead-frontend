
function Techstack() {
  return (
    <section className="tech-stack-section">
      <div
        className="content"
        style={{ maxWidth: "1000px", marginInline: "auto" }}
      >
        <h6 className="badge">Tech Stack</h6>

        <h2 className="text-[28px] font-[family-name:var(--font-display-semibold)] text-gray-900 leading-tight">
          All Your Favourite Tools in One CRM
        </h2>
        <h4 className="text-3xl font-[family-name:var(--font-text)] inline-block mt-1">
          Seamless Integrations That Power Your Growth
        </h4>
        <p className="section-subtitle" style={{ marginTop: "30px" }}>
          ETC CRM brings all your essential business tools together into one
          unified platform. From email platforms and calling systems to
          marketing automation, payment gateways and communication apps —
          everything connects smoothly to streamline your workflow. With
          powerful third-party integrations, your team can eliminate data silos,
          automate repetitive tasks and maintain real-time synchronization
          across platforms.
        </p>

        <p className="section-subtitle " style={{ marginTop: "20px" }}>
          This ensures better collaboration, faster response times and a more
          efficient sales process. ETC CRM helps you work smarter by keeping
          your tools connected — No more switching between multiple software or
          managing scattered data. ETC CRM ensures real-time synchronization, so
          your sales, marketing and support teams always have accurate and
          updated information at their fingertips.
        </p>
      </div>

      <div className="solar-system">
        <div id="connectionLines" className="connection-lines-layer"></div>

        <div className="center-logo">
          <img src="/img/logo_small.png" alt="" />
        </div>

        <div className="orbit orbit-1a">
          <div className="tech-planet">
            <img src="/img/react.png" />
            <div className="tech-label">React</div>
          </div>
        </div>

        <div className="orbit orbit-1b">
          <div className="tech-planet">
            <img src="/img/node.png" />
            <div className="tech-label">Node.js</div>
          </div>
        </div>

        <div className="orbit orbit-2">
          <div className="tech-planet">
            <img src="/img/nextjs.png" alt="" />
            <div className="tech-label">Vue</div>
          </div>
        </div>

        <div className="orbit orbit-3">
          <div className="tech-planet">
            <img src="/img/tailwind.png" alt="" />
            <div className="tech-label">tailwind</div>
          </div>
        </div>

        <div className="orbit orbit-4">
          <div className="tech-planet">
            <img src="/img/razor.png" alt="" />
            <div className="tech-label">Angular</div>
          </div>
        </div>

        <div className="orbit orbit-5">
          <div className="tech-planet">
            <img src="/img/aws.png" alt="" />
            <div className="tech-label">Python</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Techstack;
