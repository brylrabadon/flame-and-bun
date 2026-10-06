const dishes = [
  {id:'burger',    name:'DOUBLE BEEF BURGER',         price:12.99, category:'burgers',  tag:'BESTSELLER',           image:'burger',     description:'Two flame-grilled beef patties, melted cheddar, crisp lettuce and our signature sauce.'},
  {id:'pizza',     name:'PEPPERONI CHEESE PIZZA',      price:16.99, category:'pizza',    tag:'SPICE ROAD',           image:'pizza',      description:'Stone-baked dough, rich tomato sauce, stretchy mozzarella and pepperoni.'},
  {id:'chicken',   name:'CRISPY FRIED CHICKEN',        price:10.99, category:'chicken',  tag:'FAN FAVORITE',         image:'chicken',    description:'Golden, crunchy chicken with our bold eleven-spice seasoning.'},
  {id:'biryani',   name:'SIGNATURE CHICKEN BIRYANI',   price:13.99, category:'biryani',  tag:"CHEF'S PICK",          image:'biryani',    description:'Fragrant basmati rice, slow-cooked chicken and warming aromatic spices.'},
  {id:'hotdog',    name:'CLASSIC LOADED HOT DOG',      price:7.99,  category:'hotdogs',  tag:'THE CLASSIC',          image:'hotdog',     description:'A grilled frankfurter, soft fresh bun, mustard and all the good stuff.'},
  {id:'fries',     name:'CHEESY LOADED FRIES',         price:6.99,  category:'fries',    tag:'FULLY LOADED',         image:'fries',      description:'Golden fries topped with melted cheddar, crispy bacon and fresh herbs.'},
  {id:'quesadilla',name:'CHICKEN QUESADILLA',          price:8.99,  category:'specials', tag:"LET'S SPICE THINGS UP",image:'quesadilla', description:'Toasted tortillas filled with juicy chicken, cheese and fresh tomatoes.'}
];

let cart = [];
let pageIndex = 0;
let filter = 'all';
let search = '';
let toastTimer;

const grid = document.querySelector('#dish-grid');
const money = value => '$' + value.toFixed(2);

const notify = text => {
  const el = document.querySelector('#toast');
  el.textContent = text;
  el.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('visible'), 2500);
};

function imgSrc(image) {
  return 'images/' + image + '.' + (image === 'quesadilla' ? 'jpg' : 'png');
}

