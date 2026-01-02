import "@/styles/style.css";

function LoseDeals() {
  return (
    <>
      <section className="lose-details">
        <div className="container">
          <div className="g1 gradient"></div>
          <div className="g2 gradient"></div>
          <div className="g5 gradient"></div>

          <div className="content text-center">
            <h6 className="badge">Problem</h6>
            <h3>Why do most sales teams lose deals?</h3>
            <p>
              No more lost leads, missed calls, or forgotten follow-ups. A
              simple CRM that keeps you ahead—without the chaos of spreadsheets.
            </p>
          </div>

          <div className="vs grid">
            <div className="col before">
              <div className="tag before">Before</div>
              <img
                src="/img/vs-img1.png"
                alt=""
                style={{ filter: "grayscale(1)" }}
              />
              <div className="before-icons">
                <img src="./img/before-img1.png" alt="" />
                <img src="./img/before-img2.png" alt="" />
                <img src="./img/before-img3.png" alt="" />
                <img src="./img/before-img4.png" alt="" />
              </div>
              <ul>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-chart-scatter-icon lucide-chart-scatter"
                    >
                      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
                      <circle cx="18.5" cy="5.5" r=".5" fill="currentColor" />
                      <circle cx="11.5" cy="11.5" r=".5" fill="currentColor" />
                      <circle cx="7.5" cy="16.5" r=".5" fill="currentColor" />
                      <circle cx="17.5" cy="14.5" r=".5" fill="currentColor" />
                      <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                    </svg>
                  </span>
                  <div>
                    <h5>1. Scattered Leads</h5>
                    <p>Leads scattered across spreadsheets & WhatsApp chats</p>
                  </div>
                </li>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-spotlight-icon lucide-spotlight"
                    >
                      <path d="M15.295 19.562 16 22" />
                      <path d="m17 16 3.758 2.098" />
                      <path d="m19 12.5 3.026-.598" />
                      <path d="M7.61 6.3a3 3 0 0 0-3.92 1.3l-1.38 2.79a3 3 0 0 0 1.3 3.91l6.89 3.597a1 1 0 0 0 1.342-.447l3.106-6.211a1 1 0 0 0-.447-1.341z" />
                      <path d="M8 9V2" />
                    </svg>
                  </span>
                  <div>
                    <h5>2. Forgot Follow Up’s</h5>
                    <p>Salespeople forget follow-ups, deals slip away</p>
                  </div>
                </li>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-eye-off-icon lucide-eye-off"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  </span>
                  <div>
                    <h5>3. Zero Visibility</h5>
                    <p>Managers have zero visibility into what’s happening</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bar">
              <span>Vs</span>
            </div>
            <div className="col after">
              <div className="tag after">After</div>
              <img src="/img/vs-img2.png" alt="" />
              <h4>
                <img src="/img/logo.png" alt="" />
              </h4>
              <ul>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-scan-eye-icon lucide-scan-eye"
                    >
                      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                      <circle cx="12" cy="12" r="1" />
                      <path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" />
                    </svg>
                  </span>
                  <div>
                    <h5>1. Capture Lead</h5>
                    <p>One inbox to capture every lead from anywhere</p>
                  </div>
                </li>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-bell-icon lucide-bell"
                    >
                      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                    </svg>
                  </span>
                  <div>
                    <h5>2. Smart Reminders</h5>
                    <p>Smart reminders & SLA timers keep follow-ups on track</p>
                  </div>
                </li>
                <li>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-eye-icon lucide-eye"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </span>
                  <div>
                    <h5>3. Full Visibility</h5>
                    <p>
                      Clear pipeline with full visibility for the entire team
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <button className="btn btn-primary">Know More</button>
        </div>
      </section>
    </>
  );
}

export default LoseDeals;
