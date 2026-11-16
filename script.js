document.documentElement.classList.add('js');

const menuToggle = document.getElementById('menuToggle');
const primaryNav = document.getElementById('primaryNav');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const scrollProgress = document.querySelector('.scroll-progress');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const formError = document.getElementById('formError');

menuToggle.addEventListener('click', function() {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    primaryNav.classList.toggle('is-open', !isExpanded);
});

primaryNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
    });
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('is-open');
        menuToggle.focus();
    }
});

themeToggle.addEventListener('click', function() {
    const isDark = document.body.dataset.theme !== 'dark';
    document.body.dataset.theme = isDark ? 'dark' : 'light';
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
});

backToTop.addEventListener('click', function() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    window.scrollTo({ top: 0, behavior: behavior });
});

function updateScrollUI() {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
    backToTop.classList.toggle('is-visible', window.scrollY > 400);
}

let scrollUpdatePending = false;
window.addEventListener('scroll', function() {
    if (!scrollUpdatePending) {
        window.requestAnimationFrame(function() {
            updateScrollUI();
            scrollUpdatePending = false;
        });
        scrollUpdatePending = true;
    }
}, { passive: true });

updateScrollUI();

const revealSections = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealSections.forEach(function(section) {
        revealObserver.observe(section);
    });
} else {
    revealSections.forEach(function(section) {
        section.classList.add('is-visible');
    });
}

contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const messageField = document.getElementById('message');
    const name = nameField.value.trim();
    const email = emailField.value.trim();
    const message = messageField.value.trim();

    if (!name || !email || !message) {
        formError.textContent = 'Please fill in all fields.';
        [nameField, emailField, messageField].find(function(field) {
            return !field.value.trim();
        }).focus();
        return;
    }

    if (!validateEmail(email)) {
        formError.textContent = 'Please enter a valid email address.';
        emailField.focus();
        return;
    }

    formError.textContent = '';
    successMessage.textContent = 'Thanks, ' + name + '! Your message passed the form checks. This demo does not send messages yet.';
    successMessage.style.display = 'block';
    contactForm.reset();
});

contactForm.addEventListener('input', function() {
    formError.textContent = '';
    successMessage.style.display = 'none';
});

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
