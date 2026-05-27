/**
 * Bildium - Global Premium Form Validation & Newsletter System
 * Handles real-time field validation (name, email, 10-digit phone, message, search)
 * and premium modal success overlays for both enquiries and newsletter signups.
 * Includes a global click navigator to automatically route all non-essential actions to 404.html.
 */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Inject Premium Validation CSS Styles Dynamically
    const style = document.createElement("style");
    style.textContent = `
        /* Live Validation Styling */
        .form-group {
            position: relative;
            margin-bottom: 2.2rem !important; /* Extra spacing for absolute error labels */
        }
        
        .form-group input, 
        .form-group select, 
        .form-group textarea {
            transition: border-color 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), 
                        box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
                        background-color 0.3s ease !important;
        }

        .form-group.is-valid input,
        .form-group.is-valid textarea {
            border-color: #A3D9C9 !important; /* Soft premium green border */
            background-color: #FCFDFB !important;
            box-shadow: 0 4px 12px rgba(163, 217, 201, 0.15) !important;
        }

        .form-group.is-invalid input,
        .form-group.is-invalid textarea {
            border-color: #E07A5F !important; /* Soft luxury terracotta red */
            background-color: #FFFDFD !important;
            box-shadow: 0 4px 12px rgba(224, 122, 95, 0.15) !important;
        }

        /* Error Label styling */
        .validation-error {
            position: absolute;
            bottom: -1.4rem;
            left: 0.5rem;
            font-size: 0.75rem;
            font-weight: 600;
            color: #E07A5F;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
            pointer-events: none;
            font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .form-group.is-invalid .validation-error {
            opacity: 1;
            transform: translateY(0);
        }

        /* Newsletter Custom Error Styles */
        .newsletter-form {
            position: relative;
            transition: border-color 0.4s ease, box-shadow 0.4s ease !important;
        }
        
        .newsletter-form.is-invalid {
            border-color: #E07A5F !important;
            box-shadow: 0 4px 15px rgba(224, 122, 95, 0.3) !important;
        }
        
        .newsletter-form.is-valid {
            border-color: #A3D9C9 !important;
            box-shadow: 0 4px 15px rgba(163, 217, 201, 0.3) !important;
        }
        
        .newsletter-error-message {
            color: #E07A5F;
            font-size: 0.8rem;
            font-weight: 600;
            margin-top: 0.8rem;
            text-align: center;
            font-family: 'Plus Jakarta Sans', sans-serif;
            display: none;
        }
        
        .newsletter-form.is-invalid + .newsletter-error-message {
            display: block;
        }

        /* Search Box Custom Validation Styles */
        .search-box input {
            transition: border-color 0.4s ease, box-shadow 0.4s ease, background-color 0.4s ease !important;
        }
        
        .search-box input.is-invalid {
            border-color: #E07A5F !important;
            box-shadow: 0 4px 15px rgba(224, 122, 95, 0.3) !important;
            background-color: #FFFDFD !important;
        }
        
        .search-box input.is-valid {
            border-color: #A3D9C9 !important;
            box-shadow: 0 4px 15px rgba(163, 217, 201, 0.3) !important;
            background-color: #FCFDFB !important;
        }

        /* Premium Success Modal Overlay */
        .success-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100vh;
            background: rgba(17, 17, 17, 0.95);
            backdrop-filter: blur(15px);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .success-overlay.is-active {
            opacity: 1;
            pointer-events: all;
        }

        .success-card {
            background: #FFFFFF;
            width: 90%;
            max-width: 450px;
            padding: 3.5rem 2.5rem;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 40px 80px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
            transform: scale(0.8) translateY(20px);
            transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .success-overlay.is-active .success-card {
            transform: scale(1) translateY(0);
        }

        .success-icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: rgba(236, 174, 58, 0.1);
            color: #ECAE3A;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 2rem;
            position: relative;
        }

        .success-icon-wrap svg {
            width: 40px;
            height: 40px;
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            transition: stroke-dashoffset 0.8s ease 0.3s;
        }

        .success-overlay.is-active svg {
            stroke-dashoffset: 0;
        }

        .success-card h3 {
            font-family: 'Outfit', sans-serif;
            font-size: 1.8rem;
            color: #111111;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .success-card p {
            font-family: 'Plus Jakarta Sans', sans-serif;
            color: #555555;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        .success-close-btn {
            background: #111111;
            color: #FFFFFF;
            border: none;
            padding: 1rem 2.5rem;
            font-family: 'Outfit', sans-serif;
            font-weight: 700;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        }

        .success-close-btn:hover {
            background: #ECAE3A;
            color: #111111;
        }
    `;
    document.head.appendChild(style);

    // 2. Build Success Modal Overlay Markup for Enquiries
    const enquiryOverlay = document.createElement("div");
    enquiryOverlay.className = "success-overlay";
    enquiryOverlay.id = "submit-success-overlay";
    enquiryOverlay.innerHTML = `
        <div class="success-card">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3>Blueprint Confirmed</h3>
            <p>Your estimator briefing has been logged. Our structural coordinators will contact you shortly with a precision raw spatial forecast.</p>
            <button class="success-close-btn" id="success-close-btn">Return to Grid</button>
        </div>
    `;
    document.body.appendChild(enquiryOverlay);

    const closeBtn = document.getElementById("success-close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            enquiryOverlay.classList.remove("is-active");
            document.body.style.overflow = "";
        });
    }

    // 3. Build Success Modal Overlay Markup for Newsletter Subscription
    const newsletterOverlay = document.createElement("div");
    newsletterOverlay.className = "success-overlay";
    newsletterOverlay.id = "newsletter-success-overlay";
    newsletterOverlay.innerHTML = `
        <div class="success-card">
            <div class="success-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </div>
            <h3>Digest Engaged</h3>
            <p>Your subscription to our engineering digest is active in our central coordinator registry. Welcome to the grid!</p>
            <button class="success-close-btn" id="newsletter-close-btn">Return to Grid</button>
        </div>
    `;
    document.body.appendChild(newsletterOverlay);

    const newsletterCloseBtn = document.getElementById("newsletter-close-btn");
    if (newsletterCloseBtn) {
        newsletterCloseBtn.addEventListener("click", () => {
            newsletterOverlay.classList.remove("is-active");
            document.body.style.overflow = "";
        });
    }

    // ================= ENQUIRY / CONTACT FORMS VALIDATION =================
    const forms = document.querySelectorAll("#contact-form");
    forms.forEach(form => {
        const fields = {
            name: {
                el: form.querySelector("#name"),
                validate: (val) => {
                    if (!val || val.trim().length < 3) return "Name must be at least 3 characters long.";
                    if (!/^[a-zA-Z\s]+$/.test(val)) return "Name must contain only alphabetical characters and spaces.";
                    return "";
                }
            },
            email: {
                el: form.querySelector("#email"),
                validate: (val) => {
                    if (!val) return "Email address is required.";
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(val)) return "Please enter a valid, strict email address (e.g., mail@example.com).";
                    return "";
                }
            },
            phone: {
                el: form.querySelector("#phone"),
                validate: (val) => {
                    if (!val) return "Phone number is required.";
                    const digits = val.replace(/\D/g, "");
                    if (digits.length !== 10) return "Phone number must be exactly 10 digits.";
                    if (/[a-zA-Z]/.test(val)) return "Phone number cannot contain alphabetical letters.";
                    return "";
                }
            },
            message: {
                el: form.querySelector("#message"),
                validate: (val) => {
                    if (!val || val.trim().length < 10) return "Please provide at least 10 characters detailing your build requirements.";
                    return "";
                }
            }
        };

        // Attach dynamic feedback UI and handlers
        Object.keys(fields).forEach(key => {
            const fieldObj = fields[key];
            const input = fieldObj.el;
            if (!input) return;

            const parent = input.parentElement;
            
            // Add absolute validation-error label if not present
            let errorSpan = parent.querySelector(".validation-error");
            if (!errorSpan) {
                errorSpan = document.createElement("span");
                errorSpan.className = "validation-error";
                parent.appendChild(errorSpan);
            }

            // Live Validation on input & blur
            const triggerValidation = () => {
                const errorMsg = fieldObj.validate(input.value);
                if (errorMsg) {
                    parent.classList.remove("is-valid");
                    parent.classList.add("is-invalid");
                    errorSpan.textContent = errorMsg;
                } else {
                    parent.classList.remove("is-invalid");
                    parent.classList.add("is-valid");
                    errorSpan.textContent = "";
                }
                return !errorMsg;
            };

            input.addEventListener("input", triggerValidation);
            input.addEventListener("blur", triggerValidation);
            
            // Store trigger function on input elements for form check
            input.triggerValidation = triggerValidation;
        });

        // Form Submit handling
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let isFormValid = true;
            Object.keys(fields).forEach(key => {
                const fieldObj = fields[key];
                if (fieldObj.el && typeof fieldObj.el.triggerValidation === "function") {
                    const isValid = fieldObj.el.triggerValidation();
                    if (!isValid) isFormValid = false;
                }
            });

            if (isFormValid) {
                // Save briefing to localStorage dynamically for dashboards
                const name = fields.name.el ? fields.name.el.value : "";
                const email = fields.email.el ? fields.email.el.value : "";
                const phone = fields.phone.el ? fields.phone.el.value : "";
                const message = fields.message.el ? fields.message.el.value : "";

                const briefings = JSON.parse(localStorage.getItem("estimatorBriefings") || "[]");
                briefings.unshift({
                    name: name,
                    email: email,
                    phone: phone,
                    message: message,
                    date: new Date().toLocaleDateString(),
                    status: "Confirmed"
                });
                localStorage.setItem("estimatorBriefings", JSON.stringify(briefings));

                // Trigger beautiful modal overlay
                enquiryOverlay.classList.add("is-active");
                document.body.style.overflow = "hidden";

                // Reset form fields
                form.reset();
                Object.keys(fields).forEach(key => {
                    if (fields[key].el) {
                        const parent = fields[key].el.parentElement;
                        parent.classList.remove("is-valid", "is-invalid");
                    }
                });
            } else {
                // Shake first invalid group to draw attention
                const firstInvalid = form.querySelector(".is-invalid");
                if (firstInvalid) {
                    firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                    
                    // Trigger subtle shake micro-animation
                    firstInvalid.style.transform = "translateX(10px)";
                    setTimeout(() => firstInvalid.style.transform = "translateX(-10px)", 70);
                    setTimeout(() => firstInvalid.style.transform = "translateX(5px)", 140);
                    setTimeout(() => firstInvalid.style.transform = "translateX(-5px)", 210);
                    setTimeout(() => firstInvalid.style.transform = "translateX(0)", 280);
                }
            }
        });
    });

    // ================= NEWSLETTER SUBSCRIPTION FORMS VALIDATION =================
    const newsletterForms = document.querySelectorAll(".newsletter-form");
    newsletterForms.forEach(form => {
        const input = form.querySelector("input[type='email']");
        if (!input) return;

        // Inject error message element right after form
        let errorMsgDiv = form.nextElementSibling;
        if (!errorMsgDiv || !errorMsgDiv.classList.contains("newsletter-error-message")) {
            errorMsgDiv = document.createElement("div");
            errorMsgDiv.className = "newsletter-error-message";
            errorMsgDiv.textContent = "Please enter a valid, strict email address (e.g., corporate@domain.com).";
            form.parentNode.insertBefore(errorMsgDiv, form.nextSibling);
        }

        const validateEmail = (val) => {
            if (!val) return "Email address is required.";
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(val)) return "Invalid email address.";
            return "";
        };

        const triggerValidation = () => {
            const error = validateEmail(input.value.trim());
            if (error) {
                form.classList.remove("is-valid");
                form.classList.add("is-invalid");
                return false;
            } else {
                form.classList.remove("is-invalid");
                form.classList.add("is-valid");
                return true;
            }
        };

        input.addEventListener("input", triggerValidation);
        input.addEventListener("blur", triggerValidation);

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const isValid = triggerValidation();

            if (isValid) {
                // Show success modal overlay
                newsletterOverlay.classList.add("is-active");
                document.body.style.overflow = "hidden";

                // Reset form
                form.reset();
                form.classList.remove("is-valid", "is-invalid");
            } else {
                // Shake form to draw attention
                form.style.transform = "translateX(10px)";
                setTimeout(() => form.style.transform = "translateX(-10px)", 70);
                setTimeout(() => form.style.transform = "translateX(5px)", 140);
                setTimeout(() => form.style.transform = "translateX(-5px)", 210);
                setTimeout(() => form.style.transform = "translateX(0)", 280);
            }
        });
    });

    // ================= SEARCH BOX VALIDATION =================
    const searchForm = document.getElementById("search-journal-form");
    if (searchForm) {
        const searchInput = document.getElementById("search-input");
        const searchBox = searchForm.querySelector(".search-box");

        if (searchInput && searchBox) {
            const validateSearch = () => {
                const val = searchInput.value.trim();
                if (!val || val.length < 3) {
                    searchInput.classList.remove("is-valid");
                    searchInput.classList.add("is-invalid");
                    return false;
                } else {
                    searchInput.classList.remove("is-invalid");
                    searchInput.classList.add("is-valid");
                    return true;
                }
            };

            searchInput.addEventListener("input", () => {
                if (searchInput.classList.contains("is-invalid") || searchInput.classList.contains("is-valid")) {
                    validateSearch();
                }
            });

            searchForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const isValid = validateSearch();

                if (isValid) {
                    // Search is valid, redirect to 404 as all non-nav events redirect to 404.html
                    window.location.href = "404.html";
                } else {
                    // Shake the search box
                    searchBox.style.transform = "translateX(10px)";
                    setTimeout(() => searchBox.style.transform = "translateX(-10px)", 70);
                    setTimeout(() => searchBox.style.transform = "translateX(5px)", 140);
                    setTimeout(() => searchBox.style.transform = "translateX(-5px)", 210);
                    setTimeout(() => searchBox.style.transform = "translateX(0)", 280);
                }
            });
        }
    }

    // ================= GLOBAL CLICK-TO-404 NAVIGATOR =================
    document.body.addEventListener("click", (e) => {
        // Find if the click is on an allowed interactive element or inside one.
        // We traverse up the DOM tree from the clicked element.
        let target = e.target;
        let shouldGoTo404 = true;

        while (target && target !== document.body) {
            // 1. Check if it is a nav link pointing to a real page
            if (target.tagName === "A") {
                const href = target.getAttribute("href");
                if (href) {
                    const cleanHref = href.split("#")[0].split("?")[0];
                    const allowedHrefs = [
                        "index.html",
                        "about.html",
                        "services.html",
                        "blog.html",
                        "contact.html",
                        "login.html",
                        "signup.html",
                        "forgotpassword.html",
                        "user-dashboard.html",
                        "admin-dashboard.html"
                    ];
                    // If it points to one of the main nav pages or login/signup/dashboards
                    // AND it is NOT explicitly pointing to 404.html
                    if (allowedHrefs.includes(cleanHref) && cleanHref !== "404.html") {
                        // Allow normal navigation
                        shouldGoTo404 = false;
                        break;
                    }
                }
            }

            // 2. Allow form controls so user can interact with forms
            if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.tagName === "SELECT" ||
                target.tagName === "BUTTON" ||
                target.tagName === "LABEL" ||
                target.classList.contains("success-close-btn") ||
                target.id === "success-close-btn" ||
                target.id === "newsletter-close-btn"
            ) {
                // Allow interaction
                shouldGoTo404 = false;
                break;
            }

            // 3. Allow interactive elements in Auth screens or Dashboard sidebars that are handled separately
            if (
                target.classList.contains("role-tab") ||
                target.classList.contains("menu-toggle") ||
                target.classList.contains("hamburger") ||
                target.id === "mobile-menu-btn" ||
                target.id === "mobile-menu" ||
                target.classList.contains("mobile-menu") ||
                target.classList.contains("logout-btn")
            ) {
                shouldGoTo404 = false;
                break;
            }

            // Move up
            target = target.parentElement;
        }

        // If the element clicked is document.body or html itself
        if (e.target === document.body || e.target === document.documentElement) {
            shouldGoTo404 = true;
        }

        if (shouldGoTo404) {
            // Check if we are already on 404.html to avoid infinite redirect loops
            if (!window.location.pathname.includes("404.html")) {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "404.html";
            }
        }
    }, true); // Use capture phase so we intercept before other events!
});
