import React, {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
  type MouseEvent,
} from "react";

// Define interfaces
interface Review {
  name: string;
  role: string;
  text: string;
}

interface Config {
  reviewData: Review[];
}

// Define event handler types
type MouseHandler = (e: MouseEvent<HTMLDivElement>) => void;
type TouchHandler = (e: TouchEvent<HTMLDivElement>) => void;

function Features() {
  // State for reviews carousel
  const [isDown, setIsDown] = useState<boolean>(false);
  const startXRef = useRef<number>(0);
  const scrollLeftRef = useRef<number>(0);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  // State for accordion

  // Animation configuration
  const CONFIG: Config = {
    reviewData: [
      {
        name: "Tushar Dutta",
        role: "Software Architecture",
        text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci enim, ipsam alias quos officia pariatur aspernatur, hic totam fugit doloribus debitis corrupti minus laudantium eveniet obcaecati non error natus nulla.",
      },
      {
        name: "Sarah Johnson",
        role: "Product Manager",
        text: "This CRM has transformed how our team collaborates. The interface is intuitive and the reporting features are exactly what we needed.",
      },
      {
        name: "Michael Chen",
        role: "Sales Director",
        text: "Our sales team's efficiency has increased by 40% since implementing this CRM. The automation features save us hours each week.",
      },
      {
        name: "Emma Rodriguez",
        role: "Marketing Lead",
        text: "Integration with our existing tools was seamless. The customer support team was incredibly helpful during setup.",
      },
      {
        name: "David Wilson",
        role: "CTO",
        text: "The analytics and reporting capabilities provide valuable insights that help us make data-driven decisions.",
      },
      {
        name: "Lisa Thompson",
        role: "Customer Success",
        text: "Our customer retention has improved significantly since using this CRM to track interactions and follow-ups.",
      },
    ],
  };

  const createRipple = (
    e: React.MouseEvent<HTMLElement>,
    element: HTMLElement | null
  ) => {
    if (!element) return;

    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      width: ${size}px;
      height: ${size}px;
      top: ${y}px;
      left: ${x}px;
      pointer-events: none;
      z-index: 1;
    `;

    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  // Handle scroll wrapper mouse events with proper typing
  const handleMouseDown: MouseHandler = (e) => {
    setIsDown(true);
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.style.animationPlayState = "paused";
      startXRef.current = e.pageX - scrollWrapperRef.current.offsetLeft;
      scrollLeftRef.current = scrollWrapperRef.current.scrollLeft;
    }
  };

  const handleMouseMove: MouseHandler = (e) => {
    if (!isDown || !scrollWrapperRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollWrapperRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollWrapperRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleTouchStart: TouchHandler = (e) => {
    setIsDown(true);
    if (scrollWrapperRef.current) {
      scrollWrapperRef.current.style.animationPlayState = "paused";
      startXRef.current =
        e.touches[0].pageX - scrollWrapperRef.current.offsetLeft;
      scrollLeftRef.current = scrollWrapperRef.current.scrollLeft;
    }
  };

  const handleTouchMove: TouchHandler = (e) => {
    if (!isDown || !scrollWrapperRef.current) return;
    const x = e.touches[0].pageX - scrollWrapperRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 2;
    scrollWrapperRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handlePointerUp = () => {
    setIsDown(false);
    setTimeout(() => {
      if (scrollWrapperRef.current) {
        scrollWrapperRef.current.style.animationPlayState = "running";
      }
    }, 3000);
  };

  // Initialize Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          const once = (el.getAttribute("data-once") ?? "true") !== "false";

          if (entry.isIntersecting) {
            const dur = parseInt(el.getAttribute("data-duration") || "700", 10);
            const delaySelf = parseInt(
              el.getAttribute("data-delay") || "0",
              10
            );
            const ease =
              el.getAttribute("data-easing") || "cubic-bezier(0.22,1,0.36,1)";

            el.style.transitionDuration = `${dur}ms`;
            el.style.transitionTimingFunction = ease;
            el.style.transitionDelay = `${delaySelf}ms`;
            el.classList.add("is-inview");

            if (once) observer.unobserve(el);
          } else {
            if ((el.getAttribute("data-once") ?? "true") === "false") {
              el.classList.remove("is-inview");
              el.style.transitionDelay = "0ms";
            }
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    // Observe all elements with data-animate attribute
    document
      .querySelectorAll<HTMLElement>("[data-animate]")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Populate horizontal scroll container with reviews
  useEffect(() => {
    const scrollWrapper = document.getElementById("scrollWrapper");
    if (!scrollWrapper) return;

    const createReviewCard = (review: Review) => {
      return `
        <div class="card">
          <div class="flex">
            <img src="/img/user-dummy.png" alt="${review.name}" />
            <h4>
              ${review.name}
              <span>${review.role}</span>
              <ul>
                <li>⭐</li>
                <li>⭐</li>
                <li>⭐</li>
                <li>⭐</li>
                <li>⭐</li>
              </ul>
            </h4>
          </div>
          <p>${review.text}</p>
        </div>
      `;
    };

    let cardsHTML = "";
    for (let i = 0; i < 3; i++) {
      CONFIG.reviewData.forEach((review) => {
        cardsHTML += createReviewCard(review);
      });
    }

    scrollWrapper.innerHTML = cardsHTML;

    // Cleanup
    return () => {
      if (scrollWrapper) scrollWrapper.innerHTML = "";
    };
  }, []);

  // Setup event listeners for scroll wrapper
  useEffect(() => {
    const wrapper = scrollWrapperRef.current;
    if (!wrapper) return;

    const handleMouseDownWrapper = (e: globalThis.MouseEvent) => {
      const event = e as unknown as MouseEvent<HTMLDivElement>;
      handleMouseDown(event);
    };

    const handleMouseMoveWrapper = (e: globalThis.MouseEvent) => {
      const event = e as unknown as MouseEvent<HTMLDivElement>;
      handleMouseMove(event);
    };

    const handleTouchStartWrapper = (e: globalThis.TouchEvent) => {
      const event = e as unknown as TouchEvent<HTMLDivElement>;
      handleTouchStart(event);
    };

    const handleTouchMoveWrapper = (e: globalThis.TouchEvent) => {
      const event = e as unknown as TouchEvent<HTMLDivElement>;
      handleTouchMove(event);
    };

    const handleMouseUpWrapper = () => handlePointerUp();
    const handleTouchEndWrapper = () => handlePointerUp();

    wrapper.addEventListener(
      "mousedown",
      handleMouseDownWrapper as EventListener
    );
    wrapper.addEventListener(
      "mousemove",
      handleMouseMoveWrapper as EventListener
    );
    wrapper.addEventListener("mouseleave", () => setIsDown(false));
    wrapper.addEventListener("mouseup", handleMouseUpWrapper);
    wrapper.addEventListener(
      "touchstart",
      handleTouchStartWrapper as EventListener
    );
    wrapper.addEventListener(
      "touchmove",
      handleTouchMoveWrapper as EventListener
    );
    wrapper.addEventListener("touchend", handleTouchEndWrapper);

    return () => {
      wrapper.removeEventListener(
        "mousedown",
        handleMouseDownWrapper as EventListener
      );
      wrapper.removeEventListener(
        "mousemove",
        handleMouseMoveWrapper as EventListener
      );
      wrapper.removeEventListener("mouseleave", () => setIsDown(false));
      wrapper.removeEventListener("mouseup", handleMouseUpWrapper);
      wrapper.removeEventListener(
        "touchstart",
        handleTouchStartWrapper as EventListener
      );
      wrapper.removeEventListener(
        "touchmove",
        handleTouchMoveWrapper as EventListener
      );
      wrapper.removeEventListener("touchend", handleTouchEndWrapper);
    };
  }, [isDown]);

  // Handle button clicks with ripple effect
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e, e.currentTarget);
    // Add your button click logic here
  };

  return (
    <>
      <section className="features">
        <div className="container">
          <div className="g3 gradient"></div>
          <div className="g4 gradient"></div>

          <div className="content text-center">
            <h6 className="badge">Problem</h6>
            <h3>Less chaos. More closed deals</h3>
            <p>
              Eliminate lost leads, missed opportunities, and forgotten
              follow-ups with our intelligent lead management CRM. Stay
              organized, track every interaction, and close deals faster—without
              spreadsheets or complicated workflows
            </p>
          </div>

          <div className="feature_grid">
            <div className="grid">
              <div className="col red" data-animate="true" data-delay="100">
                <div className="parallax-wrapper">
                  <div className="icon-container">
                    <img src="./img/card1.chart.svg" alt="" />
                  </div>
                  <div className="parallax-bg"></div>
                </div>
                <h5>
                  Capture Every Lead from Any Channel
                  <svg
                    className="title-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </h5>
                <p>
                  Never lose a lead again. Automatically capture incoming leads
                  from emails, phone calls, web forms, social media, and
                  WhatsApp in one centralized location. Our lead management
                  system ensures no prospect slips through the cracks, giving
                  your sales team a complete view of every potential customer.
                </p>
              </div>

              <div className="col blue" data-animate="true" data-delay="200">
                <div className="parallax-wrapper">
                  <div className="icon-container">
                    <img
                      src="./img/card3.chart.svg"
                      alt=""
                      style={{ width: "500px", height: "auto" }}
                    />
                  </div>
                  <div className="parallax-bg"></div>
                </div>
                <h5>
                  Organize Your Sales Pipeline—One Clean View
                  <svg
                    className="title-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </h5>
                <p>
                  See your entire lead management pipeline at a glance. All
                  leads are automatically organized by sales stage, assigned
                  owner, and priority level. Track prospects from initial
                  contact to deal closure with customizable pipeline stages that
                  match your unique sales process. No more confusion. Pure
                  clarity.
                </p>
              </div>
            </div>

            <div className="flex equal-space">
              <div className="col red" data-animate="true" data-delay="300">
                <div className="parallax-wrapper">
                  <div className="icon-container">
                    <img src="./img/card2.chart.svg" alt="" />
                  </div>
                  <div className="parallax-bg"></div>
                </div>
                <h5>
                  Never Miss a Follow-Up Again
                  <svg
                    className="title-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </h5>
                <p>
                  Automatic reminders ensure no deal slips through the cracks.
                  Set follow-up schedules, get timely notifications, and track
                  every customer interaction—emails, calls, meetings, and notes.
                  Our intelligent lead management CRM keeps your team
                  accountable and prospects engaged at every stage of the sales
                  cycle.
                </p>
              </div>

              <div
                className="col blue"
                data-animate="true"
                data-duration="650"
                data-delay="400"
              >
                <div className="parallax-wrapper">
                  <div className="icon-container">
                    <img src="./img/card4.chart.svg" alt="" />
                  </div>
                  <div className="parallax-bg"></div>
                </div>
                <h5>
                  Identify Bottlenecks in Your Sales Process
                  <svg
                    className="title-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </h5>
                <p>
                  Instantly recognize which deals need attention today. Spot
                  stalled opportunities, identify pipeline bottlenecks, and
                  understand where prospects are getting stuck. Use real-time
                  analytics to make data-driven decisions and accelerate your
                  sales cycle. Know exactly where to focus your effort for
                  maximum impact
                </p>
              </div>

              <div
                className="col red"
                data-animate="true"
                data-duration="700"
                data-delay="500"
              >
                <div className="parallax-wrapper">
                  <div className="icon-container">
                    <img src="./img/card5.chart.svg" alt="" />
                  </div>
                  <div className="parallax-bg"></div>
                </div>
                <h5>
                  Close Deals with Data-Driven Confidence
                  <svg
                    className="title-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </h5>
                <p>
                  Stop guessing. Know your win probability at every stage. Our
                  lead management CRM provides actionable insights to help you
                  focus on high-probability opportunities and move deals forward
                  strategically. Close more deals, faster, with less wasted
                  effort on prospects that won't convert.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features reviews">
        <div className="container">
          <div className="content text-center">
            <h6 className="badge">Reviews</h6>
            <h3>Not just another CRM</h3>
            <p>
              Real teams. Real results. Short, honest reviews from people who
              actually use it.
            </p>
          </div>
          <div>
            <article className="featured">
              <div className="card top" data-animate="true" data-delay="100">
                <div className="flex">
                  <img src="/img/user-dummy.png" alt="User avatar" />
                  <h4>
                    Tushar Dutta
                    <span>Software Architect</span>
                    <ul aria-label="Rating">
                      <li>⭐</li>
                      <li>⭐</li>
                      <li>⭐</li>
                      <li>⭐</li>
                      <li>⭐</li>
                    </ul>
                  </h4>
                </div>
                <p>
                  We replaced scattered sheets with one pipeline. Follow-ups
                  stopped slipping, and deals closed faster.
                </p>
                <button className="btn btn-primary" onClick={handleButtonClick}>
                  Read more
                </button>
              </div>
            </article>
          </div>

          <div className="horizontal-scroll-container">
            <div
              className="scroll-wrapper"
              id="scrollWrapper"
              ref={scrollWrapperRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsDown(false)}
              onMouseUp={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handlePointerUp}
            ></div>
          </div>

          <button
            className="btn btn-primary"
            data-animate="zoom-in"
            data-delay="150"
            onClick={handleButtonClick}
          >
            See More
          </button>
        </div>
      </section>
    </>
  );
}

export default Features;
