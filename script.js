document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('interactive-canvas');

    if (canvas) {
        const ctx = canvas.getContext('2d');
        const dpi = window.devicePixelRatio || 1;

        const particlesArray = [];
        const mouse = {
            x: null,
            y: null,
            radius: 150,
        };

        const isMobile = window.innerWidth <= 768;

        function adjustCanvasSize() {
            canvas.width = window.innerWidth * dpi;
            canvas.height = window.innerHeight * dpi;
            ctx.scale(dpi, dpi);
        }

        adjustCanvasSize();
        window.addEventListener('resize', function () {
            adjustCanvasSize();
            if (!isMobile) init();
        });

        function Particle(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#e6e6e6';
            ctx.fill();
        };

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

        function init() {
            particlesArray.length = 0;
            const numberOfParticles = isMobile
                ? (canvas.width * canvas.height) / (27000 * dpi)
                : (canvas.width * canvas.height) / (9000 * dpi);

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 5 + 1;
                const x = Math.random() * (canvas.width / dpi - size * 2) + size;
                const y = Math.random() * (canvas.height / dpi - size * 2) + size;
                const directionX = (Math.random() * 0.2) - 0.1;
                const directionY = (Math.random() * 0.2) - 0.1;
                const color = '#8c5523';

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const distance = ((particlesArray[a].x - particlesArray[b].x) ** 2)
                                   + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                        const opacityValue = 1 - distance / 20000;
                        ctx.strokeStyle = `rgba(200, 200, 200, ${opacityValue})`;
                        ctx.lineWidth = dpi > 1 ? 1.5 : 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width / dpi, canvas.height / dpi);
            particlesArray.forEach(particle => particle.update());
            connect();
        }

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

window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    const banner = document.querySelector('.header-banner');
    const bannerLogo = document.querySelector('#banner-logo');

    const maxHeaderHeight = 80;
    const minHeaderHeight = 50;

    const scrollY = window.scrollY;

    let newHeaderHeight = maxHeaderHeight - (scrollY / 10);

    if (newHeaderHeight <= minHeaderHeight) {
        newHeaderHeight = minHeaderHeight;
        header.style.display = 'none';
        banner.style.display = 'block';
        bannerLogo.setAttribute('src', 'images/logo2.png');
    } else {
        header.style.display = 'flex';
        banner.style.display = 'none';
        header.style.height = `${newHeaderHeight}px`;
    }
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const firstSection = document.querySelector('.section-first');
    
    if (header && firstSection) {
        const headerHeight = header.offsetHeight;
        firstSection.style.paddingTop = (headerHeight + 20) + 'px';
    }
});

document.querySelector('.hamburger').addEventListener('click', function() {
    document.querySelector('header').classList.toggle('nav-expanded');
});

document.querySelector('.hamburger').addEventListener('click', function () {
    document.querySelector('.mobile-nav').classList.toggle('active');
});

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('open');
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

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

    function addActiveClass(element, delay) {
        if (element) {
            setTimeout(() => {
                element.classList.add("active");
            }, delay);
        }
    }

    addActiveClass(heroSection, 0);

    addActiveClass(heroHeading, 500);
    addActiveClass(heroText, 1500);
    addActiveClass(heroBtn, 1500);
    addActiveClass(heroProjects, 2800);

    projectTitles.forEach((title, index) => {
        addActiveClass(title, 3100 + (index * 300));
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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.25
    });

    hiddenElements.forEach(element => {
        observer.observe(element);
    });

    if (window.location.pathname === "/" || window.location.pathname.endsWith("index.html")) {
        setTimeout(() => {
            header.classList.add("visible");
        }, 2800);
    } else {
        header.classList.add("static");
    }
});
