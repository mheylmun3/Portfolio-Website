document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('interactive-canvas');

    // Check if the canvas exists (only run the script if it exists)
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Device Pixel Ratio to support high-res screens
        const dpi = window.devicePixelRatio || 1;

        // Adjust canvas size to fit the window and account for DPI
        function adjustCanvasSize() {
            // Scale the canvas based on DPI
            canvas.width = window.innerWidth * dpi;
            canvas.height = window.innerHeight * dpi;

            // Scale the drawing context to prevent blurry lines and dots
            ctx.scale(dpi, dpi);
        }

        // Adjust the canvas size initially and on window resize
        adjustCanvasSize();
        window.addEventListener('resize', function () {
            adjustCanvasSize();
            init(); // Re-initialize particles to fit resized canvas
        });

        const particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 150 // Radius of the mouse interaction
        };

        // Event Listener for Mouse Movement
        window.addEventListener('mousemove', function (event) {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });

        // Particle Constructor
        function Particle(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;

            // Adjust size based on screen width for clarity on smaller screens
            this.size = window.innerWidth < 768 ? size * 0.7 : size;
            this.color = color;
        }

        // Draw Method for Particles
        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#e6e6e6'; // Light grey color for the dots
            ctx.fill();
        };

        // Update Particle Positions and Avoid Mouse
        Particle.prototype.update = function () {
            // Check if the particles are within the canvas
            if (this.x > canvas.width / dpi || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height / dpi || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Check mouse-particle interaction (move particles away from the mouse)
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5; // Push particle away from mouse
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

            // Move particles by their direction
            this.x += this.directionX;
            this.y += this.directionY;

            // Draw particles
            this.draw();
        };

        // Create Particles
        function init() {
            particlesArray.length = 0;
            let numberOfParticles = (canvas.width * canvas.height) / (9000 * dpi); // Adjust number based on DPI
            for (let i = 0; i < numberOfParticles; i++) {
                let size = Math.random() * 5 + 1;
                let x = Math.random() * (innerWidth - size * 2) + size;
                let y = Math.random() * (innerHeight - size * 2) + size;
                let directionX = (Math.random() * 0.2) - 0.1;
                let directionY = (Math.random() * 0.2) - 0.1;
                let color = '#8c5523'; // Dark grey for the lines

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Draw lines between particles
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                 + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(200, 200, 200, ${opacityValue})`; // Dark grey for lines
                        ctx.lineWidth = dpi > 1 ? 1.5 : 1; // Adjust line width for DPI
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width / dpi, canvas.height / dpi);

            // Draw particles and their lines
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect(); // Draw lines between particles after updating them
        }

        // Initial Setup
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
