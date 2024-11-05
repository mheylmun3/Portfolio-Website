document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('interactive-canvas');

    // Check if the canvas exists (only run the script if it exists)
    if (canvas) {
        const ctx = canvas.getContext('2d');

        // Adjust canvas size to fit the window
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

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

        // Event Listener for window resize to recalculate canvas size
        window.addEventListener('resize', function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            init(); // Re-initialize particles to fit resized canvas
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
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
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
            let numberOfParticles = (canvas.width * canvas.height) / 9000;
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

        // Draw lines between particles (optional, for web effect)
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                                 + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = 'rgba(200, 200, 200,' + opacityValue + ')'; // Dark grey for lines
                        ctx.lineWidth = 1;
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
            ctx.clearRect(0, 0, innerWidth, innerHeight);

            // Draw particles and their lines
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect(); // Draw lines between particles after updating them (optional)
        }

        // Initial Setup
        init();
        animate();
    } else {
        console.log("No canvas element found. Skipping particle animation.");
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