function renderDishes() {
  if (!grid) return;
  const matches = dishes.filter(d =>
    (filter === 'all' || d.category === filter) &&
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const visible = filter === 'all' && !search && grid.dataset.all !== 'true'
    ? matches.slice(pageIndex * 4, pageIndex * 4 + 4)
    : matches;
  grid.innerHTML = visible.length
    ? visible.map(d => `
        <article class="dish">
          <div class="dish-image">
            <span class="dish-tag">${d.tag}</span>
            <button class="favorite" aria-label="Save ${d.name}" aria-pressed="false">&#9825;</button>
            <img src="${imgSrc(d.image)}" alt="${d.name}" width="512" height="512" loading="lazy">
          </div>
          <div class="dish-info">
            <div class="dish-rating"><span class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span> 4.9 (128)</div>
            <h3>${d.name}</h3>
            <p class="dish-description">${d.description}</p>
            <div class="dish-bottom">
              <strong>${money(d.price)}<small>each</small></strong>
              <button class="add-button" data-add="${d.id}" aria-label="Add ${d.name} to order">+</button>
            </div>
          </div>
        </article>`).join('')
    : '<p class="no-results">No dishes found. Try another craving.</p>';
  document.querySelectorAll('.slider-indicator i').forEach((el, i) =>
    el.classList.toggle('active', i === pageIndex)
  );
}

function addToCart(id) {
  const dish = dishes.find(d => d.id === id);
  if (!dish) return;
  const existing = cart.find(d => d.id === id);
  if (existing) existing.quantity++;
  else cart.push({...dish, quantity: 1});
  renderCart();
  notify(dish.name.toLowerCase() + ' added to your order');
}

function renderCart() {
  document.querySelector('#cart-count').textContent = cart.reduce((n, d) => n + d.quantity, 0);
  document.querySelector('#cart-items').innerHTML = cart.length
    ? cart.map(d => `
        <div class="cart-row">
          <img src="${imgSrc(d.image)}" alt="" width="65" height="65">
          <div><h3>${d.name}</h3><p>${d.quantity} &times; ${money(d.price)}</p></div>
          <button class="remove" data-remove="${d.id}" aria-label="Remove ${d.name}">&times;</button>
        </div>`).join('')
    : '<p class="cart-empty">Your next favorite meal is waiting.</p>';
  document.querySelector('#cart-total').textContent = money(
    cart.reduce((n, d) => n + d.price * d.quantity, 0)
  );
}

document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const add = target.closest('[data-add]');
  if (add) addToCart(add.dataset.add);

  const remove = target.closest('[data-remove]');
  if (remove) {
    cart = cart.filter(d => d.id !== remove.dataset.remove);
    renderCart();
  }

  const favorite = target.closest('.favorite');
  if (favorite) {
    const saved = favorite.getAttribute('aria-pressed') !== 'true';
    favorite.setAttribute('aria-pressed', String(saved));
    favorite.textContent = saved ? '\u2665' : '\u2661';
  }

  const category = target.closest('[data-category]');
  if (category) {
    if (!grid) {
      location.href = 'menu.html?category=' + encodeURIComponent(category.dataset.category);
      return;
    }
    filter = category.dataset.category;
    search = '';
    pageIndex = 0;
    document.querySelectorAll('.category').forEach(el =>
      el.classList.toggle('selected', el === category)
    );
    renderDishes();
    document.querySelector('#menu').scrollIntoView({behavior: 'smooth'});
  }

  if (target.closest('#full-menu')) {
    filter = 'all';
    search = '';
    pageIndex = 0;
    document.querySelectorAll('.category').forEach(el => el.classList.remove('selected'));
    renderDishes();
    document.querySelector('#menu').scrollIntoView({behavior: 'smooth'});
  }

  if (target.closest('#next-dishes') || target.closest('#previous-dishes')) {
    filter = 'all';
    search = '';
    pageIndex = pageIndex === 0 ? 1 : 0;
    renderDishes();
  }

  if (target.closest('#cart-open')) {
    document.querySelector('#cart-drawer').classList.add('open');
    document.body.style.overflow = 'hidden';
    document.querySelector('#cart-close').focus();
  }

  if (target.closest('#cart-close') || target.id === 'cart-drawer') {
    document.querySelector('#cart-drawer').classList.remove('open');
    document.body.style.overflow = '';
    document.querySelector('#cart-open').focus();
  }

  if (target.closest('#search-open')) {
    const el = document.querySelector('#search-panel');
    el.classList.toggle('open');
    if (el.classList.contains('open')) document.querySelector('#search-input').focus();
  }

  if (target.closest('#menu-toggle')) {
    const el = document.querySelector('#navigation');
    el.classList.toggle('open');
    document.querySelector('#menu-toggle').setAttribute('aria-expanded', String(el.classList.contains('open')));
  }

  if (target.closest('#navigation a')) {
    document.querySelector('#navigation').classList.remove('open');
  }
});

document.querySelector('#search-form').addEventListener('submit', event => {
  event.preventDefault();
  search = document.querySelector('#search-input').value.trim();
  if (!grid) {
    location.href = 'menu.html?search=' + encodeURIComponent(search);
    return;
  }
  filter = 'all';
  renderDishes();
  document.querySelector('#search-panel').classList.remove('open');
  document.querySelector('#menu').scrollIntoView({behavior: 'smooth'});
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    document.querySelector('#cart-drawer').classList.remove('open');
    document.querySelector('#search-panel').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Bootstrap from URL params
const params = new URLSearchParams(location.search);
filter = params.get('category') || 'all';
search = params.get('search') || '';
document.querySelectorAll('.category').forEach(el =>
  el.classList.toggle('selected', el.dataset.category === filter)
);
renderDishes();
renderCart();
