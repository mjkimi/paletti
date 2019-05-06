// Sign In Form -> Label Positioning

const inputs = document.querySelectorAll('.text-input');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    const value = input.value.trim();
    // if typed:
    if (value) {
      input.dataset.state = 'not-empty';
    } else {
      input.dataset.state = '';
    }
  });
});

// const my = document.querySelector('.my');
// my.addEventListener('mouseover', showForm);
// let active = false;
// function showForm() {
//   const form = document.querySelector('.signin');
//   const menuDialog = document.querySelector('.header-menu-dialog');
//   if (!active) {
//     form.className += ' ' + 'wer';
//     // form.style.opacity = '1';
//     // menuDialog.style.visibility = 'visible';
//     menuDialog.className += ' ' + 'wer';
//     active = true;
//   } else {
//     form.classList.remove('wer');
//     // form.style.opacity = '1';
//     // menuDialog.style.visibility = 'visible';
//     menuDialog.classList.remove('wer');
//     active = false;
//   }
// }

// Sign In -> Submit
document.querySelector('#sign-in-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;
  if (email === '' || password === '') {
    document.querySelector('#error-msg').innerHTML =
      '* This is a required field';
    document.querySelectorAll('.aster').forEach(span => {
      span.className = 'error-msg';
    });
    const inputs = document.querySelectorAll('.text-input');

    inputs.forEach(input => {
      input.className += ' ' + 'error-msg';
    });
    return false;
  }
});

// Menu Button
const menuBtn = document.querySelector('#main-menu-btn');
const closeBtn = document.querySelector('#btn-close');
const sideMenu = document.querySelector('.side-menu');
const dark = document.querySelector('.dark-overlay');
const header = document.querySelector('.header-sticky');
const headerWrap = document.querySelector('.header-wrapper');
const body = document.body;
// const hdr = document.querySelector('.page-header')
menuBtn.addEventListener('click', toggleMenu);
// initial state:
// let showMenu = false;
function toggleMenu() {
  closeBtn.classList.remove('closed');
  sideMenu.classList.add('show');
  dark.classList.add('show');
  header.classList.add('close');
  // document.querySelector('.container').style.overflow = 'hidden';
  body.classList.add('modal-opened');
}

closeBtn.addEventListener('click', closeMenu);
function closeMenu() {
  closeBtn.classList.add('closed');
  dark.classList.remove('show');
  sideMenu.classList.remove('show');
  header.classList.remove('close');
  body.classList.remove('modal-opened');
  // document.querySelector('.container').style.overflowY = 'scroll';
}
dark.addEventListener('click', closeMenu);
sideMenu.addEventListener('click', closeMenu);

const darkCart = new Cart();
dark.addEventListener('click', darkCart.hideCart);
// Slider
const slides = document.querySelectorAll('.slide');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
const controlBtn = document.querySelector('#control');
const container = document.querySelectorAll('.container');
let autoplay = true;
let intervalTime = 5000;
let slideInterval;

// Shutted down slider
// window.onload = () => {
//   document.querySelector('.slide').classList.add('current');
// };

const nextSlide = () => {
  const current = document.querySelector('.current');
  current.classList.remove('current');
  document.querySelector('.slider').classList.add('dark-bg');
  // check for the next slide and pass on current class
  if (current.nextElementSibling) {
    current.nextElementSibling.classList.add('current');
  } else {
    // back to the 1st slide
    slides[0].classList.add('current');
  }
};

const prevSlide = () => {
  const current = document.querySelector('.current');
  current.classList.add('fade');
  current.classList.remove('current');
  // check for the prev slide and pass on current class
  if (current.previousElementSibling) {
    current.previousElementSibling.classList.add('current');
  } else {
    slides[slides.length - 1].classList.add('current');
  }
};

next.addEventListener('click', e => {
  nextSlide();
  if (autoplay) {
    resetTime();
  }
});
prev.addEventListener('click', e => {
  prevSlide();
  if (autoplay) {
    resetTime();
  }
});

function resetTime() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, intervalTime);
}

// Slider autoplay control
if (autoplay) {
  slideInterval = setInterval(nextSlide, intervalTime);
}
// Play/pause slide show
controlBtn.addEventListener('click', e => {
  const icon = controlBtn.firstElementChild;
  if (autoplay) {
    autoplay = false;
    clearInterval(slideInterval);
    icon.setAttribute('class', 'far fa-caret-square-right');
  } else {
    autoplay = true;
    slideInterval = setInterval(nextSlide, intervalTime);
    icon.setAttribute('class', 'far fa-pause-circle');
  }
});

// Hide header on scroll
let prevScrollPos = window.pageYOffset;
window.onscroll = function() {
  let currentScrollPos = window.pageYOffset;
  prevScrollPos > currentScrollPos
    ? headerWrap.classList.remove('hide')
    : headerWrap.classList.add('hide');
  prevScrollPos = currentScrollPos;
};
// Smooth scroll effect (3d party cdn)
const scroll = new SmoothScroll(' a[href*="#"]', {
  speed: 800
});

