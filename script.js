document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header = document.getElementById("siteHeader");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const backTop = document.getElementById("backTop");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const hasObserver = "IntersectionObserver" in window;



    /* =====================================================
       HEADER + BACK-TO-TOP VISIBILITY ON SCROLL
       (throttled to one update per animation frame)
    ===================================================== */

    let scrollTicking = false;

    function updateOnScroll() {
        const y = window.scrollY;

        if (header) {
            header.classList.toggle("scrolled", y > 25);
        }

        if (backTop) {
            backTop.classList.toggle("show", y > 600);
        }

        scrollTicking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!scrollTicking) {
                scrollTicking = true;
                requestAnimationFrame(updateOnScroll);
            }
        },
        { passive: true }
    );

    updateOnScroll();



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    function setMenu(open) {
        if (!menuToggle || !navMenu) return;

        navMenu.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    function isMenuOpen() {
        return Boolean(navMenu && navMenu.classList.contains("open"));
    }

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {
            setMenu(!isMenuOpen());
        });

        // Close after choosing a link
        navMenu.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => setMenu(false));
        });

        // Close when tapping outside the header
        document.addEventListener("click", event => {
            if (isMenuOpen() && header && !header.contains(event.target)) {
                setMenu(false);
            }
        });

        // Reset state when the layout switches to the desktop navigation
        window
            .matchMedia("(min-width: 1180px)")
            .addEventListener("change", event => {
                if (event.matches) setMenu(false);
            });

    }



    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && isMenuOpen()) {
            setMenu(false);

            if (menuToggle) menuToggle.focus();
        }
    });



    /* =====================================================
       SCROLL REVEAL
       Elements that were scrolled past (for example by an
       anchor jump) are revealed immediately, never left blank.
    ===================================================== */

    const revealElements = document.querySelectorAll(".reveal");

    if (hasObserver && !prefersReducedMotion) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    const scrolledPast = entry.boundingClientRect.top < 0;

                    if (entry.isIntersecting || scrolledPast) {
                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        revealElements.forEach(element => revealObserver.observe(element));

        // When a nav/anchor link jumps down the page, reveal everything
        // above the target at once so the scroll never passes blank areas.
        document.addEventListener("click", event => {
            const link = event.target.closest('a[href^="#"]');

            if (!link || link.hash.length < 2) return;

            const target = document.getElementById(link.hash.slice(1));

            if (!target) return;

            revealElements.forEach(element => {
                if (
                    target.compareDocumentPosition(element) &
                    Node.DOCUMENT_POSITION_PRECEDING
                ) {
                    element.classList.add("show");
                }
            });
        });

    } else {

        revealElements.forEach(element => element.classList.add("show"));

    }



    /* =====================================================
       COUNTERS
    ===================================================== */

    const counters = document.querySelectorAll(".counter");

    function formatCounter(value, target) {
        return Number.isInteger(target)
            ? String(Math.floor(value))
            : value.toFixed(1);
    }

    function animateCounter(counter) {
        const target = Number(counter.dataset.target);

        if (Number.isNaN(target)) return;

        if (prefersReducedMotion) {
            counter.textContent = formatCounter(target, target);
            return;
        }

        const duration = 1400;
        const start = performance.now();

        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            counter.textContent = formatCounter(target * eased, target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = formatCounter(target, target);
            }
        }

        requestAnimationFrame(update);
    }

    if (counters.length) {

        if (hasObserver) {

            const counterObserver = new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {
                        if (!entry.isIntersecting) return;

                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    });

                },
                { threshold: 0.5 }
            );

            counters.forEach(counter => counterObserver.observe(counter));

        } else {

            counters.forEach(animateCounter);

        }

    }



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (backTop) {
        backTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }



    /* =====================================================
       SERVICE LINKS
       These are normal #contact anchors; CSS smooth scrolling
       and scroll-padding-top handle the movement, so no
       extra JavaScript is needed.
    ===================================================== */



    /* =====================================================
       CONTACT FORM
       There is no backend or email service connected, so
       nothing is sent from this page. On submit the visitor's
       own email app opens with the enquiry pre-filled, and
       the message says so plainly.
    ===================================================== */

    const form = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    const ENQUIRY_EMAIL = "hello@denzy.com";

    function showFormMessage(text, isError) {
        if (!formMessage) return;

        formMessage.textContent = text;
        formMessage.classList.toggle("is-error", Boolean(isError));
    }

    if (form && formMessage) {

        form.addEventListener("submit", event => {

            event.preventDefault();

            const data = new FormData(form);

            const name = String(data.get("name") || "").trim();
            const email = String(data.get("email") || "").trim();
            const message = String(data.get("message") || "").trim();
            const serviceSelect = form.elements.service;

            const serviceLabel =
                serviceSelect && serviceSelect.selectedIndex > 0
                    ? serviceSelect.options[serviceSelect.selectedIndex].text.trim()
                    : "";

            if (!name || !email || !serviceLabel || !message) {
                showFormMessage(
                    "Please complete every field before sending your enquiry.",
                    true
                );
                return;
            }

            const subject = `DENZY enquiry: ${serviceLabel}`;

            const body = [
                `Name: ${name}`,
                `Email: ${email}`,
                `Service: ${serviceLabel}`,
                "",
                message
            ].join("\n");

            showFormMessage(
                `Your email app should open with your enquiry ready to send. ` +
                `Nothing has been sent yet. Press Send there, or email us ` +
                `directly at ${ENQUIRY_EMAIL}.`,
                false
            );

            window.location.href =
                `mailto:${ENQUIRY_EMAIL}` +
                `?subject=${encodeURIComponent(subject)}` +
                `&body=${encodeURIComponent(body)}`;

        });

    }



    /* =====================================================
       ACTIVE NAVIGATION
       Sections without a nav link (Approach, Mission) keep the
       previous highlight instead of clearing it.
    ===================================================== */

    const sections = document.querySelectorAll("main section[id]");
    const navLinks = document.querySelectorAll(".nav-menu > a:not(.nav-cta)");

    if (sections.length && navLinks.length && hasObserver) {

        const activeObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    const id = `#${entry.target.id}`;

                    const hasMatch = Array.from(navLinks).some(
                        link => link.getAttribute("href") === id
                    );

                    if (!hasMatch) return;

                    navLinks.forEach(link => {
                        link.classList.toggle(
                            "active",
                            link.getAttribute("href") === id
                        );
                    });

                });

            },
            { rootMargin: "-40% 0px -50% 0px" }
        );

        sections.forEach(section => activeObserver.observe(section));

    }

});