/* Warm Oven Studio — site interactions and form validation */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // --- Navigation Highlight ---
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-header .nav-link").forEach((link) => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });

    // --- Mobile Header Class ---
    const header = document.querySelector(".site-header");
    if (header && window.matchMedia("(max-width: 760px)").matches) {
        header.classList.add("mobile-header");
    }

    // --- Product Image Click-to-Enlarge Preview ---
    document.querySelectorAll(".product-image, .hero-image, .team-photo, .team-member-image").forEach((img) => {
        img.style.cursor = "zoom-in";
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", `View larger image: ${img.alt || "website image"}`);

        const openPreview = () => {
            const overlay = document.createElement("div");
            overlay.className = "image-preview";
            overlay.setAttribute("role", "dialog");
            overlay.setAttribute("aria-modal", "true");
            overlay.setAttribute("aria-label", img.alt || "Image preview");

            const largeImage = document.createElement("img");
            largeImage.src = img.src;
            largeImage.alt = img.alt || "Image preview";

            const closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "image-preview-close";
            closeButton.textContent = "Close";
            closeButton.setAttribute("aria-label", "Close image preview");

            overlay.append(largeImage, closeButton);
            document.body.appendChild(overlay);
            closeButton.focus();

            const closePreview = () => overlay.remove();
            closeButton.addEventListener("click", closePreview);
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) closePreview();
            });
            document.addEventListener("keydown", function onEscape(event) {
                if (event.key === "Escape") {
                    closePreview();
                    document.removeEventListener("keydown", onEscape);
                }
            });
        };

        img.addEventListener("click", openPreview);
        img.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openPreview();
            }
        });
    });

    // --- Reusable Validation Helpers ---
    const showError = (input, message) => {
        const error = document.getElementById(`${input.id}Error`);
        input.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) error.textContent = message;
        return !message;
    };

    const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    // South African local mobile/landline format: 10 digits beginning with 0.
    const validSouthAfricanPhone = (value) => /^0\d{9}$/.test(value.replace(/[\s()-]/g, ""));

    // --- Enquiry Form Validation ---
    const enquiryForm = document.getElementById("myForm");
    if (enquiryForm) {
        const fields = {
            fname: document.getElementById("fname"),
            lname: document.getElementById("lname"),
            email: document.getElementById("email"),
            pnumber: document.getElementById("pnumber")
        };
        const messages = document.getElementById("messages");

        // Improve input hints and browser validation.
        if (fields.email) {
            fields.email.type = "email";
            fields.email.autocomplete = "email";
        }
        if (fields.pnumber) {
            fields.pnumber.type = "tel";
            fields.pnumber.inputMode = "tel";
            fields.pnumber.placeholder = "e.g. 082 123 4567";
        }

        enquiryForm.addEventListener("submit", (event) => {
            let isValid = true;

            // Clear old errors & Name validation
            if (!fields.fname.value.trim()) {
                isValid = showError(fields.fname, "Please enter your first name.") && isValid;
            } else {
                showError(fields.fname, "");
            }

            if (!fields.lname.value.trim()) {
                isValid = showError(fields.lname, "Please enter your last name.") && isValid;
            } else {
                showError(fields.lname, "");
            }

            // Email validation: must contain "@" and "."
            if (!validEmail(fields.email.value.trim())) {
                isValid = showError(fields.email, "Please enter a valid email address.") && isValid;
            } else {
                showError(fields.email, "");
            }

            // Phone number validation: must be a valid phone number
            if (!validSouthAfricanPhone(fields.pnumber.value.trim())) {
                isValid = showError(fields.pnumber, "Enter a valid 10-digit South African number, e.g. 0821234567.") && isValid;
            } else {
                showError(fields.pnumber, "");
            }

            const messageField = document.getElementById("message");
            if (messageField && !messageField.value.trim()) {
                messageField.setCustomValidity("Please enter your enquiry details.");
                isValid = false;
            } else if (messageField) {
                messageField.setCustomValidity("");
            }

            if (!isValid) {
                event.preventDefault();
                if (messages) {
                    messages.classList.remove("success-message");
                    messages.textContent = "Please correct the highlighted fields and try again.";
                }
                const firstInvalid = enquiryForm.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // This is a front-end demo; no server is configured to send the enquiry.
            event.preventDefault();
            if (messages) {
                messages.classList.add("success-message");
                messages.textContent = "Thank you! Your enquiry form is valid. Connect this form to a server or form service to receive submissions.";
            }
            enquiryForm.reset();
            Object.values(fields).forEach((field) => showError(field, ""));
        });
    }

    // --- Contact Form Validation ---
    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = document.getElementById("name");
            const email = document.getElementById("contact-email");
            const subject = document.getElementById("subject");
            const message = document.getElementById("contact-message");
            let error = "";

            if (!name.value.trim()) error = "Please enter your name.";
            else if (!validEmail(email.value.trim())) error = "Please enter a valid email address.";
            else if (!subject.value.trim()) error = "Please enter a subject.";
            else if (!message.value.trim()) error = "Please enter your message.";

            let feedback = contactForm.querySelector(".contact-feedback");
            if (!feedback) {
                feedback = document.createElement("p");
                feedback.className = "contact-feedback";
                feedback.setAttribute("aria-live", "polite");
                contactForm.appendChild(feedback);
            }

            if (error) {
                feedback.classList.remove("success-message");
                feedback.textContent = error;
            } else {
                feedback.classList.add("success-message");
                feedback.textContent = "Thank you! Your message passed validation. Connect the form to a server or form service to receive it.";
                contactForm.reset();
            }
        });
    }

    // --- Decorative Scroll Progress Bar ---
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.style.width = `${percentage}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    // --- Back-to-Top Button ---
    const topButton = document.createElement("button");
    topButton.className = "back-to-top";
    topButton.type = "button";
    topButton.textContent = "↑";
    topButton.setAttribute("aria-label", "Back to top");
    topButton.title = "Back to top";
    document.body.appendChild(topButton);

    const updateTopButton = () => {
        topButton.classList.toggle("is-visible", window.scrollY > 360);
    };
    window.addEventListener("scroll", updateTopButton, { passive: true });
    updateTopButton();
    topButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // --- Reveal Content Cards on Scroll ---
    const revealItems = document.querySelectorAll(".content-card, .location-card");
    if ("IntersectionObserver" in window) {
        revealItems.forEach((item) => item.classList.add("reveal-on-scroll"));
        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    currentObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealItems.forEach((item) => observer.observe(item));
    }

    // --- Product Search Filter ---
    const productSearch = document.getElementById("productSearch");
    if (productSearch) {
        const categories = Array.from(document.querySelectorAll(".product-category"));
        const count = document.getElementById("productCount");

        const filterProducts = () => {
            const term = productSearch.value.trim().toLowerCase();
            let visible = 0;
            categories.forEach((category) => {
                const matches = category.textContent.toLowerCase().includes(term);
                category.hidden = !matches;
                if (matches) visible += 1;
            });
            if (count) {
                count.textContent = term
                    ? `${visible} ${visible === 1 ? "category" : "categories"} found`
                    : "Showing all categories";
            }
        };

        productSearch.addEventListener("input", filterProducts);
    }

    // --- Background Video Management ---
    const video = document.getElementById("bg-video");
    if (video) {
        // 1. Catch any autoplay rejections from strict browser policies
        video.play().catch(error => {
            console.log("Autoplay prevented by browser policy:", error);
        });

        // 2. Pause video when out of viewport to save resources
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.1 });

        videoObserver.observe(video);
    }
});