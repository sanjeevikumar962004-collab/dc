/**
 * Bildium - Global Premium Form Validation System
 * Handles real-time field validation (name, email, 10-digit phone, message)
 * and premium modal success overlays.
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

    // 2. Build Success Modal Overlay Markup
    const overlay = document.createElement("div");
    overlay.className = "success-overlay";
    overlay.id = "submit-success-overlay";
    overlay.innerHTML = `
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
    document.body.appendChild(overlay);

    const closeBtn = document.getElementById("success-close-btn");
    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("is-active");
        document.body.style.overflow = "";
    });

    // 3. Validation Logic Core
    const contactForm = document.getElementById("contact-form");
    if (!contactForm) return;

    const fields = {
        name: {
            el: document.getElementById("name"),
            validate: (val) => {
                if (!val || val.trim().length < 3) return "Name must be at least 3 characters long.";
                if (!/^[a-zA-Z\s]+$/.test(val)) return "Name must contain only alphabetical characters and spaces.";
                return "";
            }
        },
        email: {
            el: document.getElementById("email"),
            validate: (val) => {
                if (!val) return "Email address is required.";
                // Strict email regex matching
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(val)) return "Please enter a valid, strict email address (e.g., mail@example.com).";
                return "";
            }
        },
        phone: {
            el: document.getElementById("phone"),
            validate: (val) => {
                if (!val) return "Phone number is required.";
                // Remove spaces/dashes if any to count raw digits
                const digits = val.replace(/\D/g, "");
                if (digits.length !== 10) return "Phone number must be exactly 10 digits.";
                if (/[a-zA-Z]/.test(val)) return "Phone number cannot contain alphabetical letters.";
                return "";
            }
        },
        message: {
            el: document.getElementById("message"),
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
    contactForm.addEventListener("submit", (e) => {
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
            // Trigger beautiful modal overlay
            overlay.classList.add("is-active");
            document.body.style.overflow = "hidden";

            // Reset form fields
            contactForm.reset();
            Object.keys(fields).forEach(key => {
                const parent = fields[key].el.parentElement;
                parent.classList.remove("is-valid", "is-invalid");
            });
        } else {
            // Shake first invalid group to draw attention
            const firstInvalid = contactForm.querySelector(".is-invalid");
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
