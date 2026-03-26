import "@/styles/style.css";
import { useEffect, useState, useRef } from "react";

const HeroSec = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const logosWrapperRef = useRef<HTMLDivElement>(null);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const wrapper = logosWrapperRef.current;
    const dotsContainer = dotsContainerRef.current;
    if (!wrapper || !dotsContainer) return;

    let autoPlayRef: ReturnType<typeof setInterval>;
    let currentIndex = 0;

    const getSlidesPerView = () => {
      if (window.innerWidth <= 480) return 1;
      if (window.innerWidth <= 768) return 3;
      return 6;
    };

    const init = () => {
      clearInterval(autoPlayRef);

      const slides = wrapper.querySelectorAll(".logo-slide");
      const totalSlides = slides.length;
      const slidesPerView = getSlidesPerView();
      const totalPages = Math.ceil(totalSlides / slidesPerView);

      currentIndex = 0;

      // Dots banana
      dotsContainer.innerHTML = "";
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }

      const goToSlide = (index: number) => {
        currentIndex = Math.max(0, Math.min(index, totalPages - 1));
        const slideWidth = (slides[0] as HTMLElement).offsetWidth + 30; // gap 30px
        wrapper.style.transform = `translateX(-${currentIndex * slidesPerView * slideWidth}px)`;

        // Dots update
        const dots = dotsContainer.querySelectorAll(".dot");
        dots.forEach((dot, i) =>
          dot.classList.toggle("active", i === currentIndex),
        );
      };

      // Prev/Next — clone karke purane listeners hata do
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");

      if (prevBtn && nextBtn) {
        const newPrev = prevBtn.cloneNode(true) as HTMLElement;
        const newNext = nextBtn.cloneNode(true) as HTMLElement;
        prevBtn.parentNode?.replaceChild(newPrev, prevBtn);
        nextBtn.parentNode?.replaceChild(newNext, nextBtn);

        newPrev.addEventListener("click", () => {
          clearInterval(autoPlayRef);
          const prevIndex =
            currentIndex - 1 < 0 ? totalPages - 1 : currentIndex - 1; // 👈 0 se peeche jaane pe last pe jao
          goToSlide(prevIndex);
          startAutoPlay();
        });

        newNext.addEventListener("click", () => {
          clearInterval(autoPlayRef);
          const nextIndex =
            currentIndex + 1 >= totalPages ? 0 : currentIndex + 1; // 👈 last se aage jaane pe 0 pe jao
          goToSlide(nextIndex);
          startAutoPlay();
        });
      }

      goToSlide(0);

      // Autoplay start
      const startAutoPlay = () => {
        clearInterval(autoPlayRef);
        autoPlayRef = setInterval(() => {
          const nextIndex =
            currentIndex + 1 >= totalPages ? 0 : currentIndex + 1;
          goToSlide(nextIndex);
        }, 3000);
      };

      startAutoPlay();
    };

    const timer = setTimeout(init, 100);

    const handleResize = () => {
      currentIndex = 0;
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timer);
      clearInterval(autoPlayRef);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const avatars = [
    "https://ui-avatars.com/api/?name=Rahul+Das&background=4f46e5&color=fff&rounded=true",
    "https://ui-avatars.com/api/?name=Priya+Sen&background=0891b2&color=fff&rounded=true",
    "https://ui-avatars.com/api/?name=Amit+Roy&background=059669&color=fff&rounded=true",
    "https://ui-avatars.com/api/?name=Sneha+Ghosh&background=d97706&color=fff&rounded=true",
  ];
  return (
    <>
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
              </li>
            </ul>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: isMobile ? "24px" : "14px",
                marginTop: "28px",
                padding: isMobile ? "0px" : "0",
              }}
            >
              {/* Trustpilot Stars Row — same rahega, wrap hoga khud */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                {/* Stars — same */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: isMobile ? "24px" : "28px",
                        height: isMobile ? "24px" : "28px",
                        backgroundColor: "#00b67a",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                      </svg>
                    </div>
                  ))}
                </div>

                {/* Trustpilot label — same */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#00b67a"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: "600",
                      letterSpacing: "0.3px",
                    }}
                  >
                    Trustpilot
                  </span>
                </div>
              </div>

              {/* Avatars + Text Row */}
              <div
                style={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row", // 👈 mobile pe column
                  alignItems: "center",
                  gap: "12px",
                  textAlign: isMobile ? "center" : "left",
                }}
              >
                {/* Stacked avatars — same */}
                <div style={{ display: "flex" }}>
                  {avatars.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "50%",
                        border: "2px solid #0f1f3d",
                        marginLeft: i === 0 ? "0" : "-10px",
                        overflow: "hidden",
                        background: `hsl(${210 + i * 30}, 60%, 45%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 4 - i,
                        position: "relative",
                      }}
                    >
                      <img
                        src={src}
                        alt={`user-${i}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Text */}
                <p
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: isMobile ? "12px" : "14px", // 👈 mobile pe smaller
                    margin: 0,
                    fontWeight: "400",
                  }}
                >
                  Trusted by{" "}
                  <span style={{ color: "#ffffff", fontWeight: "700" }}>
                    14,000+
                  </span>{" "}
                  SDRs, Sales Ops, Team Leads & more
                </p>
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
                <div
                  className="logos-wrapper"
                  id="logosWrapper"
                  ref={logosWrapperRef}
                >
                  <div className="logo-slide">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/76/Slack_Icon.png"
                      alt="Slack"
                    />
                  </div>
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
              <div
                className="dots"
                id="dotsContainer"
                ref={dotsContainerRef}
              ></div>
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
