// Sign In Form -> Label Positioning

const inputs = document.querySelectorAll('.text-input');

inputs.forEach(input => {
  input.addEventListener('input', () => {
    const value = input.value.trim();
    // if typed:
    if (value) {
      input.dataset.state = 'not-empty';
    } else {
      input.dataset.state = 'empty';
    }
  });
});

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
