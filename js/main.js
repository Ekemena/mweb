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

// Back-to-top button
const toTop = document.getElementById("toTop");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 500);
});

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

contactForm.addEventListener("submit", async (e) => {
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();

  if (!name || !email) {
    e.preventDefault();
    formNote.style.color = "#f87171";
    formNote.textContent = "Please fill in your name and email.";
    return;
  }

  if (!isLocal) {
    formNote.style.color = "";
    formNote.textContent = "Sending your request...";
    return;
  }

  e.preventDefault();
  formNote.style.color = "";
  formNote.textContent = "Sending your request...";

  try {
    const formData = new FormData(contactForm);
    const response = await fetch("submit-quote.php", {
      method: "POST",
      body: formData
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Unable to send your request.");
    }

    formNote.style.color = "";
    formNote.textContent = data.message;
    contactForm.reset();
  } catch (error) {
    formNote.style.color = "#f87171";
    formNote.textContent = error.message || "Unable to send your request. Please try again.";
  }
});

// Newsletter form (front-end only demo)
const newsForm = document.getElementById("newsForm");
newsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  newsForm.reset();
  alert("Thanks for subscribing to the MWeb newsletter!");
});

// Current year in footer
document.getElementById("year").textContent = new Date().getFullYear();
