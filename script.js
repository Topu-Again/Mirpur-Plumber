/**
 * মিরপুর প্লাম্বার সার্ভিস - প্রোডাকশন জেএস
 * পারফরম্যান্স, এক্সেসিবিলিটি এবং উচ্চ রূপান্তরের জন্য তৈরি
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ১. মোবাইল নেভিগেশন মেনু টগল
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav__link');

  const toggleMenu = () => {
    const isOpen = hamburger.classList.toggle('is-active');
    navMenu.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
  }

  // লিংকে ক্লিক করলে নেভিগেশন বন্ধ হবে
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // ২. হেডার স্ক্রোল শ্যাডো এবং স্ক্রোল প্রোগ্রেস ইন্ডিকেটর
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // হেডার শ্যাডো ট্রানজিশন
    if (scrollTop > 20) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }

    // স্ক্রোল প্রোগ্রেস বার
    if (scrollProgress && docHeight > 0) {
      const progress = (scrollTop / docHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // ৩. অ্যাক্টিভ নেভিগেশন হাইলাইট করার জন্য স্ক্রোলস্পাই
  const sections = document.querySelectorAll('section[id]');

  const scrollSpy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav__list a[href*="#${sectionId}"]`);

      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', scrollSpy);

  // ৪. স্ক্রোল রিভিল অ্যানিমেশন (ইন্টারসেকশন অবজারভার)
  const fadeUpElements = document.querySelectorAll('.fade-up');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  fadeUpElements.forEach(el => revealObserver.observe(el));

  // ৫. হিরো ম্যাট্রিক্সের জন্য কাউন্টার অ্যানিমেশন
  const counters = document.querySelectorAll('.metric__number');
  let animatedCounters = false;

  const animateCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const speed = 200;
      const increment = target / speed;

      const updateCount = () => {
        const count = +counter.innerText;
        if (count < target) {
          counter.innerText = Math.ceil(count + increment);
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
  };

  const heroMetricsSection = document.querySelector('.hero__metrics');
  if (heroMetricsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !animatedCounters) {
        animatedCounters = true;
        animateCounters();
      }
    }, { threshold: 0.5 });

    counterObserver.observe(heroMetricsSection);
  }

  // ৬. অ্যাকর্ডিয়ন (FAQ)
  const accordionHeaders = document.querySelectorAll('.accordion__header');

  accordionHeaders.forEach(headerBtn => {
    headerBtn.addEventListener('click', () => {
      const item = headerBtn.parentElement;
      const content = headerBtn.nextElementSibling;
      const isOpen = item.classList.contains('is-open');

      // সকল সচল আইটেম বন্ধ করুন
      document.querySelectorAll('.accordion__item').forEach(accItem => {
        accItem.classList.remove('is-open');
        const accHeader = accItem.querySelector('.accordion__header');
        const accContent = accItem.querySelector('.accordion__content');
        if (accHeader) accHeader.setAttribute('aria-expanded', 'false');
        if (accContent) accContent.hidden = true;
      });

      // ক্লিক করা আইটেম টগল করুন
      if (!isOpen) {
        item.classList.add('is-open');
        headerBtn.setAttribute('aria-expanded', 'true');
        content.hidden = false;
      }
    });
  });

  // ৭. টেস্টিমোনিয়াল স্লাইডার
  const sliderTrack = document.querySelector('.testimonial-slider__track');
  const slides = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('sliderDots');

  if (sliderTrack && slides.length > 0) {
    let currentIndex = 0;

    // ডট ইন্ডিকেটর তৈরি করা
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    const updateDots = () => {
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = index;
      sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDots();
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(currentIndex);
      });
    }

    // অটো অ্যাডভান্স টেস্টিমোনিয়াল
    setInterval(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      goToSlide(currentIndex);
    }, 6000);
  }
});