/**
 * BILDIUM - CORE SECURITY & AUTHENTICATION ENGINE
 * Handles mock accounts, role-based login/signup validation, 
 * session storage guards, and populating dashboard interfaces.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ================= DOCKING ENQUIRY HOOK FOR ADMIN =================
    // Storing form submissions into LocalStorage so the Admin Dashboard works dynamically
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", () => {
            // Give validation.js time to check fields
            setTimeout(() => {
                const nameEl = document.getElementById("name");
                const emailEl = document.getElementById("email");
                const phoneEl = document.getElementById("phone");
                const messageEl = document.getElementById("message");
                
                // If validation passed and form was cleared or overlay shown
                if (nameEl && emailEl && nameEl.value === "" && emailEl.value === "") {
                    // Let's assume validation succeeded because the form reset.
                    return; // validation.js already handled reset, so we should capture earlier.
                }
            }, 100);
        });

        // Let's intercept form submission to save details
        const originalSubmit = contactForm.submit;
        contactForm.addEventListener("submit", (e) => {
            const name = document.getElementById("name")?.value;
            const email = document.getElementById("email")?.value;
            const phone = document.getElementById("phone")?.value;
            const message = document.getElementById("message")?.value;
            
            // Basic validation check matching validation.js criteria
            if (name && email && phone && message && name.trim().length >= 3 && email.includes("@") && phone.replace(/\D/g, "").length === 10 && message.trim().length >= 10) {
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
            }
        });
    }

    // ================= INITIALIZE MOCK USERS =================
    const defaultUsers = [
        { email: "user@bildium.com", password: "password123", role: "user" },
        { email: "admin@bildium.com", password: "password123", role: "admin" }
    ];
    
    if (!localStorage.getItem("bildiumUsers")) {
        localStorage.setItem("bildiumUsers", JSON.stringify(defaultUsers));
    }

    // Initialize mock Estimator Briefings for admin dashboards to feel authentic at first load
    const defaultBriefings = [
        { name: "John Doe", email: "johndoe@gmail.com", phone: "5550192834", message: "Need a steel structure estimate for a 12-story commercial warehouse in the downtown grid.", date: "05/26/2026", status: "Confirmed" },
        { name: "Sarah Miller", email: "sarah.m@architecture.co", phone: "5559876543", message: "Facade restoration briefing on our historic brick headquarters. Requires scaffolding over the main avenue.", date: "05/25/2026", status: "Pending" },
        { name: "Michael Vance", email: "vance_developments@outlook.com", phone: "5551234567", message: "Full MEP plumbing system overhaul. Checking budget allocations and blueprint spatial specifications.", date: "05/24/2026", status: "Review" }
    ];

    if (!localStorage.getItem("estimatorBriefings")) {
        localStorage.setItem("estimatorBriefings", JSON.stringify(defaultBriefings));
    }

    // ================= DYNAMIC AUTH PAGES CONTROLLER =================
    
    // 1. Role Toggle selector (Login screen)
    const roleTabs = document.querySelectorAll(".role-tab");
    const roleInput = document.getElementById("login-role");
    if (roleTabs.length > 0 && roleInput) {
        roleTabs.forEach(tab => {
            tab.addEventListener("click", () => {
                roleTabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
                roleInput.value = tab.getAttribute("data-role");
            });
        });
    }

    // 2. Validate fields real-time & Submit Login Form
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const validateEmail = (email) => {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        };

        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const role = roleInput ? roleInput.value : "user";

            // Validation CSS resets
            emailInput.parentElement.classList.remove("is-invalid", "is-valid");
            passwordInput.parentElement.classList.remove("is-invalid", "is-valid");

            if (!email || !validateEmail(email)) {
                emailInput.parentElement.classList.add("is-invalid");
                const err = emailInput.parentElement.querySelector(".error-text");
                if (err) err.textContent = "Please enter a valid email address.";
                isValid = false;
            } else {
                emailInput.parentElement.classList.add("is-valid");
            }

            if (!password || password.length < 6) {
                passwordInput.parentElement.classList.add("is-invalid");
                const err = passwordInput.parentElement.querySelector(".error-text");
                if (err) err.textContent = "Password must be at least 6 characters.";
                isValid = false;
            } else {
                passwordInput.parentElement.classList.add("is-valid");
            }

            if (isValid) {
                // Log in successfully immediately using whatever password was given!
                // Temporarily save when in login session only!
                localStorage.setItem("bildiumSession", JSON.stringify({
                    email: email,
                    role: role,
                    time: new Date().getTime()
                }));

                // Reroute based on role
                if (role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "user-dashboard.html";
                }
            }
        });
    }

    // 3. Signup Form
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const roleSelect = document.getElementById("role");
        const passwordInput = document.getElementById("password");
        const confirmPasswordInput = document.getElementById("confirm-password");

        const validateEmail = (email) => {
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
        };

        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let isValid = true;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const role = roleSelect.value;
            const password = passwordInput.value;
            const confirm = confirmPasswordInput.value;

            // Clear errors
            [nameInput, emailInput, roleSelect, passwordInput, confirmPasswordInput].forEach(el => {
                el.parentElement.classList.remove("is-invalid", "is-valid");
            });

            if (!name || name.length < 3) {
                nameInput.parentElement.classList.add("is-invalid");
                isValid = false;
            } else {
                nameInput.parentElement.classList.add("is-valid");
            }

            if (!email || !validateEmail(email)) {
                emailInput.parentElement.classList.add("is-invalid");
                isValid = false;
            } else {
                emailInput.parentElement.classList.add("is-valid");
            }

            if (!role) {
                roleSelect.parentElement.classList.add("is-invalid");
                isValid = false;
            } else {
                roleSelect.parentElement.classList.add("is-valid");
            }

            if (!password || password.length < 6) {
                passwordInput.parentElement.classList.add("is-invalid");
                isValid = false;
            } else {
                passwordInput.parentElement.classList.add("is-valid");
            }

            if (!confirm || confirm !== password) {
                confirmPasswordInput.parentElement.classList.add("is-invalid");
                isValid = false;
            } else {
                confirmPasswordInput.parentElement.classList.add("is-valid");
            }

            if (isValid) {
                // Do NOT save the email in signup. Simply redirect straight to login page!
                window.location.href = "login.html";
            }
        });
    }

    // 4. Forgot Password Form
    const forgotForm = document.getElementById("forgot-form");
    if (forgotForm) {
        forgotForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email")?.value;
            if (email && email.includes("@")) {
                // Route to 404 page as requested
                window.location.href = "404.html";
            } else {
                const emailInput = document.getElementById("email");
                emailInput.parentElement.classList.add("is-invalid");
            }
        });
    }

    // ================= SESSION GUARDS & DASHBOARDS POPULATION =================
    const session = JSON.parse(localStorage.getItem("bildiumSession") || "null");
    
    // Check if we are currently on a dashboard page
    const isUserDashboard = window.location.pathname.includes("user-dashboard.html");
    const isAdminDashboard = window.location.pathname.includes("admin-dashboard.html");

    if (isUserDashboard || isAdminDashboard) {
        if (!session) {
            // Guard: Reroute unauthenticated access to login
            window.location.href = "login.html";
            return;
        }

        // Validate Role Access
        if (isUserDashboard && session.role !== "user") {
            window.location.href = "admin-dashboard.html";
            return;
        }
        if (isAdminDashboard && session.role !== "admin") {
            window.location.href = "user-dashboard.html";
            return;
        }

        // Inject session email in user profile components
        const profileEmailElements = document.querySelectorAll(".profile-email");
        profileEmailElements.forEach(el => {
            el.textContent = session.email;
        });

        // Set dynamic Avatar initials (1st letter of email capitalized)
        const profileAvatarElements = document.querySelectorAll(".profile-avatar");
        profileAvatarElements.forEach(el => {
            el.textContent = session.email.charAt(0).toUpperCase();
        });

        // Handle Logout Action
        const logoutButtons = document.querySelectorAll(".logout-btn");
        logoutButtons.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("bildiumSession");
                window.location.href = "login.html";
            });
        });

        // Handle Sidebar Toggle for Mobile Devices
        const sidebarToggle = document.getElementById("sidebar-toggle");
        const sidebar = document.querySelector(".dashboard-sidebar");
        if (sidebarToggle && sidebar) {
            sidebarToggle.addEventListener("click", () => {
                sidebar.classList.toggle("is-open");
            });
            
            // Close sidebar when clicking outside on mobile
            document.addEventListener("click", (e) => {
                if (window.innerWidth <= 992 && 
                    !sidebar.contains(e.target) && 
                    !sidebarToggle.contains(e.target) && 
                    sidebar.classList.contains("is-open")) {
                    sidebar.classList.remove("is-open");
                }
            });
        }
    }

    // ================= DYNAMIC DATA INJECTOR =================
    
    // Inject dynamic briefs for Admin Enquiry Panel
    if (isAdminDashboard) {
        const tableBody = document.getElementById("admin-briefings-tbody");
        const enquiryCardList = document.getElementById("admin-briefings-cards");
        const totalEnquiriesVal = document.getElementById("total-enquiries-val");
        
        const briefings = JSON.parse(localStorage.getItem("estimatorBriefings") || "[]");

        if (totalEnquiriesVal) {
            totalEnquiriesVal.textContent = briefings.length;
        }

        if (tableBody) {
            tableBody.innerHTML = "";
            if (briefings.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888; padding: 2rem;">No briefs logged.</td></tr>`;
            } else {
                briefings.forEach(item => {
                    const row = document.createElement("tr");
                    const statusClass = item.status ? item.status.toLowerCase() : "confirmed";
                    
                    row.innerHTML = `
                        <td><strong>${escapeHTML(item.name)}</strong></td>
                        <td>${escapeHTML(item.email)}</td>
                        <td>${escapeHTML(item.phone)}</td>
                        <td style="max-width: 250px; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;" title="${escapeHTML(item.message)}">
                            ${escapeHTML(item.message)}
                        </td>
                        <td><span class="status-badge ${statusClass}">${escapeHTML(item.status || "Confirmed")}</span></td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }

        if (enquiryCardList) {
            enquiryCardList.innerHTML = "";
            if (briefings.length === 0) {
                enquiryCardList.innerHTML = `<div style="text-align: center; color: #888; padding: 1rem;">No briefs logged.</div>`;
            } else {
                briefings.slice(0, 4).forEach(item => {
                    const card = document.createElement("div");
                    card.className = "enquiry-card";
                    card.innerHTML = `
                        <div class="enquiry-card-meta" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.3rem;">
                            <span class="name" style="font-weight: 800; color: #111; font-size: 0.9rem;">${escapeHTML(item.name)}</span>
                            <span class="date" style="font-size: 0.75rem; color: #888; font-weight: 600;">${escapeHTML(item.date)}</span>
                        </div>
                        <div class="enquiry-card-email" style="font-size: 0.75rem; color: #666; font-weight: 600; margin-bottom: 0.8rem; word-break: break-all;">
                            ${escapeHTML(item.email)}
                        </div>
                        <div class="enquiry-card-body" style="font-size: 0.85rem; color: #555; line-height: 1.5;">
                            ${escapeHTML(item.message)}
                        </div>
                    `;
                    enquiryCardList.appendChild(card);
                });
            }
        }
    }
});

// Helper sanitization logic
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
