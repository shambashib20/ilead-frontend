/**
 * Optimized Combined Scripts
 * Combines all JavaScript functionality from the page into one optimized file
 */

(function () {
  "use strict";

  // ============================================
  // 1. Configuration & Utilities
  // ============================================
  const CONFIG = {
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
    animation: {
      defaultDuration: 700,
      defaultEase: "cubic-bezier(0.22,1,0.36,1)",
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    },
    slider: {
      breakpoints: {
        desktop: 1200,
        tablet: 768,
      },
      slidesPerView: {
        desktop: 6,
        tablet: 3,
        mobile: 1,
      },
      autoSlideInterval: 5000,
    },
  };

  // Utility functions
  const utils = {
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    throttle(func, limit) {
      let inThrottle;
      return function (...args) {
        if (!inThrottle) {
          func.apply(this, args);
          inThrottle = true;
          setTimeout(() => (inThrottle = false), limit);
        }
      };
    },

    parseTime(v, fallbackMs) {
      if (!v) return fallbackMs;
      if (typeof v === "number") return v;
      const s = String(v).trim().toLowerCase();
      if (s.endsWith("ms")) return parseFloat(s);
      if (s.endsWith("s")) return parseFloat(s) * 1000;
      const n = parseFloat(s);
      return isNaN(n) ? fallbackMs : n;
    },

    createRipple(e, element) {
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
    },

    addCSS(styles) {
      const style = document.createElement("style");
      style.textContent = styles;
      document.head.appendChild(style);
    },
  };

  // Add ripple animation CSS
  utils.addCSS(`
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `);

  // ============================================
  // 2. Solar System Connection Lines
  // ============================================
  class SolarSystem {
    constructor() {
      this.system = document.querySelector(".solar-system");
      this.centerLogo = document.querySelector(".center-logo");
      this.planets = document.querySelectorAll(".tech-planet");
      this.connectionLines = document.getElementById("connectionLines");
      this.init();
    }

    updateConnectionLines() {
      this.connectionLines.innerHTML = "";
      const sysRect = this.system.getBoundingClientRect();
      const cRect = this.centerLogo.getBoundingClientRect();
      const cX = cRect.left - sysRect.left + cRect.width / 2;
      const cY = cRect.top - sysRect.top + cRect.height / 2;

      this.planets.forEach((planet) => {
        const pRect = planet.getBoundingClientRect();
        const pX = pRect.left - sysRect.left + pRect.width / 2;
        const pY = pRect.top - sysRect.top + pRect.height / 2;

        const dx = pX - cX;
        const dy = pY - cY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        const line = document.createElement("div");
        line.className = "connection-line";
        line.style.width = dist + "px";
        line.style.left = cX + "px";
        line.style.top = cY + "px";
        line.style.transform = "rotate(" + angle + "deg)";
        this.connectionLines.appendChild(line);
      });
    }

    tick() {
      this.updateConnectionLines();
      requestAnimationFrame(() => this.tick());
    }

    init() {
      if (!this.system || !this.centerLogo) return;
      this.tick();
      window.addEventListener(
        "resize",
        utils.debounce(() => this.updateConnectionLines(), 100)
      );
    }
  }

  // ============================================
  // 3. Logo Slider
  // ============================================
  class LogoSlider {
    constructor() {
      this.wrapper = document.getElementById("logosWrapper");
      this.dotsContainer = document.getElementById("dotsContainer");
      this.prevBtn = document.getElementById("prevBtn");
      this.nextBtn = document.getElementById("nextBtn");
      this.slides = this.wrapper
        ? this.wrapper.querySelectorAll(".logo-slide")
        : [];
      this.totalSlides = this.slides.length;
      this.currentIndex = 0;
      this.slidesPerView = 6;
      this.autoSlideInterval = null;
      this.init();
    }

    getSlideCount() {
      if (window.innerWidth >= CONFIG.slider.breakpoints.desktop) {
        return CONFIG.slider.slidesPerView.desktop;
      } else if (window.innerWidth >= CONFIG.slider.breakpoints.tablet) {
        return CONFIG.slider.slidesPerView.tablet;
      } else {
        return CONFIG.slider.slidesPerView.mobile;
      }
    }

    initDots() {
      if (!this.dotsContainer) return;

      this.dotsContainer.innerHTML = "";
      const maxDots = this.totalSlides - this.slidesPerView + 1;

      for (let i = 0; i < maxDots; i++) {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => this.goToSlide(i));
        this.dotsContainer.appendChild(dot);
      }
    }

    updateSlider() {
      if (!this.wrapper) return;

      this.wrapper.style.transform = `translateX(${-this.currentIndex * (100 / this.slidesPerView)}%)`;

      document.querySelectorAll(".dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === this.currentIndex);
      });
    }

    nextSlide() {
      this.currentIndex++;
      if (this.currentIndex > this.totalSlides - this.slidesPerView) {
        this.currentIndex = 0;
      }
      this.updateSlider();
      this.resetAutoSlide();
    }

    prevSlide() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.totalSlides - this.slidesPerView;
      }
      this.updateSlider();
      this.resetAutoSlide();
    }

    goToSlide(index) {
      this.currentIndex = index;
      this.updateSlider();
      this.resetAutoSlide();
    }

    autoSlide() {
      if (this.currentIndex < this.totalSlides - this.slidesPerView) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.updateSlider();
    }

    resetAutoSlide() {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = setInterval(
        () => this.autoSlide(),
        CONFIG.slider.autoSlideInterval
      );
    }

    init() {
      if (this.totalSlides === 0) return;

      this.slidesPerView = this.getSlideCount();

      if (this.nextBtn)
        this.nextBtn.addEventListener("click", () => this.nextSlide());
      if (this.prevBtn)
        this.prevBtn.addEventListener("click", () => this.prevSlide());

      this.initDots();
      this.updateSlider();
      this.resetAutoSlide();

      window.addEventListener(
        "resize",
        utils.debounce(() => {
          this.slidesPerView = this.getSlideCount();
          this.initDots();
          this.updateSlider();
        }, 250)
      );
    }
  }

  // ============================================
  // 4. Reviews Carousel
  // ============================================
  class ReviewsCarousel {
    constructor() {
      this.scrollWrapper = document.getElementById("scrollWrapper");
      this.isDown = false;
      this.startX = 0;
      this.scrollLeft = 0;
      this.init();
    }

    createReviewCard(review) {
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
    }

    populateReviews() {
      if (!this.scrollWrapper) return;

      let cardsHTML = "";
      for (let i = 0; i < 3; i++) {
        CONFIG.reviewData.forEach((review) => {
          cardsHTML += this.createReviewCard(review);
        });
      }

      this.scrollWrapper.innerHTML = cardsHTML;
    }

    setupEventListeners() {
      if (!this.scrollWrapper) return;

      // Mouse events
      this.scrollWrapper.addEventListener("mousedown", (e) => {
        this.isDown = true;
        this.scrollWrapper.style.animationPlayState = "paused";
        this.startX = e.pageX - this.scrollWrapper.offsetLeft;
        this.scrollLeft = this.scrollWrapper.scrollLeft;
      });

      this.scrollWrapper.addEventListener("mouseleave", () => {
        this.isDown = false;
      });

      this.scrollWrapper.addEventListener("mouseup", () => {
        this.isDown = false;
        setTimeout(() => {
          this.scrollWrapper.style.animationPlayState = "running";
        }, 3000);
      });

      this.scrollWrapper.addEventListener("mousemove", (e) => {
        if (!this.isDown) return;
        e.preventDefault();
        const x = e.pageX - this.scrollWrapper.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.scrollWrapper.scrollLeft = this.scrollLeft - walk;
      });

      // Touch events
      this.scrollWrapper.addEventListener("touchstart", (e) => {
        this.isDown = true;
        this.scrollWrapper.style.animationPlayState = "paused";
        this.startX = e.touches[0].pageX - this.scrollWrapper.offsetLeft;
        this.scrollLeft = this.scrollWrapper.scrollLeft;
      });

      this.scrollWrapper.addEventListener("touchend", () => {
        this.isDown = false;
        setTimeout(() => {
          this.scrollWrapper.style.animationPlayState = "running";
        }, 3000);
      });

      this.scrollWrapper.addEventListener("touchmove", (e) => {
        if (!this.isDown) return;
        const x = e.touches[0].pageX - this.scrollWrapper.offsetLeft;
        const walk = (x - this.startX) * 2;
        this.scrollWrapper.scrollLeft = this.scrollLeft - walk;
      });
    }

    init() {
      if (!this.scrollWrapper) return;
      this.populateReviews();
      this.setupEventListeners();
    }
  }

  // ============================================
  // 5. Animate on Scroll
  // ============================================
  class AnimateOnScroll {
    constructor() {
      this.els = [...document.querySelectorAll("[data-animate]")];
      this.io = null;
      this.init();
    }

    getStaggerDelay(el) {
      const parent = el.closest("[data-stagger]");
      if (!parent) return 0;

      const items = [...parent.querySelectorAll(":scope [data-animate]")];
      const index = items.indexOf(el);
      const base = parseInt(parent.getAttribute("data-stagger") || "100", 10);

      return Math.max(0, base * Math.max(0, index));
    }

    init() {
      if (this.els.length === 0) return;

      const rootStyles = getComputedStyle(document.documentElement);
      const defaultDur = utils.parseTime(
        rootStyles.getPropertyValue("--anim-duration"),
        CONFIG.animation.defaultDuration
      );
      const defaultEase =
        rootStyles.getPropertyValue("--anim-ease") ||
        CONFIG.animation.defaultEase;

      this.io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const el = entry.target;
            const once = (el.getAttribute("data-once") ?? "true") !== "false";

            if (entry.isIntersecting) {
              const dur = utils.parseTime(
                el.getAttribute("data-duration"),
                defaultDur
              );
              const delaySelf = utils.parseTime(
                el.getAttribute("data-delay"),
                0
              );
              const delay = delaySelf + this.getStaggerDelay(el);
              const ease = el.getAttribute("data-easing") || defaultEase;

              el.style.transitionDuration = `${dur}ms`;
              el.style.transitionTimingFunction = ease;
              el.style.transitionDelay = `${delay}ms`;
              el.classList.add("is-inview");

              if (once) this.io.unobserve(el);
            } else {
              if ((el.getAttribute("data-once") ?? "true") === "false") {
                el.classList.remove("is-inview");
                el.style.transitionDelay = "0ms";
              }
            }
          });
        },
        {
          threshold: CONFIG.animation.threshold,
          rootMargin: CONFIG.animation.rootMargin,
        }
      );

      this.els.forEach((el) => this.io.observe(el));
    }
  }

  // ============================================
  // 6. Accordion
  // ============================================
  class Accordion {
    constructor() {
      this.accordions = document.querySelectorAll(".accord");
      this.init();
    }

    init() {
      if (this.accordions.length === 0) return;

      // Initialize first accordion as open
      this.accordions[0]?.classList.add("active");

      this.accordions.forEach((accordion) => {
        const header = accordion.querySelector("h3");

        header?.addEventListener("click", () => {
          // Close all other accordions
          this.accordions.forEach((otherAccordion) => {
            if (otherAccordion !== accordion) {
              otherAccordion.classList.remove("active");
            }
          });

          // Toggle current accordion
          accordion.classList.toggle("active");
        });
      });
    }
  }

  // ============================================
  // 7. Floating Actions
  // ============================================
  class FloatingActions {
    constructor() {
      this.container = document.getElementById("floating-actions");
      this.scrollTopBtn = null;
      this.callBtn = null;
      this.waBtn = null;
      this.progressCircle = null;
      this.init();
    }

    createStyles() {
      utils.addCSS(`
                #floating-actions {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .float-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 24px;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    user-select: none;
                    position: relative;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15),
                                0 5px 15px rgba(0, 0, 0, 0.1);
                }

                .float-btn::before {
                    content: '';
                    position: absolute;
                    inset: -2px;
                    border-radius: 50%;
                    background: inherit;
                    filter: blur(8px);
                    opacity: 0.3;
                    z-index: -1;
                    transition: opacity 0.3s ease;
                }

                .float-btn:hover {
                    transform: translateY(-5px) scale(1.1);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25),
                                0 8px 20px rgba(0, 0, 0, 0.15);
                }

                .float-btn:hover::before {
                    opacity: 0.5;
                }

                .scroll-top {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    display: none;
                    position: relative;
                }

                .call-btn {
                    background: linear-gradient(135deg, #0a66ff 0%, #0552d5 100%);
                    animation: pulse-call 2s infinite;
                }

                .wa-btn {
                    background: linear-gradient(135deg, #25D366 0%, #1da851 100%);
                    animation: pulse-wa 2s infinite 0.5s;
                }

                .progress-ring {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    width: 64px;
                    height: 64px;
                    transform: rotate(-90deg);
                    pointer-events: none;
                }

                .progress-ring__circle {
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke: rgba(255, 255, 255, 0.3);
                }

                .progress-ring__progress {
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke: #fff;
                    stroke-dasharray: 188;
                    stroke-dashoffset: 188;
                    transition: stroke-dashoffset 0.3s ease;
                }

                .btn-icon {
                    width: 28px;
                    height: 28px;
                    position: relative;
                    z-index: 1;
                }

                .btn-icon svg {
                    width: 100%;
                    height: 100%;
                    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
                }

                .float-btn .tooltip-text {
                    position: absolute;
                    right: 70px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: none;
                    z-index: 10000;
                }

                .float-btn:hover .tooltip-text {
                    opacity: 1;
                    visibility: visible;
                    right: 74px;
                }

                @keyframes pulse-call {
                    0%, 100% {
                        box-shadow: 0 10px 25px rgba(10, 102, 255, 0.3),
                                    0 5px 15px rgba(10, 102, 255, 0.2),
                                    0 0 0 0 rgba(10, 102, 255, 0.4);
                    }
                    50% {
                        box-shadow: 0 10px 25px rgba(10, 102, 255, 0.4),
                                    0 5px 15px rgba(10, 102, 255, 0.3),
                                    0 0 0 10px rgba(10, 102, 255, 0);
                    }
                }

                @keyframes pulse-wa {
                    0%, 100% {
                        box-shadow: 0 10px 25px rgba(37, 211, 102, 0.3),
                                    0 5px 15px rgba(37, 211, 102, 0.2),
                                    0 0 0 0 rgba(37, 211, 102, 0.4);
                    }
                    50% {
                        box-shadow: 0 10px 25px rgba(37, 211, 102, 0.4),
                                    0 5px 15px rgba(37, 211, 102, 0.3),
                                    0 0 0 10px rgba(37, 211, 102, 0);
                    }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }

                .float-btn {
                    animation: float 3s ease-in-out infinite;
                }

                .call-btn { animation-delay: 0.2s; }
                .wa-btn { animation-delay: 0.4s; }

                @media (max-width: 768px) {
                    #floating-actions {
                        right: 15px;
                        bottom: 15px;
                    }
                    
                    .float-btn {
                        width: 55px;
                        height: 55px;
                    }
                    
                    .progress-ring {
                        width: 59px;
                        height: 59px;
                    }
                    
                    .btn-icon {
                        width: 26px;
                        height: 26px;
                    }
                    
                    .float-btn .tooltip-text {
                        display: none;
                    }
                }
            `);
    }

    createScrollTopBtn() {
      const btn = document.createElement("div");
      btn.className = "float-btn scroll-top";
      btn.setAttribute("data-tooltip", "Scroll to top");

      btn.innerHTML = `
                <svg class="progress-ring" viewBox="0 0 64 64">
                    <circle class="progress-ring__circle" cx="32" cy="32" r="30"/>
                    <circle class="progress-ring__progress" cx="32" cy="32" r="30"/>
                </svg>
                <div class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
                    </svg>
                </div>
                <div class="tooltip-text">Scroll to top</div>
            `;

      return btn;
    }

    createCallBtn() {
      const btn = document.createElement("div");
      btn.className = "float-btn call-btn";
      btn.setAttribute("data-tooltip", "Call us");

      btn.innerHTML = `
                <div class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.55-.45-1-1-1H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.55-.45-1-1-1z"/>
                    </svg>
                </div>
                <div class="tooltip-text">Call us</div>
            `;

      return btn;
    }

    createWhatsAppBtn() {
      const btn = document.createElement("div");
      btn.className = "float-btn wa-btn";
      btn.setAttribute("data-tooltip", "WhatsApp us");

      btn.innerHTML = `
                <div class="btn-icon">
                    <svg viewBox="0 0 24 24" fill="white">
                        <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z"/>
                    </svg>
                </div>
                <div class="tooltip-text">WhatsApp us</div>
            `;

      return btn;
    }

    setupProgressCircle() {
      if (!this.progressCircle) return;

      const circleRadius = 30;
      const circumference = 2 * Math.PI * circleRadius;

      this.progressCircle.style.strokeDasharray = circumference;
      this.progressCircle.style.strokeDashoffset = circumference;

      window.addEventListener(
        "scroll",
        utils.throttle(() => {
          const windowHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const scrolled = (window.scrollY / windowHeight) * 100;
          const progress = Math.min(scrolled, 100);

          this.scrollTopBtn.style.display =
            window.scrollY > 300 ? "flex" : "none";

          if (this.progressCircle) {
            const offset = circumference - (progress / 100) * circumference;
            this.progressCircle.style.strokeDashoffset = offset;
          }
        }, 100)
      );
    }

    setupEventListeners() {
      // Scroll to top
      this.scrollTopBtn.addEventListener("click", (e) => {
        utils.createRipple(e, this.scrollTopBtn);
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      // Call button
      this.callBtn.addEventListener("click", (e) => {
        utils.createRipple(e, this.callBtn);
        window.location.href = "tel:+919999999999"; // Replace with actual number
      });

      // WhatsApp button
      this.waBtn.addEventListener("click", (e) => {
        utils.createRipple(e, this.waBtn);
        window.open("https://wa.me/9199999999999", "_blank");
      });
    }

    init() {
      if (!this.container) return;

      this.createStyles();

      // Create buttons
      this.scrollTopBtn = this.createScrollTopBtn();
      this.callBtn = this.createCallBtn();
      this.waBtn = this.createWhatsAppBtn();

      // Add to container
      this.container.appendChild(this.scrollTopBtn);
      this.container.appendChild(this.callBtn);
      this.container.appendChild(this.waBtn);

      // Get progress circle element
      this.progressCircle = this.scrollTopBtn.querySelector(
        ".progress-ring__progress"
      );

      // Setup
      this.setupProgressCircle();
      this.setupEventListeners();
    }
  }

  // ============================================
  // 8. Modal
  // ============================================
  class Modal {
    constructor() {
      this.openBtn = document.getElementById("openModalBtn");
      this.overlay = document.getElementById("modalOverlay");
      this.closeBtn = document.getElementById("modalCloseBtn");
      this.form = document.getElementById("demoForm");
      this.init();
    }

    openModal() {
      if (this.overlay) this.overlay.classList.add("is-open");
    }

    closeModal() {
      if (this.overlay) this.overlay.classList.remove("is-open");
    }

    init() {
      if (!this.overlay) return;

      if (this.openBtn)
        this.openBtn.addEventListener("click", () => this.openModal());
      if (this.closeBtn)
        this.closeBtn.addEventListener("click", () => this.closeModal());

      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.closeModal();
      });

      if (this.form) {
        this.form.addEventListener("submit", (e) => {
          e.preventDefault();
          // Add your API call logic here
          alert("Form submitted (demo). Add your logic here.");
          this.closeModal();
        });
      }

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeModal();
      });
    }
  }

  // ============================================
  // 9. Main Initialization
  // ============================================


  class MobileSidebar {
    constructor() {
      this.sidebar = document.getElementById("mobileSidebar");
      this.overlay = document.getElementById("mobileOverlay");
      this.menuToggle = document.getElementById("mobileMenuToggle");
      this.sidebarClose = document.getElementById("sidebarClose");
      this.mobileGetStarted = document.getElementById("mobileOpenModalBtn");
      this.init();
    }

    openSidebar() {
      this.sidebar?.classList.add("active");
      this.overlay?.classList.add("active");
      document.body.classList.add("mobile-menu-open");
      document.addEventListener("keydown", this.handleEscapeKey.bind(this));
    }

    closeSidebar() {
      this.sidebar?.classList.remove("active");
      this.overlay?.classList.remove("active");
      document.body.classList.remove("mobile-menu-open");
      document.removeEventListener("keydown", this.handleEscapeKey.bind(this));
    }

    handleEscapeKey(e) {
      if (e.key === "Escape") this.closeSidebar();
    }

    handleOverlayClick(e) {
      if (e.target === this.overlay) this.closeSidebar();
    }

    handleMobileGetStarted() {
      this.closeSidebar();
      setTimeout(() => {
        document.getElementById("openModalBtn")?.click();
      }, 300);
    }

    init() {
      if (!this.menuToggle || !this.sidebar) return;

      this.menuToggle.addEventListener("click", () => this.openSidebar());
      this.sidebarClose?.addEventListener("click", () => this.closeSidebar());
      this.overlay?.addEventListener("click", (e) =>
        this.handleOverlayClick(e)
      );
      this.mobileGetStarted?.addEventListener("click", () =>
        this.handleMobileGetStarted()
      );

      this.sidebar?.querySelectorAll(".mobile-nav a").forEach((link) => {
        link.addEventListener("click", () =>
          setTimeout(() => this.closeSidebar(), 300)
        );
      });

      window.addEventListener("resize", () => {
        if (
          window.innerWidth > 768 &&
          this.sidebar?.classList.contains("active")
        ) {
          this.closeSidebar();
        }
      });
    }
  }


  class MainApp {
    constructor() {
      this.modules = [];
      this.init();
    }

    initModules() {
      this.modules = [
        new SolarSystem(),
        new LogoSlider(),
        new ReviewsCarousel(),
        new AnimateOnScroll(),
        new Accordion(),
        new FloatingActions(),
        new Modal(),
        new MobileSidebar(),
      ];
    }

    init() {
      document.addEventListener("DOMContentLoaded", () => {
        this.initModules();
        console.log("All modules initialized successfully");
      });
    }
  }

  // Initialize the application
  new MainApp();
})();
