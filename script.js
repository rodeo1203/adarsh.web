// Global variables
let darkMode = false;
let currentSection = 'hero';
let lastScrollPosition = 0;
const sections = ['hero', 'about', 'featured', 'portfolio', 'blog', 'contact'];



// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const quantCloud = document.getElementById('quant-cloud');
    const creativeCloud = document.getElementById('creative-cloud');
    const heroSection = document.getElementById('home');
    
    // Initial position - slightly inward
    quantCloud.style.transform = 'translateX(20px)';
    creativeCloud.style.transform = 'translateX(-20px)';
    
    // After a short delay, move clouds outward
    setTimeout(() => {
        quantCloud.style.transform = 'translateX(-20px)';
        creativeCloud.style.transform = 'translateX(20px)';
    }, 500);
    
    // Hover effect
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const heroRect = heroSection.getBoundingClientRect();
            const heroCenter = heroRect.left + heroRect.width / 2;
            
            // Calculate how far from center the mouse is
            const distanceFromCenter = e.clientX - heroCenter;
            
            // Apply transform based on mouse position
            if (distanceFromCenter < 0) { // Left side
                // Mouse is on the left side, move the left cloud up
                const moveAmount = Math.min(Math.abs(distanceFromCenter) / 30, 15);
                quantCloud.style.transform = `translateY(-${moveAmount}px) translateX(-20px)`;
                creativeCloud.style.transform = 'translateX(20px)'; // Reset right cloud
            } else { // Right side
                // Mouse is on the right side, move the right cloud up
                const moveAmount = Math.min(distanceFromCenter / 30, 15);
                creativeCloud.style.transform = `translateY(-${moveAmount}px) translateX(20px)`;
                quantCloud.style.transform = 'translateX(-20px)'; // Reset left cloud
            }
        });
        
        // Reset positions when mouse leaves the section
        heroSection.addEventListener('mouseleave', function() {
            quantCloud.style.transform = 'translateX(-20px)';
            creativeCloud.style.transform = 'translateX(20px)';
        });
    } else {
        console.error("Hero section with ID 'home' not found!");
    }

    // Update the current year in the footer copyright
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Initialize the background animation
    initBackgroundAnimation();
    
    // Setup navigation and scrolling
    setupNavigation();
    
    // Setup scroll event listener for section detection
    window.addEventListener('scroll', handleScroll);
    
    // Initial check for current section
    checkCurrentSection();
     
    // Typewriter effect for quant
    const typewriterElement = document.querySelector('.typewriter-text');
    const textToType = "quant";
    let charIndex = 0;
    
    // Make sure the element exists
    if (typewriterElement) {
        // Initialize with empty text
        typewriterElement.textContent = '';
        
        function typeChar() {
            if (charIndex < textToType.length) {
                typewriterElement.textContent += textToType.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 150); // slightly slower for better visibility
            }
        }
        
        // Start the typing effect
        setTimeout(typeChar, 500); // Small delay before starting
    } else {
        console.error('Typewriter element not found!');
    }

    const slides = document.querySelectorAll('.portfolio-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    let currentSlide = 0;
    
    // Function to show a specific slide
    function showSlide(index) {
        // 1) toggle slides + bottom dots
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    
        // 2) **sync the top filters** to the same category
        const newCat = slides[index].dataset.category;
        document.querySelectorAll('.portfolio-filter').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.category === newCat);
        });
    }
    
    
    // Event listeners for arrows
    if (prevArrow) {
        prevArrow.addEventListener('click', function() {
            let newIndex = currentSlide - 1;
            if (newIndex < 0) {
                newIndex = slides.length - 1;
            }
            showSlide(newIndex);
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', function() {
            let newIndex = currentSlide + 1;
            if (newIndex >= slides.length) {
                newIndex = 0;
            }
            showSlide(newIndex);
        });
    }
    
    // Event listeners for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            showSlide(index);
        });
    });
    
    // Initialize with the first slide (quant)
    showSlide(0);

    // Contact form submit via Formspree
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();
        formResponse.textContent = 'Sending…';
        const url = contactForm.action;
        const formData = new FormData(contactForm);

        try {
        const res = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
            formResponse.textContent = 'Thanks! Your message has been sent.';
            contactForm.reset();
        } else {
            const data = await res.json();
            formResponse.textContent = data.error || 'Oops—there was a problem sending your message.';
        }
        } catch (err) {
        formResponse.textContent = 'Network error. Please try again later.';
        }
    });
    }

    
});



