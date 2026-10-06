/* ── Mobile nav toggle ── */
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.menu-toggle');

if (toggle) {
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });
}

/* ── Active nav link ── */
document.querySelectorAll('.nav a').forEach(a => {
  if (a.dataset.page === document.body.dataset.page) {
    a.classList.add('active');
  }
});

/* ── Cart counter (persisted via sessionStorage) ── */
let count = Number(sessionStorage.getItem('flameCart') || 0);
const countEls = document.querySelectorAll('.cart-count');

function paintCart() {
  countEls.forEach(el => {
    el.textContent = count;
    el.hidden = count === 0;
  });
}

paintCart();

document.querySelectorAll('.add').forEach(button => {
  button.addEventListener('click', () => {
    count++;
    sessionStorage.setItem('flameCart', String(count));
    paintCart();

    // Brief confirmation tick
    button.textContent = '✓';
    setTimeout(() => (button.textContent = '+'), 700);
  });
});

/* ── Menu category filters ── */
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    // Show / hide cards
    const selected = button.dataset.filter;
    document.querySelectorAll('.menu-card').forEach(card => {
      card.hidden = selected !== 'All' && card.dataset.category !== selected;
    });
  });
});

/* ── Contact form submission ── */
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const result = form.querySelector('.success');
    if (result) {
      result.hidden = false;
      form.reset();
    }
  });
});
