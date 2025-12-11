document.addEventListener("DOMContentLoaded", function () {
  const system = document.querySelector(".solar-system");
  const centerLogo = document.querySelector(".center-logo");
  const planets = document.querySelectorAll(".tech-planet");
  const connectionLines = document.getElementById("connectionLines");

  function updateConnectionLines() {
    // clear old
    connectionLines.innerHTML = "";

    // system-relative rects to keep lines glued on scroll/resize
    const sysRect = system.getBoundingClientRect();
    const cRect = centerLogo.getBoundingClientRect();
    const cX = cRect.left - sysRect.left + cRect.width / 2;
    const cY = cRect.top - sysRect.top + cRect.height / 2;

    planets.forEach((planet) => {
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
      connectionLines.appendChild(line);
    });
  }

  // animation loop
  function tick() {
    updateConnectionLines();
    requestAnimationFrame(tick);
  }
  tick();

  // also on resize for safety
  window.addEventListener("resize", updateConnectionLines);
});

const wrapper = document.getElementById("logosWrapper");
const dotsContainer = document.getElementById("dotsContainer");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const slides = wrapper.querySelectorAll(".logo-slide");
const totalSlides = slides.length;
let slidesPerView = 6;
let currentIndex = 0;
let autoSlideInterval;

function getSlideCount() {
  if (window.innerWidth >= 1200) {
    return 6;
  } else if (window.innerWidth >= 768) {
    return 3;
  } else {
    return 1;
  }
}

window.addEventListener("resize", () => {
  slidesPerView = getSlideCount();
  updateSlider();
});

function initDots() {
  for (let i = 0; i < totalSlides - slidesPerView + 1; i++) {
    const dot = document.createElement("button");
    dot.classList.add("dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }
}

function updateSlider() {
  wrapper.style.transform = `translateX(${
    -currentIndex * (100 / slidesPerView)
  }%)`;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentIndex);
  });
}

function nextSlide() {
  currentIndex++;
  if (currentIndex > totalSlides - slidesPerView) {
    currentIndex = 0;
  }
  updateSlider();
  resetAutoSlide();
}

function prevSlide() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = totalSlides - slidesPerView;
  }
  updateSlider();
  resetAutoSlide();
}

function goToSlide(index) {
  currentIndex = index;
  updateSlider();
  resetAutoSlide();
}

