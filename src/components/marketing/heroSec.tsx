import "@/styles/style.css";

const HeroSec = () => {
  return (
    <>
      <header>
        <div className="container">
          <div className="flex items-center">
            <div className="logo">
              <a href="">
                <img src="/img/logo_dark.png" alt="" />
              </a>
            </div>
            <nav>
              <ul className="flex items-center justify-center">
                <li className="active">
                  <a href=""> Home </a>
                </li>
                <li>
                  <a href="/pricing.html"> Pricing </a>
                </li>

                <li>
                  <a href="/contact.html"> Contacts </a>
                </li>
              </ul>
            </nav>
            <div className="options">
              <ul className="flex justify-end items-center">
                <li>
                  <select name="" id="">
                    <option value="">en</option>
                  </select>
                </li>
                <li>
                  <a href="/login" className="login">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="register" id="openModalBtn">
                    <span>
                      Get Started
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
                        className="lucide lucide-arrow-right"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="hamburger">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-menu-icon lucide-menu"
                >
                  <path d="M4 5h16" />
                  <path d="M4 12h16" />
                  <path d="M4 19h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="hero-sec">
        <img src="./img/grid.png" alt="" className="img-grid" />

        <div className="circle">
          <span className="one"></span>
          <span className="two"></span>
          <span className="three"></span>
        </div>

        <div className="float-img"></div>
        <div className="gradient g1"></div>

        <div className="container">
          <div className="gradient g1"></div>
          <div className="gradient g2"></div>
          <div className="gradient g3"></div>

          <div className="content">
            <h6>
              <span>New!!!</span> Auto leads management supports added
            </h6>

            <h2>
              <span className="bold">Close Deals Faster</span> Follow-ups That
              Never
              <span className="color"> Missed</span>
            </h2>

            <p>
              No more <span>lost leads</span>, <span>missed calls</span>, or
              <span> forgotten follow-ups</span>. A simple CRM that keeps you
              ahead—without the chaos of spreadsheets.
            </p>

            <ul>
              <li>
                <a href="/register">
                  {" "}
                  <button className="btn btn-primary">
                    <span>
                      Start Free Trial
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </a>
              </li>
            </ul>

            <div className="box">
              <div className="trust">
                <img src="/img/trusticons.png" alt="" />
                <h4>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="#00c378"
                    stroke="#00c378"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-star"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                  Truster
                </h4>
              </div>

              <div className="user">
                <ul>
                  <li>
                    <img src="/img/user.png" alt="user_img" />
                  </li>
                  <li>
                    <img src="/img/user.png" alt="user_img" />
                  </li>
                  <li>
                    <img src="/img/user.png" alt="user_img" />
                  </li>
                  <li>
                    <img src="/img/user.png" alt="user_img" />
                  </li>
                </ul>

                <h5>
                  Trusted by <span>14,000+</span> bof SDRs, Sales Ops, Team
                  Leads & more
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="collapse-sec">
        <div className="container">
          <img src="./img/application-img.png" alt="" />
        </div>
      </div>

      <div className="companies">
        <div className="content">
          <div className="container">
            <div className="slider-container">
              <div className="logos-slider">
                <div className="logos-wrapper" id="logosWrapper">
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png"
                      alt="Slack"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                      alt="Amazon"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                      alt="Microsoft"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
                      alt="Google"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
                      alt="IBM"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                      alt="Netflix"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/0/02/Stack_Overflow_logo.svg"
                      alt="Stack Overflow"
                    />
                  </div>
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
                      alt="Spotify"
                    />
                  </div>

                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                      alt="Instagram"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="controls">
              <button className="btn-slider" id="prevBtn">
                ❮
              </button>
              <div className="dots" id="dotsContainer"></div>
              <button className="btn-slider" id="nextBtn">
                ❯
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSec;
