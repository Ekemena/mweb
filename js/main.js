// Mobile nav toggle
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
  const savedTheme = localStorage.getItem("mweb-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "🌙";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggle.textContent = isDark ? "🌙" : "☀️";
    localStorage.setItem("mweb-theme", isDark ? "dark" : "light");
  });
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  // Close mobile nav when a link is clicked
  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Back-to-top button
const toTop = document.getElementById("toTop");
if (toTop) {
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("show", window.scrollY > 500);
  });
}

// Reveal-on-scroll animations
const revealTargets = document.querySelectorAll(
  ".section-head, .service-card, .work-card, .post-card, .about-body, .contact-form, .contact-info"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => observer.observe(el));

// Contact form submission
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();

    if (!name || !email) {
      e.preventDefault();
      if (formNote) {
        formNote.style.color = "#f87171";
        formNote.textContent = "Please fill in your name and email.";
      }
      return;
    }

    if (formNote) {
      formNote.style.color = "";
      formNote.textContent = "Sending your request...";
    }
  });
}

// Newsletter form (front-end only demo)
const newsForm = document.getElementById("newsForm");
if (newsForm) {
  newsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsForm.reset();
    alert("Thanks for subscribing to the MWeb newsletter!");
  });
}

// Current year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
