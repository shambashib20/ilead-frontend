
function Techstack() {
  return (
    <section className="tech-stack-section">
      <div className="content">
        <h6 className="badge">Tech Stack</h6>

        <h2 className="section-heading">Tech Stack We Used</h2>
        <p className="section-subtitle">
          Our technology ecosystem revolves around robust, scalable solutions
          that power your success.
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
