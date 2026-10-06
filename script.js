document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const header =
        document.getElementById("siteHeader");

    const menuToggle =
        document.getElementById("menuToggle");

    const navMenu =
        document.getElementById("navMenu");

    const backTop =
        document.getElementById("backTop");



    /* =====================================================
       HEADER SCROLL
    ===================================================== */

    function handleScroll() {

        if (header) {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 25
            );

        }


        if (backTop) {

            backTop.classList.toggle(
                "show",
                window.scrollY > 600
            );

        }

    }


    window.addEventListener(
        "scroll",
        handleScroll
    );


    handleScroll();



    /* =====================================================
       MOBILE MENU
    ===================================================== */

    if (menuToggle && navMenu) {

        menuToggle.addEventListener(
            "click",
            () => {

                const open =
                    navMenu.classList.toggle(
                        "open"
                    );


                menuToggle.setAttribute(
                    "aria-expanded",
                    String(open)
                );


                menuToggle.setAttribute(
                    "aria-label",
                    open
                        ? "Close menu"
                        : "Open menu"
                );

            }
        );


        navMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {

                        navMenu.classList.remove(
                            "open"
                        );


                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuToggle.setAttribute(
                            "aria-label",
                            "Open menu"
                        );

                    }
                );

            });

    }



    /* =====================================================
       SCROLL REVEAL
    ===================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    if (
        "IntersectionObserver"
        in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "show"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        revealElements.forEach(
            element => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "show"
                );

            }
        );

    }



    /* =====================================================
       COUNTERS
    ===================================================== */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    if (
        "IntersectionObserver"
        in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const counter =
                            entry.target;


                        const target =
                            Number(
                                counter.dataset.target
                            );


                        const duration =
                            1400;


                        const start =
                            performance.now();


                        function update(now) {

                            const progress =
                                Math.min(
                                    (now - start) /
                                    duration,
                                    1
                                );


                            const eased =
                                1 -
                                Math.pow(
                                    1 - progress,
                                    3
                                );


                            const value =
                                target * eased;


                            if (
                                Number.isInteger(
                                    target
                                )
                            ) {

                                counter.textContent =
                                    Math.floor(
                                        value
                                    );

                            } else {

                                counter.textContent =
                                    value.toFixed(
                                        1
                                    );

                            }


                            if (
                                progress < 1
                            ) {

                                requestAnimationFrame(
                                    update
                                );

                            } else {

                                counter.textContent =
                                    Number.isInteger(
                                        target
                                    )
                                        ? target
                                        : target.toFixed(
                                            1
                                        );

                            }

                        }


                        requestAnimationFrame(
                            update
                        );


                        observer.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: 0.7
                }
            );


        counters.forEach(counter => {

            counterObserver.observe(
                counter
            );

        });

    }



    /* =====================================================
       BACK TO TOP
    ===================================================== */

    if (backTop) {

        backTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );

    }



    /* =====================================================
       SERVICE LINKS
       ALWAYS GO TO CONTACT
    ===================================================== */

    const serviceLinks =
        document.querySelectorAll(
            ".service-link"
        );


    serviceLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                const contact =
                    document.getElementById(
                        "contact"
                    );


                if (contact) {

                    contact.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });



    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const form =
        document.getElementById(
            "contactForm"
        );


    const formMessage =
        document.getElementById(
            "formMessage"
        );


    if (
        form &&
        formMessage
    ) {

        form.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                formMessage.textContent =
                    "Thank you! Your enquiry has been captured. Connect this form to your email or backend before going live.";


                form.reset();

            }
        );

    }



    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const sections =
        document.querySelectorAll(
            "main section[id]"
        );


    const navLinks =
        document.querySelectorAll(
            ".nav-menu > a:not(.nav-cta)"
        );


    if (
        sections.length &&
        navLinks.length &&
        "IntersectionObserver"
        in window
    ) {

        const activeObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            navLinks.forEach(
                                link => {

                                    const href =
                                        link.getAttribute(
                                            "href"
                                        );


                                    link.classList.toggle(
                                        "active",
                                        href ===
                                        `#${entry.target.id}`
                                    );

                                }
                            );

                        }

                    });

                },
                {
                    rootMargin:
                        "-40% 0px -50% 0px"
                }
            );


        sections.forEach(section => {

            activeObserver.observe(
                section
            );

        });

    }



    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                navMenu &&
                menuToggle
            ) {

                navMenu.classList.remove(
                    "open"
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );


                menuToggle.setAttribute(
                    "aria-label",
                    "Open menu"
                );

            }

        }
    );

});