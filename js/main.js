/* ============================================================
   main.js
   General site behavior:
   - Highlight the active nav link (runs after navbar is injected)
   - Mobile nav toggle
   - Footer copyright year
   - Project filter buttons (projects.html only)
   - Contact form validation (contact.html only)
   ============================================================ */

document.addEventListener("includesLoaded", function () {
  setActiveNavLink();
  initNavToggle();
  setFooterYear();
});

// Run page-specific features as soon as the DOM is ready — these
// don't depend on the navbar/footer being loaded.
document.addEventListener("DOMContentLoaded", function () {
  initProjectFilters();
  initContactForm();
});

/**
 * Adds an "active" class to the nav link matching the current page.
 * Each page sets <body data-page="..."> and each nav link sets
 * data-page="..." to match against.
 */
function setActiveNavLink() {
  const currentPage = document.body.getAttribute("data-page");
  if (!currentPage) return;

  document.querySelectorAll(".main-nav .nav-list a").forEach(function (link) {
    if (link.getAttribute("data-page") === currentPage) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/** Wires up the hamburger button to show/hide the mobile nav menu. */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the mobile menu whenever a link is chosen
  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/** Fills in the current year in the footer copyright line. */
function setFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * Project filter bar (projects.html).
 * Each filter button has data-filter="all|homelab|networking|refurbishment|linux|security"
 * Each project card has data-category="homelab|networking|refurbishment|linux|security"
 */
function initProjectFilters() {
  const filterBar = document.querySelector(".filter-bar");
  if (!filterBar) return;

  const buttons = filterBar.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-grid .project-card");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach((b) => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");

      cards.forEach(function (card) {
        const matches = filter === "all" || card.getAttribute("data-category") === filter;
        card.hidden = !matches;
      });
    });
  });
}

/**
 * Contact form validation (contact.html).
 * This is front-end only: it checks the fields and shows a success
 * message, but does not actually send an email. To make it functional,
 * connect the fetch() call below to a form backend such as Formspree,
 * Netlify Forms, or your own server endpoint.
 */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const statusBox = document.getElementById("formStatus");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fields = {
      name: form.querySelector("#name"),
      email: form.querySelector("#email"),
      subject: form.querySelector("#subject"),
      message: form.querySelector("#message"),
    };

    let isValid = true;

    Object.values(fields).forEach((field) => clearFieldError(field));

    if (!fields.name.value.trim()) {
      showFieldError(fields.name, "Please enter your name.");
      isValid = false;
    }

    if (!fields.email.value.trim() || !isValidEmail(fields.email.value.trim())) {
      showFieldError(fields.email, "Please enter a valid email address.");
      isValid = false;
    }

    if (!fields.subject.value.trim()) {
      showFieldError(fields.subject, "Please add a subject.");
      isValid = false;
    }

    if (!fields.message.value.trim()) {
      showFieldError(fields.message, "Please write a short message.");
      isValid = false;
    }

    if (!isValid) {
      statusBox.className = "form-status";
      return;
    }

    // ---- Placeholder "send" step ----
    // Replace this block with a real fetch() to your form backend.
    statusBox.textContent =
      "Thanks, " + fields.name.value.trim().split(" ")[0] + "! Your message has been noted. " +
      "(This demo form doesn't send email yet — connect it to a backend like Formspree.)";
    statusBox.className = "form-status success visible";
    form.reset();
  });
}

function showFieldError(field, message) {
  const wrapper = field.closest(".form-field");
  if (!wrapper) return;
  wrapper.classList.add("has-error");
  const errorEl = wrapper.querySelector(".field-error");
  if (errorEl) errorEl.textContent = message;
}

function clearFieldError(field) {
  const wrapper = field.closest(".form-field");
  if (!wrapper) return;
  wrapper.classList.remove("has-error");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
