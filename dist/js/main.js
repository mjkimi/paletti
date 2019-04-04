// Sign In Form -> Label Positioning

const inputs = document.querySelectorAll('.text-input');

// let active = false;
inputs.forEach(input => {
  input.addEventListener('input', () => {
    const value = input.value.trim();
    // if typed:
    if (value) {
      input.dataset.state = 'not-empty';
      // form.dataset.state = 'show';
      // menuDialog.dataset.state = 'show';
    } else {
      input.dataset.state = '';
    }
  });
});

const my = document.querySelector('.my');
my.addEventListener('mouseover', showForm);
let active = false;
function showForm() {
  const form = document.querySelector('.signin');
  const menuDialog = document.querySelector('.header-menu-dialog');
  if (!active) {
    form.className += ' ' + 'wer';
    // form.style.opacity = '1';
    // menuDialog.style.visibility = 'visible';
    menuDialog.className += ' ' + 'wer';
    active = true;
  } else {
    form.classList.remove('wer');
    // form.style.opacity = '1';
    // menuDialog.style.visibility = 'visible';
    menuDialog.classList.remove('wer');
    active = false;
  }
}

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
// const hdr = document.querySelector('.page-header')
menuBtn.addEventListener('click', toggleMenu);
// initial state:
// let showMenu = false;
function toggleMenu() {
  sideMenu.classList.add('show');
  dark.classList.add('show');
  header.classList.add('close');
}

closeBtn.addEventListener('click', closeMenu);
function closeMenu() {
  dark.classList.remove('show');
  sideMenu.classList.remove('show');

  header.classList.remove('close');
}
dark.addEventListener('click', closeMenu);

// Slider
const slides = document.querySelectorAll('.slide');
const next = document.querySelector('#next');
const prev = document.querySelector('#prev');
const controlBtn = document.querySelector('#control');
let autoplay = true;
let intervalTime = 4000;
let slideInterval;

window.onload = () => {
  document.querySelector('.slide').classList.add('current');
};

const nextSlide = () => {
  const current = document.querySelector('.current');
  current.classList.remove('current');
  // check for the next slide and pass on current class
  document.querySelector('.slider').style.background = '#404040';
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
