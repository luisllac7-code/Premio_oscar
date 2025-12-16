document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations (IntersectionObserver)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe specific sections
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(section => {
        observer.observe(section);
    });

    // 2. Search Functionality (for index.html)
    const searchInput = document.getElementById('category-search');
    const categoriesContainer = document.querySelector('.categories');

    if (searchInput && categoriesContainer) {
        const categories = Array.from(categoriesContainer.querySelectorAll('.category'));

        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            categories.forEach(category => {
                const text = category.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    category.style.display = 'block';
                    // Re-trigger animation could be nice here, but simple usage first
                    category.classList.add('is-visible');
                } else {
                    category.style.display = 'none';
                }
            });
        });
    }

    // 3. Back to Top Button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.innerHTML = '&#8679;'; // Up arrow
    backToTopButton.title = 'Volver arriba';
    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 4. Stagger Animations for properties that are lists
    // Helper to add stagger delay to children if they have the 'stagger-item' class
    const staggerGroups = document.querySelectorAll('.nominations, .categories');
    staggerGroups.forEach(group => {
        const children = group.children;
        Array.from(children).forEach((child, index) => {
            child.classList.add('stagger-item');
            child.style.transitionDelay = `${index * 50}ms`; // 50ms delay per item
            observer.observe(child);
        });
    });
});