// Setup navigation links
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').replace('#', '');
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update navigation state
                updateActiveNavLink(targetId);
            }
        });
    });
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkTarget = link.getAttribute('href').replace('#', '');
        if (linkTarget === sectionId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Handle scroll events
function handleScroll() {
    // Throttle scroll events
    if (!window.requestAnimationFrame) {
        checkCurrentSection();
    } else {
        window.requestAnimationFrame(checkCurrentSection);
    }
    
    // Detect scroll direction
    const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    const scrollingDown = currentScrollPosition > lastScrollPosition;
    lastScrollPosition = currentScrollPosition;
    
    // Toggle dark/light mode based on section changes
    if (scrollingDown && currentScrollPosition > window.innerHeight / 2) {
        toggleDarkMode(true); // Enable dark mode when scrolling down past the first section midpoint
    } else if (!scrollingDown && currentScrollPosition < window.innerHeight / 2) {
        toggleDarkMode(false); // Disable dark mode when scrolling up to the top section
    }
}

// Check which section is currently in view
function checkCurrentSection() {
    // Get all section elements
    const sectionsElements = [];
    sections.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            sectionsElements.push(element);
        }
    });
    
    // // Find the section that takes most of the viewport
    // let maxVisibleSection = null;
    // let maxVisibleAmount = 0;
    
    // sectionsElements.forEach(section => {
    //     const rect = section.getBoundingClientRect();
    //     const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        
    //     if (visibleHeight > maxVisibleAmount) {
    //         maxVisibleAmount = visibleHeight;
    //         maxVisibleSection = section.id;
    //     }
    // });
    
    // // Update current section if changed
    // if (maxVisibleSection && maxVisibleSection !== currentSection) {
    //     currentSection = maxVisibleSection;
    //     updateActiveNavLink(currentSection);
        
    //     // Toggle dark mode based on section index
    //     const sectionIndex = sections.indexOf(currentSection);
    //     if (sectionIndex % 2 !== 0) { // Odd index sections get dark mode
    //         toggleDarkMode(true);
    //     } else { // Even index sections get light mode
    //         toggleDarkMode(false);
    //     }
    // }
}

const portfolioFilters = document.querySelectorAll('.portfolio-filter');
const portfolioSlides = document.querySelectorAll('.portfolio-slide');

// Add click event to each filter
portfolioFilters.forEach(filter => {
  filter.addEventListener('click', function() {
    // Remove active class from all filters
    portfolioFilters.forEach(f => f.classList.remove('active'));
    // Add active class to clicked filter
    this.classList.add('active');
    
    // Get the category
    const category = this.getAttribute('data-category');
    
    // Hide all slides
    portfolioSlides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show the slide with matching category
    const slideToShow = document.querySelector(`.portfolio-slide[data-category="${category}"]`);
    if (slideToShow) {
      slideToShow.classList.add('active');
    }
  });
});

// Toggle dark/light mode
function toggleDarkMode(enable) {
    // Only process if we're changing the mode
    if (darkMode !== enable) {
        darkMode = enable;
        
        // Toggle body class for dark mode
        document.body.classList.toggle('dark-mode', darkMode);
        
        // Notify the background animation of the mode change
        updateBackgroundMode(darkMode);
    }
}

// Update background animation mode
function updateBackgroundMode(isDarkMode) {
    // This will be used by the background animation to adjust colors
    window.isDarkMode = isDarkMode;
}

