/* =============================================
   JUNGLE HAVEN — JAVASCRIPT
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------
     1. NAVBAR: Scroll style + active section highlight
  ----------------------------------------------- */
  const mainNav    = document.getElementById('mainNav');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled style
    if (window.scrollY > 60) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }

    // Active nav highlight
    let currentSection = '';
    sections.forEach(sec => {
      const sectionTop = sec.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentSection = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active-nav');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active-nav');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* -----------------------------------------------
     2. SMOOTH SCROLL for nav links
  ----------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Close mobile navbar if open
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse);
        bsCollapse.hide();
      }

      const offset = mainNav.offsetHeight + 8;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* -----------------------------------------------
     3. FADE-IN SECTIONS on scroll (IntersectionObserver)
  ----------------------------------------------- */
  const fadeSections = document.querySelectorAll('.fade-in-section');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
  );

  fadeSections.forEach(sec => observer.observe(sec));


  /* -----------------------------------------------
     4. STAGGERED CARD ANIMATIONS
  ----------------------------------------------- */
  const cardGroups = document.querySelectorAll(
    '.target-card, .marketing-card, .culture-card, .mv-card'
  );

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity   = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (entry.target.dataset.delay || 0) * 1);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // Assign stagger delays
  document.querySelectorAll('.row').forEach(row => {
    const cards = row.querySelectorAll(
      '.target-card, .marketing-card, .culture-card, .mv-card'
    );
    cards.forEach((card, index) => {
      card.style.opacity   = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.55s ease ${index * 100}ms, transform 0.55s ease ${index * 100}ms`;
      card.dataset.delay = index * 100;
      cardObserver.observe(card);
    });
  });


  /* -----------------------------------------------
     5. CONTACT FORM SUBMIT
  ----------------------------------------------- */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      // Loading state
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Sending…';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check me-2"></i> Sent!';
        btn.style.background = '#16a34a';
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeUp 0.5s ease forwards';
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.disabled = false;
          formSuccess.style.display = 'none';
        }, 4000);
      }, 1400);
    });
  }


  /* -----------------------------------------------
     6. BUTTON RIPPLE EFFECT
  ----------------------------------------------- */
  document.querySelectorAll('.btn-primary-jungle').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position: absolute;
        width: 200px;
        height: 200px;
        left: ${x - 100}px;
        top: ${y - 100}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
        z-index: 2;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);


  /* -----------------------------------------------
     7. COUNTER ANIMATION for stat numbers
  ----------------------------------------------- */
  const statItems = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el   = entry.target;
        const text = el.textContent.trim();
        const num  = parseFloat(text.replace(/[^0-9.]/g, ''));

        if (!isNaN(num) && num > 0) {
          let start     = 0;
          const end     = num;
          const suffix  = text.replace(/[0-9.]/g, '');
          const dur     = 1400;
          const step    = 16;
          const steps   = dur / step;
          const inc     = end / steps;

          const timer = setInterval(() => {
            start += inc;
            if (start >= end) {
              el.textContent = Number.isInteger(end) ? end + suffix : end + suffix;
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(start) + suffix;
            }
          }, step);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statItems.forEach(el => counterObserver.observe(el));


  /* -----------------------------------------------
     8. NAVBAR CLOSE on mobile link click
  ----------------------------------------------- */
  const navbarCollapse = document.getElementById('navbarNav');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsNav = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
        bsNav.hide();
      }
    });
  });


  /* -----------------------------------------------
     9. HERO parallax effect (subtle)
  ----------------------------------------------- */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroSection.style.backgroundPositionY = `${50 + scrollY * 0.025}%`;
      }
    }, { passive: true });
  }


  /* -----------------------------------------------
     10. GOALS ITEMS stagger on visibility
  ----------------------------------------------- */
  document.querySelectorAll('.goals-list li').forEach((li, i) => {
    li.style.opacity   = '0';
    li.style.transform = 'translateX(-20px)';
    li.style.transition = `opacity 0.5s ease ${i * 120}ms, transform 0.5s ease ${i * 120}ms`;

    const liObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity   = '1';
          entry.target.style.transform = 'translateX(0)';
          liObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    liObs.observe(li);
  });

});
