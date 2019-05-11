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
    // const inputs = document.querySelectorAll('.text-input');

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

const header = document.querySelector('.header-sticky');

// const dark = document.querySelector('.dark-overlay');
// const body = document.body;

// const hdr = document.querySelector('.page-header')
menuBtn.addEventListener('click', toggleMenu);
// initial state:
// let showMenu = false;
function toggleMenu() {
  closeBtn.classList.remove('closed');
  sideMenu.classList.add('show');
  showDarkOverlay();
  header.classList.add('close');
}

// function showDarkOverlay() {
//   dark.classList.add('show');
//   body.classList.add('modal-opened');
// }
// function hideDarkOverlay() {
//   dark.classList.remove('show');
//   body.classList.remove('modal-opened');
// }

closeBtn.addEventListener('click', closeMenu);
function closeMenu() {
  closeBtn.classList.add('closed');
  hideDarkOverlay();
  // dark.classList.remove('show');
  sideMenu.classList.remove('show');
  header.classList.remove('close');
}
dark.addEventListener('click', closeMenu);
sideMenu.addEventListener('click', closeMenu);

const darkCart = new Cart();
dark.addEventListener('click', darkCart.hideCart);