/* ------------- Search --------------- */
const searchBtn = document.querySelector('#search-btn');
const searchHeader = document.querySelector('.header-search');
const searchBlock = document.querySelector('.search-block');
const closeSearchBtn = document.querySelector('#search-close');

searchBtn.addEventListener('click', showSearchForm);

function showSearchForm() {
  searchHeader.classList.remove('header-search-closed');
  closeSearchBtn.classList.add('activated');
  dark.classList.add('show');
  searchHeader.ontransitionend = () => {
    closeSearch();
  };
  showInput();
}

function showInput() {
  cleanAllMatch();
  searchBlock.classList.add('search-block-close');
  input.focus();
}
function hideInput() {
  searchBlock.classList.remove('search-block-close');
}

function hideSearchForm() {
  searchHeader.classList.add('header-search-closed');
  closeSearchBtn.classList.remove('activated');
  dark.classList.remove('show');
  hideInput();
}

function closeSearch() {
  document.addEventListener('mouseup', function handler(e) {
    const searchBlock = document.querySelector('.search-block');
    let targetElement = e.target; // clicked element
    if (!searchBlock.contains(targetElement)) {
      hideSearchForm();
      this.removeEventListener('mouseup', handler);
    }
  });
}

// Search functionality
const input = document.querySelector('.input-text');
const searchRes = document.querySelector('#search-result');
let products;
let matches;

// Переделать ч/з классы!!!!!!!!!!!!!!!!!!!!!!
const getProducts = async () => {
  const res = await fetch('./data/products.json');
  products = await res.json();
};
const searchProducts = searchText => {
  // Get matches to current text input
  matches = products.filter(product => {
    const regex = new RegExp(`\\b${searchText}`, 'gi');
    return product.title.match(regex) || product.color.match(regex);
  });

  if (searchText.length === 0) {
    cleanAllMatch();
  }

  outputHtml(matches);
};

const cleanAllMatch = () => {
  matches = [];
  searchRes.innerHTML = '';
  input.value = '';
};

// Show search results
const outputHtml = matches => {
  if (matches.length > 0) {
    const html = matches
      .map(
        // for <i> style picking only 1st word in color data
        match => `
        <div class="matched">
          <a href="#${match.id}">
            <i class="fas fa-tint fa-xs" 
              style="color:var(--${match.color.split(',')[0]})"></i> ${
          match.title
        }
          </a>
        </div>
      `
      )
      .join('');
    searchRes.innerHTML = html;
  }
};
window.addEventListener('DOMContentLoaded', getProducts);
input.addEventListener('input', () => searchProducts(input.value));

/* End--------------Search----------------- */

/* ----------------Personalize------------- */
const inputMsg = document.querySelector('#design-input');
const yourMsg = document.querySelector('#your-message');
const nextBtn = document.querySelector('#next-form');
const backBtn = document.querySelector('#previous');
const form1 = document.querySelector('.message');
const form2 = document.querySelector('.send-to');
// const receiver = document.querySelector('#receiver');

// const addToCart = document.querySelector('#add-to-cart');

const prompt = document.querySelector('#prompt');

inputMsg.addEventListener('input', () => typeMessage(inputMsg.value));

const typeMessage = text => {
  yourMsg.innerHTML = text;
  prompt.innerHTML = '&#42; maximum 19 characters';
};

nextBtn.addEventListener('click', showNextForm);
backBtn.addEventListener('click', returnPrevForm);

function showNextForm() {
  if (inputMsg.value) {
    form1.style.display = 'none';
    form2.style.display = 'block';
  } else {
    prompt.innerHTML = '&#42; please enter your message';
  }
  fetchCountries().then(countries => {
    populate(countries);
  });
}

// Countries
function populate(countries) {
  const select = document.querySelector('#select-country');
  countries.forEach(country => {
    const newOption = document.createElement('option');
    newOption.value = `${country.code}`;
    newOption.innerHTML = `${country.name}`;
    select.add(newOption);
  });
}

const fetchCountries = async () => {
  const res = await fetch('./data/countries.json');
  const countriesList = await res.json();
  return countriesList;
};
// End countries

function returnPrevForm() {
  form2.style.display = 'none';
  form1.style.display = 'block';
}

// addToCart.addEventListener('click', validate);
// function validate() {
//   const isValidForm = receiver.checkValidity();
//   if (!isValidForm) {
//     // console.log(123);
//     return false;
//   } else {
//     //
//   }

// const inputsAll = [...form2.getElementsByTagName('input')];
// inputsAll.forEach(input => {
//   if (input.value.trim() !== '') {
//     console.log(23);
//   }
// });
// }

/* End-------------Personalize------------- */
