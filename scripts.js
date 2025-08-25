document.addEventListener('DOMContentLoaded', function() {
    // Typing Animation
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    if (typedTextSpan && cursorSpan) {
        const textArray = ["Frontend Developer", "Designer", "Programmer", "Tech Enthusiast"];
        const typingDelay = 100;
        const erasingDelay = 50;
        const newTextDelay = 1000;
        let textArrayIndex = 0;
        let charIndex = 0;

        function type() {
            if (charIndex < textArray[textArrayIndex].length) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                setTimeout(erase, newTextDelay);
            }
        }

        function erase() {
            if (charIndex > 0) {
                if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
                typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingDelay);
            } else {
                cursorSpan.classList.remove("typing");
                textArrayIndex++;
                if (textArrayIndex >= textArray.length) textArrayIndex = 0;
                setTimeout(type, typingDelay + 500);
            }
        }

        setTimeout(type, newTextDelay + 250);
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNavLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (menuToggle && mobileNavLinks) {
        menuToggle.addEventListener('click', function() {
            mobileNavLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (mobileNavLinks.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close menu when clicking on a link
        mobileNavLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileNavLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileNavLinks.contains(event.target) && !menuToggle.contains(event.target)) {
                mobileNavLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                mobileNavLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Navigation Activation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : 80; // Fallback to 80px if header not found
    const contactSection = document.getElementById('contact');

    // Function to update active nav link
    function setActiveNav(id) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            }
        });
    }

    // Improved scroll detection with special handling for contact section
    function handleScroll() {
        const scrollPosition = window.scrollY + headerHeight + 100;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.offsetHeight;

        // Special handling for contact section when at bottom of page
        if (window.scrollY + windowHeight >= documentHeight - 100) {
            setActiveNav('contact');
            return;
        }

        // Check all sections
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });

        if (currentSection) {
            setActiveNav(currentSection);
        }
    }

    // Intersection Observer as fallback
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                setActiveNav(id);
            }
        });
    }, observerOptions);

    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                setActiveNav(targetId);
                window.scrollTo({
                    top: targetSection.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize and set up event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleScroll);
    handleScroll(); // Run once on load

    // Handle window resize for mobile menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (mobileNavLinks) {
                mobileNavLinks.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            body.style.overflow = '';
        }
    });

    // EmailJS Configuration and Contact Form Handling
    (function() {
        // Initialize EmailJS with your public key
        emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your actual EmailJS public key
        
        const contactForm = document.getElementById('contactForm');
        const formStatus = document.getElementById('formStatus');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    subject: document.getElementById('subject').value,
                    message: document.getElementById('message').value
                };
                
                // Show loading state
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Send email using EmailJS
                emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
                    to_email: 'gaensubhankar@gmail.com',
                    from_name: formData.name,
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.message
                })
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success popup
                    showSuccessPopup();
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Update form status
                    formStatus.innerHTML = '<span style="color: #09fb01;">✓ Message sent successfully!</span>';
                    formStatus.style.display = 'block';
                    
                    // Hide status after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                })
                .catch(function(error) {
                    console.log('FAILED...', error);
                    
                    // Show error message
                    formStatus.innerHTML = '<span style="color: #ff5555;">✗ Failed to send message. Please try again.</span>';
                    formStatus.style.display = 'block';
                    
                    // Hide status after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                })
                .finally(function() {
                    // Reset button state
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            });
        }
    })();
});

// Popup Functions
function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closePopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Close popup when clicking outside
document.addEventListener('click', function(event) {
    const popup = document.getElementById('successPopup');
    if (popup && event.target === popup) {
        closePopup();
    }
});

// Close popup with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closePopup();
    }
});
