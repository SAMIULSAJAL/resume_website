document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  const year = document.querySelector("[data-year]");

  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const closeNav = () => {
    navToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    nav?.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) closeNav();
  });

  if (year) year.textContent = String(new Date().getFullYear());

  const contactForm = document.querySelector("[data-contact-form]");
  const timestamp = document.querySelector("[data-timestamp]");
  const formStatus = document.querySelector("[data-form-status]");

  const refreshTimestamp = () => {
    if (timestamp) timestamp.value = String(Date.now());
  };
  refreshTimestamp();

  contactForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");
    submitButton.disabled = true;
    if (formStatus) {
      formStatus.textContent = "Sending your message…";
      formStatus.className = "form-status";
    }

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm)
      });
      const result = await response.text();
      const wasAccepted = response.ok && result.includes("Message received successfully!");

      if (!wasAccepted) throw new Error(result || "Message could not be sent.");
      contactForm.reset();
      refreshTimestamp();
      if (formStatus) {
        formStatus.textContent = "Thank you—your message was sent successfully.";
        formStatus.classList.add("is-success");
      }
    } catch (error) {
      if (formStatus) {
        formStatus.textContent = "The form could not send right now. Please email me directly instead.";
        formStatus.classList.add("is-error");
      }
    } finally {
      submitButton.disabled = false;
    }
  });

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("is-visible"));
  }
});
