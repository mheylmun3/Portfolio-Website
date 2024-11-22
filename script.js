document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('interactive-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpi = window.devicePixelRatio || 1;

        const particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 150, // Interaction radius
        };

        // Check if the device is mobile
        const isMobile = window.innerWidth <= 768;

        // Adjust canvas size
        function adjustCanvasSize() {
            canvas.width = window.innerWidth * dpi;
            canvas.height = window.innerHeight * dpi;
            ctx.scale(dpi, dpi);
        }

        adjustCanvasSize();
        window.addEventListener('resize', function () {
            adjustCanvasSize();
            if (!isMobile) init(); // Only reinitialize particles on non-mobile devices
        });

        // Particle Constructor
        function Particle(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        // Draw method for particles
        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#e6e6e6'; // Light grey color for dots
            ctx.fill();
        };

        // Update method for particles
        Particle.prototype.update = function () {
            if (!isMobile) {
                if (this.x > canvas.width / dpi || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height / dpi || this.y < 0) {
                    this.directionY = -this.directionY;
                }

                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                        this.x += 5;
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) {
                        this.x -= 5;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                        this.y += 5;
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) {
                        this.y -= 5;
                    }
                }
            }

            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        };

        // Create particles
        function init() {
            particlesArray.length = 0;
            const numberOfParticles = isMobile
                ? (canvas.width * canvas.height) / (27000 * dpi) // Fewer particles for mobile
                : (canvas.width * canvas.height) / (9000 * dpi);

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 5 + 1;
                const x = Math.random() * (canvas.width / dpi - size * 2) + size;
                const y = Math.random() * (canvas.height / dpi - size * 2) + size;
                const directionX = (Math.random() * 0.2) - 0.1;
                const directionY = (Math.random() * 0.2) - 0.1;
                const color = '#8c5523'; // Dark grey for lines

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Connect particles with lines
        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2)
                                   + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        const opacityValue = 1 - distance / 20000;
                        ctx.strokeStyle = `rgba(200, 200, 200, ${opacityValue})`;
                        ctx.lineWidth = dpi > 1 ? 1.5 : 1; // Adjust line width for DPI
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width / dpi, canvas.height / dpi);
            particlesArray.forEach(particle => particle.update());
            connect();
        }

        // Disable interaction on mobile
        if (!isMobile) {
            window.addEventListener('mousemove', function (event) {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            });
        }

        init();
        animate();
    }
});

// Sticky navigation on scroll
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const banner = document.querySelector('.header-banner');
    const bannerLogo = document.querySelector('#banner-logo');

    const maxHeaderHeight = 80; // Maximum height of the header
    const minHeaderHeight = 50; // Minimum height of the header (same as banner height)

    // Get the scroll distance from the top
    const scrollY = window.scrollY;

    // Calculate the new header height based on scroll position
    let newHeaderHeight = maxHeaderHeight - (scrollY / 10);

    // Ensure the header height doesn't go below the minimum height
    if (newHeaderHeight <= minHeaderHeight) {
        newHeaderHeight = minHeaderHeight;
        header.style.display = 'none'; // Hide the header when it's small enough
        banner.style.display = 'block'; // Show the banner
        bannerLogo.setAttribute('src', 'images/logo2.png'); // Change logo to logo2.png
    } else {
        header.style.display = 'flex'; // Show the header if it's larger than min height
        banner.style.display = 'none'; // Hide the banner
        header.style.height = `${newHeaderHeight}px`;
    }
});

// Smooth scroll for in-page anchor links only
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Check if the link is an in-page anchor (starts with '#')
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
        // For external links (different HTML pages), allow default behavior
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Get the header height
    const header = document.querySelector('header');
    const firstSection = document.querySelector('.section-first');
    
    if (header && firstSection) {
        const headerHeight = header.offsetHeight;
        // Add padding to the first section based on the header height
        firstSection.style.paddingTop = (headerHeight + 20) + 'px'; // Add 40px for extra space
    }
});

// JavaScript for the hamburger menu
document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('header').classList.toggle('nav-expanded');
});

document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.mobile-nav').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) { // Check if elements exist
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active'); // Toggle the X animation
            mobileMenu.classList.toggle('open'); // Toggle the visibility of the mobile menu
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the element is visible

    sections.forEach(section => {
        observer.observe(section);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const heroSection = document.getElementById("hero");
    const heroHeading = document.getElementById("hero-heading");
    const heroText = document.getElementById("hero-text");
    const heroBtn = document.getElementById("hero-btn");
    const heroProjects = document.getElementById("featured-projects");
    const projectTitles = document.querySelectorAll(".featured-project p");

    // Helper function to add 'active' class with a delay
    function addActiveClass(element, delay) {
        if (element) {
            setTimeout(() => {
                element.classList.add("active");
            }, delay);
        }
    }

    // Trigger the hero section fade-in first
    addActiveClass(heroSection, 0); // No delay for the hero section fade-in

    // Trigger animations for hero elements in sequence
    addActiveClass(heroHeading, 500); // Delay of 0.5s
    addActiveClass(heroText, 1500); // Delay of 1.5s
    addActiveClass(heroBtn, 1500); // Delay of 1.5s
    addActiveClass(heroProjects, 2800); // Delay of 2.8s

    // Animate each project title
    projectTitles.forEach((title, index) => {
        addActiveClass(title, 3100 + (index * 300)); // Staggered delay for each title
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const hiddenElements = document.querySelectorAll(".hidden");

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const hiddenElements = document.querySelectorAll(".hidden");
    const header = document.querySelector("header");

    // IntersectionObserver to reveal hidden elements as they appear in the viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Stop observing once the element is visible
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });

    // Check if on the home page (index page)
    if (window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
        // Add delay to fade in the header on the home page
        setTimeout(() => {
            header.classList.add("visible");
        }, 2800); // Adjust the delay as needed
    } else {
        // Make the header static and fully visible on other pages
        header.classList.add("static");
    }
});
