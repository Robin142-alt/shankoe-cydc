/**
 * Shankoe Methodist Child and Youth Development Centre (Shankoe CYDC)
 * Main Interactive Logic & Client Presentation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initDemoControls();
  initFilters();
  initStoryModals();
  initForms();
  initToCInteractive();
  setActiveNavLink();
});

/* -------------------------------------------------------------
 * 1. Mobile Navigation & Drawer
 * ------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
}

/* -------------------------------------------------------------
 * 2. Active Nav Link Detection
 * ------------------------------------------------------------- */
function setActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* -------------------------------------------------------------
 * 3. Client Presentation & Demo Controls
 * ------------------------------------------------------------- */
function initDemoControls() {
  const toggleBtn = document.getElementById('togglePlaceholdersBtn');
  if (!toggleBtn) return;

  let isHighlighted = false;

  toggleBtn.addEventListener('click', () => {
    isHighlighted = !isHighlighted;
    document.body.classList.toggle('highlight-placeholders', isHighlighted);
    
    if (isHighlighted) {
      toggleBtn.textContent = 'Hide Placeholders';
      toggleBtn.style.background = '#059669';
      showToast('Client Review Mode', 'Orange indicators highlight data to be updated with Shankoe CYDC records.');
    } else {
      toggleBtn.textContent = 'Review Placeholders';
      toggleBtn.style.background = 'var(--accent-amber)';
      showToast('Standard View', 'Displaying the clean public website view.');
    }
  });
}

/* -------------------------------------------------------------
 * 4. Program & Content Filters
 * ------------------------------------------------------------- */
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (!filterBtns.length || !filterItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      filterItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterVal === 'all' || itemCategory === filterVal || (itemCategory && itemCategory.includes(filterVal))) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.35s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 5. Interactive Theory of Change (ToC) Visualizer
 * ------------------------------------------------------------- */
function initToCInteractive() {
  const tocSteps = document.querySelectorAll('.toc-step');
  if (!tocSteps.length) return;

  tocSteps.forEach(step => {
    step.addEventListener('mouseenter', () => {
      tocSteps.forEach(s => s.style.opacity = '0.7');
      step.style.opacity = '1';
    });
    step.addEventListener('mouseleave', () => {
      tocSteps.forEach(s => s.style.opacity = '1');
    });
  });
}

/* -------------------------------------------------------------
 * 6. Stories of Change Modal Preview
 * ------------------------------------------------------------- */
function initStoryModals() {
  const readMoreBtns = document.querySelectorAll('.read-story-btn');
  const modal = document.getElementById('storyModal');
  const modalClose = document.querySelector('.modal-close');
  const modalBackdrop = document.querySelector('.modal-backdrop');

  if (!readMoreBtns.length || !modal) return;

  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  readMoreBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const title = btn.getAttribute('data-story-title') || 'Story of Change';
      const category = btn.getAttribute('data-story-cat') || 'Community Impact';
      
      const modalTitle = document.getElementById('modalStoryTitle');
      const modalCat = document.getElementById('modalStoryCategory');
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalCat) modalCat.textContent = category;

      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------
 * 7. Interactive Form Submissions (Demo Handler)
 * ------------------------------------------------------------- */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  const partnerForm = document.getElementById('partnerInquiryForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]')?.value || 'Friend';
      showToast('Message Received', `Thank you ${name}. Shankoe CYDC has received your message and will respond shortly.`);
      contactForm.reset();
    });
  }

  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const org = partnerForm.querySelector('input[name="org"]')?.value || 'your organisation';
      showToast('Partnership Inquiry Sent', `Thank you for partnering with Shankoe CYDC. We will review collaboration with ${org}.`);
      partnerForm.reset();
    });
  }
}

/* -------------------------------------------------------------
 * 8. Notification Toast System
 * ------------------------------------------------------------- */
function showToast(title, message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <div class="toast-title"></div>
        <div class="toast-desc"></div>
      </div>
    `;
    document.body.appendChild(toast);
  }

  toast.querySelector('.toast-title').textContent = title;
  toast.querySelector('.toast-desc').textContent = message;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}