function autoSlide() {
  if (currentIndex < totalSlides - slidesPerView) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSlider();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(autoSlide, 5000);
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

initDots();
slidesPerView = getSlideCount();
updateSlider();
resetAutoSlide();

document.addEventListener("DOMContentLoaded", function () {
  const scrollWrapper = document.getElementById("scrollWrapper");

  // Sample review data - in a real app, this would come from an API
  const reviewData = [
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
  ];

  // Function to create a review card
  function createReviewCard(review) {
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
                        <!-- <button class="btn btn-primary">Read more</button> -->
                    </div>
                `;
  }

  // Populate the scroll wrapper with cards (duplicated for seamless loop)
  let cardsHTML = "";

  // Add multiple copies to create a seamless loop
  for (let i = 0; i < 3; i++) {
    reviewData.forEach((review) => {
      cardsHTML += createReviewCard(review);
    });
  }

  scrollWrapper.innerHTML = cardsHTML;

  // Manual scroll functionality for touch devices
  let isDown = false;
  let startX;
  let scrollLeft;

  scrollWrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    scrollWrapper.style.animationPlayState = "paused";
    startX = e.pageX - scrollWrapper.offsetLeft;
    scrollLeft = scrollWrapper.scrollLeft;
  });

  scrollWrapper.addEventListener("mouseleave", () => {
    isDown = false;
  });

  scrollWrapper.addEventListener("mouseup", () => {
    isDown = false;
    // Resume animation after a delay
    setTimeout(() => {
      scrollWrapper.style.animationPlayState = "running";
    }, 3000);
  });

  scrollWrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollWrapper.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollWrapper.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  scrollWrapper.addEventListener("touchstart", (e) => {
    isDown = true;
    scrollWrapper.style.animationPlayState = "paused";
    startX = e.touches[0].pageX - scrollWrapper.offsetLeft;
    scrollLeft = scrollWrapper.scrollLeft;
  });

  scrollWrapper.addEventListener("touchend", () => {
    isDown = false;
    // Resume animation after a delay
    setTimeout(() => {
      scrollWrapper.style.animationPlayState = "running";
    }, 3000);
  });

  scrollWrapper.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - scrollWrapper.offsetLeft;
    const walk = (x - startX) * 2;
    scrollWrapper.scrollLeft = scrollLeft - walk;
  });
});

(() => {
  const els = [...document.querySelectorAll("[data-animate]")];

  const parseTime = (v, fallbackMs) => {
    if (!v) return fallbackMs;
    if (typeof v === "number") return v;
    const s = String(v).trim().toLowerCase();
    if (s.endsWith("ms")) return parseFloat(s);
    if (s.endsWith("s")) return parseFloat(s) * 1000;
    const n = parseFloat(s);
    return isNaN(n) ? fallbackMs : n; // treat bare numbers as ms
  };

  const getStaggerDelay = (el) => {
    const parent = el.closest("[data-stagger]");
    if (!parent) return 0;
    // Stagger applies only among siblings inside that parent
    const items = [...parent.querySelectorAll(":scope [data-animate]")];
    const index = items.indexOf(el);
    const base = parseInt(parent.getAttribute("data-stagger") || "100", 10);
    return Math.max(0, base * Math.max(0, index));
  };

  const rootStyles = getComputedStyle(document.documentElement);
  const defaultDur = parseTime(
    rootStyles.getPropertyValue("--anim-duration"),
    700
  );
  const defaultEase =
    rootStyles.getPropertyValue("--anim-ease") || "cubic-bezier(0.22,1,0.36,1)";

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const once = (el.getAttribute("data-once") ?? "true") !== "false";

        if (entry.isIntersecting) {
          const dur = parseTime(el.getAttribute("data-duration"), defaultDur);
          const delaySelf = parseTime(el.getAttribute("data-delay"), 0);
          const delay = delaySelf + getStaggerDelay(el);
          const ease = el.getAttribute("data-easing") || defaultEase;

          el.style.transitionDuration = `${dur}ms`;
          el.style.transitionTimingFunction = ease;
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-inview");

          if (once) io.unobserve(el);
        } else {
          if ((el.getAttribute("data-once") ?? "true") === "false") {
            el.classList.remove("is-inview");
            el.style.transitionDelay = "0ms";
          }
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );

  els.forEach((el) => io.observe(el));
})();

document.addEventListener("DOMContentLoaded", function () {
  const accordions = document.querySelectorAll(".accord");

  // Initialize first accordion as open
  if (accordions.length > 0) {
    accordions[0].classList.add("active");
  }

  accordions.forEach((accordion) => {
    const header = accordion.querySelector("h3");

    header.addEventListener("click", function () {
      // Close all other accordions
      accordions.forEach((otherAccordion) => {
        if (otherAccordion !== accordion) {
          otherAccordion.classList.remove("active");
        }
      });

      // Toggle current accordion
      accordion.classList.toggle("active");
    });
  });
});

(function () {
  const style = document.createElement("style");
  style.innerHTML = `
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

    /* Progress circle for scroll-to-top */
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

    /* Icon styles */
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

    /* Tooltip */
    .float-btn::after {
      content: attr(data-tooltip);
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

    .float-btn::after {
      content: '';
      border: 6px solid transparent;
      border-left-color: rgba(0, 0, 0, 0.8);
      position: absolute;
      right: 64px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
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

    /* Animations */
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

    /* Floating animation */
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }

    .float-btn {
      animation: float 3s ease-in-out infinite;
    }

    .call-btn {
      animation-delay: 0.2s;
    }

    .wa-btn {
      animation-delay: 0.4s;
    }

    /* Responsive */
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
  `;
  document.head.appendChild(style);

  const container = document.getElementById("floating-actions");

  // Create scroll-to-top button with progress ring
  const scrollTopBtn = document.createElement("div");
  scrollTopBtn.className = "float-btn scroll-top";
  scrollTopBtn.setAttribute("data-tooltip", "Scroll to top");

  // Create SVG icons
  const scrollTopContent = `
    <svg class="progress-ring" viewBox="0 0 64 64">
      <circle class="progress-ring__circle" cx="32" cy="32" r="30"/>
      <circle class="progress-ring__progress" cx="32" cy="32" r="30"/>
    </svg>
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="white">
        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
      </svg>
    </div>
  `;

  scrollTopBtn.innerHTML = scrollTopContent;

  // Create call button
  const callBtn = document.createElement("div");
  callBtn.className = "float-btn call-btn";
  callBtn.setAttribute("data-tooltip", "Call us");
  callBtn.innerHTML = `
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="white">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.55-.45-1-1-1H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.55-.45-1-1-1z"/>
      </svg>
    </div>
    <div class="tooltip-text">Call us</div>
  `;

  // Create WhatsApp button
  const waBtn = document.createElement("div");
  waBtn.className = "float-btn wa-btn";
  waBtn.setAttribute("data-tooltip", "WhatsApp us");
  waBtn.innerHTML = `
    <div class="btn-icon">
      <svg viewBox="0 0 24 24" fill="white">
        <path d="M16.75 13.96c.25.13.41.2.46.3.06.11.04.61-.21 1.18-.2.56-1.24 1.1-1.7 1.12-.46.02-.47.36-2.96-.73-2.49-1.09-3.99-3.75-4.11-3.92-.12-.17-.96-1.38-.92-2.61.05-1.22.69-1.8.95-2.04.24-.26.51-.29.68-.26h.47c.15 0 .36-.06.55.45l.69 1.87c.06.13.1.28.01.44l-.27.41-.39.42c-.12.12-.26.25-.12.5.12.26.62 1.09 1.32 1.78.91.88 1.71 1.17 1.95 1.3.24.14.39.12.54-.04l.81-.94c.19-.25.35-.19.58-.11l1.67.88M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10c-1.97 0-3.8-.57-5.35-1.55L2 22l1.55-4.65A9.969 9.969 0 0 1 2 12 10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8c0 1.72.54 3.31 1.46 4.61L4.5 19.5l2.89-.96A7.95 7.95 0 0 0 12 20a8 8 0 0 0 8-8 8 8 0 0 0-8-8z"/>
      </svg>
    </div>
    <div class="tooltip-text">WhatsApp us</div>
  `;

  // Add buttons to container
  container.appendChild(scrollTopBtn);
  container.appendChild(callBtn);
  container.appendChild(waBtn);

  // Get progress circle
  const progressCircle = scrollTopBtn.querySelector(".progress-ring__progress");
  const circleRadius = 30;
  const circumference = 2 * Math.PI * circleRadius;

  // Initialize progress circle
  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = circumference;

  // Scroll handler with progress
  window.addEventListener("scroll", () => {
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    const progress = Math.min(scrolled, 100);

    // Show/hide button
    scrollTopBtn.style.display = window.scrollY > 300 ? "flex" : "none";

    // Update progress circle
    if (progressCircle) {
      const offset = circumference - (progress / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }
  });

  // Scroll to top with smooth animation
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Call button click
  callBtn.addEventListener("click", () => {
    window.location.href = "tel:+919999999999"; // Replace with actual number
  });

  // WhatsApp button click
  waBtn.addEventListener("click", () => {
    window.open("https://wa.me/9199999999999", "_blank");
  });

  // Add micro-interaction for clicks
  document.querySelectorAll(".float-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // Create ripple effect
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
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
      `;

      this.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Add ripple animation to styles
  const rippleStyle = document.createElement("style");
  rippleStyle.innerHTML = `
    @keyframes ripple-animation {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(rippleStyle);
})();

const openBtn = document.getElementById("openModalBtn");
const overlay = document.getElementById("modalOverlay");
const closeBtn = document.getElementById("modalCloseBtn");
const form = document.getElementById("demoForm");

function openModal() {
  overlay.classList.add("is-open");
}

function closeModal() {
  overlay.classList.remove("is-open");
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

overlay.addEventListener("click", function (e) {
  if (e.target === overlay) {
    closeModal();
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  // yahan pe API call / fetch wagaira laga sakta hai
  alert("Form submitted (demo). Add your logic here.");
  closeModal();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal();
  }
});