// Background Animation with moving shapes
function initBackgroundAnimation() {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let shapes = [];
    const numberOfShapes = 40;
    const middleX = window.innerWidth / 2;
    
    // Initialize the dark mode flag for the background
    window.isDarkMode = false;

    // Resize function for canvas
    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // Create Shape class
    class Shape {
        constructor() {
            this.reset();
        }

        reset() {
            // Random position
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            
            // Random velocity
            this.vx = (Math.random() - 0.5) ;
            this.vy = (Math.random() - 0.5) ;
            
            // Random size
            this.size = Math.random() * 30 + 10;
            
            // Random shape type (0: circle, 1: square, 2: triangle)
            this.type = Math.floor(Math.random() * 2);
            
            // CHANGED: Initial colors based on starting position - flipped logic
            // Right side is now colorful, left side is black and white
            if (this.x > middleX) {
                // Right side - colorful
                this.colorSet = {
                    r: Math.floor(Math.random() * 200 + 55),
                    g: Math.floor(Math.random() * 200 + 55),
                    b: Math.floor(Math.random() * 200 + 55),
                    a: Math.random() * 0.5 + 0.2
                };
            } else {
                // Left side - black and white
                const gray = Math.floor(Math.random() * 200);
                this.colorSet = {
                    r: gray,
                    g: gray,
                    b: gray,
                    a: Math.random() * 0.5 + 0.2
                };
            }
            
            // Target colors (will be updated as shape moves)
            this.targetColorSet = Object.assign({}, this.colorSet);
            
            // Color transition speed
            this.colorTransitionSpeed = 0.05;
        }

        // Update shape position and appearance
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Adjust appearance based on dark/light mode
            this.updateColors();
            
            // Reset if out of bounds
            if (this.x < -this.size || this.x > width + this.size || 
                this.y < -this.size || this.y > height + this.size) {
                this.reset();
            }
        }
        
        // Update colors based on position and dark/light mode
        updateColors() {
            // CHANGED: Handle color transition based on position and dark mode - flipped logic
            // Right side is now colorful, left side is black and white
            if (this.x > middleX) {
                // Moving to right side - colorful
                if (window.isDarkMode) {
                    // Dark mode - more subdued colors
                    if (this.targetColorSet.r === this.targetColorSet.g && this.targetColorSet.g === this.targetColorSet.b) {
                        this.targetColorSet = {
                            r: Math.floor(Math.random() * 100 + 20),
                            g: Math.floor(Math.random() * 100 + 20),
                            b: Math.floor(Math.random() * 150 + 50),
                            a: this.colorSet.a
                        };
                    }
                } else {
                    // Light mode - bright colors
                    if (this.targetColorSet.r === this.targetColorSet.g && this.targetColorSet.g === this.targetColorSet.b) {
                        this.targetColorSet = {
                            r: Math.floor(Math.random() * 200 + 55),
                            g: Math.floor(Math.random() * 200 + 55),
                            b: Math.floor(Math.random() * 200 + 55),
                            a: this.colorSet.a
                        };
                    }
                }
            } else {
                // Moving to left side - always black and white
                const targetGray = window.isDarkMode ? 
                    Math.floor(Math.random() * 100) : // Darker grays in dark mode
                    Math.floor(Math.random() * 200);  // Lighter grays in light mode
                
                this.targetColorSet = {
                    r: targetGray,
                    g: targetGray,
                    b: targetGray,
                    a: this.colorSet.a
                };
            }
            
            // Gradually transition colors
            this.colorSet.r += (this.targetColorSet.r - this.colorSet.r) * this.colorTransitionSpeed;
            this.colorSet.g += (this.targetColorSet.g - this.colorSet.g) * this.colorTransitionSpeed;
            this.colorSet.b += (this.targetColorSet.b - this.colorSet.b) * this.colorTransitionSpeed;
        }

        // Draw the shape
        draw() {
            const color = `rgba(${Math.floor(this.colorSet.r)}, 
                               ${Math.floor(this.colorSet.g)}, 
                               ${Math.floor(this.colorSet.b)}, 
                               ${this.colorSet.a})`;
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            
            switch (this.type) {
                case 0: // Circle
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1: // Square
                    ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
                    break;
                case 2: // Triangle
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y - this.size/2);
                    ctx.lineTo(this.x + this.size/2, this.y + this.size/2);
                    ctx.lineTo(this.x - this.size/2, this.y + this.size/2);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
        }
    }

    // Initialize shapes
    function initShapes() {
        shapes = [];
        for (let i = 0; i < numberOfShapes; i++) {
            shapes.push(new Shape());
        }
    }

    // Animation loop
    function animate() {
        // Clear canvas with a background that depends on dark mode
        ctx.fillStyle = window.isDarkMode ? 'rgba(20, 20, 35, 0.3)' : 'rgba(245, 245, 245, 0.3)';
        ctx.fillRect(0, 0, width, height);
        
        // Update and draw shapes
        shapes.forEach(shape => {
            shape.update();
            shape.draw();
        });
        
        // Continue animation
        requestAnimationFrame(animate);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // Initialize
    resizeCanvas();
    initShapes();
    animate();
}