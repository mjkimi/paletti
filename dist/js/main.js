//  IIFE scope for whole document to avoid polluting global namespace

(() => {
  /*-------------Retrieving products' data------------------*/
  class Products {
    async fetchProducts() {
      try {
        const res = await fetch('./data/products.json');
        const products = await res.json();
        return products;
      } catch (err) {
        console.log('JSON Error: ' + err.message);
      }
    }
  }

  /* ---------Countries(for personalized section)------------ */
  class Countries {
    async fetchCountries() {
      const res = await fetch('./data/countries.json');
      const countriesList = await res.json();
      return countriesList;
    }
  }

  /*---------------Page scroll---------------*/

  const headerWrap = document.querySelector('.header-wrapper');
  let prevScrollPos = window.pageYOffset;

  class PageScroll {
    scrollControl() {
      window.onscroll = () => {
        // -> show-hide sticky header

        let currentScrollPos = window.pageYOffset;
        prevScrollPos > currentScrollPos
          ? headerWrap.classList.remove('hide')
          : headerWrap.classList.add('hide');
        prevScrollPos = currentScrollPos;

        const windowHeight = window.innerHeight;

        // -> -> "parallax" of landing chocolates
        // relative position of products' center to the viewport, i.e. the window:
        let top = productsDOM.getBoundingClientRect().top;

        if (currentScrollPos > top - windowHeight / 2) {
          const allArticles = document.querySelectorAll('.product');
          allArticles.forEach((article, i) => {
            setTimeout(() => {
              article.classList.add('is-showing');
            }, 150 * (i + 1));
          });
        }

        // -> "parallax" of Info, Packaging & Delivery section
        const infoGrid = document.querySelectorAll('.from-center');
        infoGrid.forEach(div => {
          let positionFromTop = div.getBoundingClientRect().top;
          if (positionFromTop - windowHeight <= 0) {
            div.classList.add('fade-in');
          }
        });
      };

      // smooth scroll effect (3d party cdn)
      const scroll = new SmoothScroll(' a[href*="#"]', {
        speed: 400
      });
    }
  }

  /*-------------End--Page scroll---------------*/

  /*---------------Slider-------------------*/
  const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  let picture = document.querySelector('.responsive-image');
  let autoplay = true;
  let intervalTime = 5000;
  let slideInterval;
  window.onresize = () => updateSliderSize();

  // set the height of  slider to the height of absolute slide:
  const updateSliderSize = () => {
    slider.style.height = picture.offsetHeight - 15 + 'px';
    //  font-size <span> of personalize section
    const coverImg = document.querySelector('#cover-img');
    const imgHeight = coverImg.clientHeight;
    coverImg.nextElementSibling.style.fontSize = imgHeight / 3 + 'px';
  };

  class Slider {
    runSlider() {
      const singleSlide = document.querySelector('.slide');
      singleSlide.classList.add('current');
      if (autoplay) {
        slideInterval = setInterval(this.nextSlide, intervalTime);
      }
      this.sliderControl();
    }

    nextSlide() {
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
    }

    prevSlide() {
      const current = document.querySelector('.current');
      current.classList.add('fade');
      current.classList.remove('current');
      // check for the prev slide and pass on current class
      if (current.previousElementSibling) {
        current.previousElementSibling.classList.add('current');
      } else {
        slides[slides.length - 1].classList.add('current');
      }
    }

    sliderControl() {
      const next = document.querySelector('#next');
      const prev = document.querySelector('#prev');
      const controlBtn = document.querySelector('#control');
      // next btn:
      next.addEventListener('click', e => {
        this.nextSlide();
        if (autoplay) {
          this.resetTime();
        }
      });
      // prev btn:
      prev.addEventListener('click', e => {
        this.prevSlide();
        if (autoplay) {
          this.resetTime();
        }
      });

      // play/pause slide:
      controlBtn.addEventListener('click', e => {
        const icon = controlBtn.firstElementChild;
        if (autoplay) {
          autoplay = false;
          clearInterval(slideInterval);
          icon.setAttribute('class', 'far fa-caret-square-right');
        } else {
          autoplay = true;
          slideInterval = setInterval(this.nextSlide, intervalTime);
          icon.setAttribute('class', 'far fa-pause-circle');
        }
      });
    }

    resetTime() {
      clearInterval(slideInterval);
      slideInterval = setInterval(this.nextSlide, intervalTime);
    }
  }

  /*------------End--Slider------------------*/

  /*----------------Main menu-----------------*/

  const menuBtn = document.querySelector('#main-menu-btn');
  const closeBtn = document.querySelector('#btn-close');
  const sideMenu = document.querySelector('.side-menu');
  const header = document.querySelector('.header-sticky');

  class Menu {
    setupMenuEvents() {
      menuBtn.addEventListener('click', this.showMenu);
      closeBtn.addEventListener('click', this.closeMenu);
      // for the purpose of hiding on clicking on menu links:
      sideMenu.addEventListener('click', this.closeMenu);
      dark.addEventListener('click', this.closeMenu);
    }

    showMenu() {
      closeBtn.classList.remove('closed');
      sideMenu.classList.add('show');
      header.classList.add('close');
      showDarkOverlay();
    }

    closeMenu() {
      closeBtn.classList.add('closed');
      sideMenu.classList.remove('show');
      header.classList.remove('close');
      hideDarkOverlay();
    }
  }

  /*--------------End--Main menu-----------------*/

  /* ------------- Search --------------- */

  const searchHeader = document.querySelector('.header-search');
  const input = document.querySelector('.input-text');
  const searchRes = document.querySelector('#search-result');
  const searchBlock = document.querySelector('.search-block');
  const closeSearchBtn = document.querySelector('#search-close');
  let products;
  let matches;

  class Search {
    setup(items) {
      const searchBtn = document.querySelector('#search-btn');
      searchBtn.addEventListener('click', () => this.showSearchForm());
      input.addEventListener('input', () => this.searchProducts(input.value));
      products = items;
    }

    showSearchForm() {
      searchHeader.classList.remove('header-search-closed');
      closeSearchBtn.classList.add('activated');
      showDarkOverlay();
      searchHeader.ontransitionend = () => {
        this.closeSearch();
      };
      this.showInput();
    }

    closeSearch() {
      const that = this;
      document.addEventListener('mouseup', function handler(e) {
        let targetElement = e.target; // clicked element
        if (!searchBlock.contains(targetElement)) {
          that.hideSearchForm();
          // remove document event listener from influencing other parts
          document.removeEventListener('mouseup', handler);
        }
      });
    }

    showInput() {
      this.cleanAllMatch();
      searchBlock.classList.add('search-block-close');
      input.focus();
    }

    hideInput() {
      searchBlock.classList.remove('search-block-close');
    }

    hideSearchForm() {
      searchHeader.classList.add('header-search-closed');
      closeSearchBtn.classList.remove('activated');
      hideDarkOverlay();
      this.hideInput();
    }

    // -> search functionality:

    searchProducts(searchText) {
      // get matches to current text input
      matches = products.filter(product => {
        const regex = new RegExp(`\\b${searchText}`, 'gi');
        return product.title.match(regex) || product.color.match(regex);
      });

      if (searchText.length === 0) {
        this.cleanAllMatch();
      }

      this.outputHtml(matches);
    }

    cleanAllMatch() {
      matches = [];
      searchRes.innerHTML = '';
      input.value = '';
    }

    // show search results
    outputHtml(matches) {
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
    }
  }

  /* ---------------End--Search----------------- */

  class Signin {
    setup() {
      const inputs = document.querySelectorAll('.text-input');
      // -> Label positioning
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

      // -> Submit
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

          inputs.forEach(input => {
            input.className += ' ' + 'error-msg';
          });
          return false;
        }
      });
    }
  }

  /* ---------------Personalize---------------- */

  const inputMsg = document.querySelector('#design-input');
  const nextBtn = document.querySelector('#next-form');
  const backBtn = document.querySelector('#previous');
  const form1 = document.querySelector('.message');
  const form2 = document.querySelector('.send-to');
  const prompt = document.querySelector('#prompt');
  const yourMsg = document.querySelector('#your-message');

  class Personolize {
    setupListeners() {
      inputMsg.addEventListener('input', () =>
        this.typeMessage(inputMsg.value)
      );
      nextBtn.addEventListener('click', () => this.showNextForm());
      backBtn.addEventListener('click', () => this.returnPrevForm());
    }

    typeMessage(text) {
      yourMsg.innerHTML = text;
      prompt.innerHTML = ' maximum 19 characters';
    }

    showNextForm() {
      const step1 = [...form1.querySelectorAll('.required')];
      if (inputMsg.value) {
        this.hideError(step1);
        form1.style.display = 'none';
        form2.style.display = 'block';
      } else {
        this.showError(step1);
        prompt.innerHTML = 'please enter your message';
      }
      // getting countries:
      const contries = new Countries();
      contries.fetchCountries().then(countries => {
        this.populate(countries);
      });
    }

    populate(countries) {
      const select = document.querySelector('#select-country');
      // check if list of countries has already been added
      select.children.length > 1
        ? false
        : countries.forEach(country => {
            const newOption = document.createElement('option');
            newOption.value = `${country.code}`;
            newOption.innerHTML = `${country.name}`;
            select.add(newOption);
          });
    }

    // red asterisks on error:
    showError(step) {
      step.forEach(element => (element.style.visibility = 'visible'));
    }
    hideError(step) {
      step.forEach(element => (element.style.visibility = 'hidden'));
    }

    returnPrevForm() {
      form2.style.display = 'none';
      form1.style.display = 'block';
    }
  }

  /* ------------End--Personalize--------------- */

  /*---------------Cart & Products---------------*/

  const cartBtn = document.querySelector('.cart-btn');
  const closeCartBtn = document.querySelector('.close-cart');
  const clearCartBtn = document.querySelector('.clear-cart');
  const cartDOM = document.querySelector('.cart');
  const cartItems = document.querySelector('.cart-items');
  const cartTotal = document.querySelector('.cart-total');
  const cartContent = document.querySelector('.cart-content');
  const productsDOM = document.querySelector('.products-center');

  let cart = [];
  let buttonsDOM = [];

  /*------------------Display products-----------------*/
  class UI {
    // populating DOM with products
    displayProducts(products) {
      let result = '';
      products.forEach(product => {
        // checking if the id is not of personalized item
        if (!isNaN(parseFloat(product.id))) {
          result += `
      <article class="product" id="${product.id}">
          <div class="img-container">
            <img
              src=${product.image}
              alt="product"
              class="product-img"
            />
          </div>
          <div class="title-wrapper">
            <span>Paletti</span>
            <h3>${product.title}</h3>
          </div>
          <div class="description-wrapper">
            <span>${product.weight}</span>
            <p>${product.description}</p>
          </div>
          <div class="booking">
            <strong><span>$${product.price}</span></strong>
            <button type="button" class="btn btn-action buy-now bag-btn" data-id=${
              product.id
            }><span class="btn-text">Buy now</span></button>
          </div>
        </article>
      `;
        }
      });

      productsDOM.innerHTML = result;
    }

    getProductButtons() {
      const buttons = [...document.querySelectorAll('.bag-btn')];
      buttonsDOM = buttons;
      buttons.forEach(button => {
        // disable if item WAS previously added to the cart
        let id = button.dataset.id;
        let inCart = cart.find(item => item.id === id);
        if (inCart && id !== 'personal') {
          button.disabled = true;
          button.firstElementChild.innerHTML = 'In Cart';
        }
        // disable if item IS added
        button.addEventListener('click', e => {
          if (id !== 'personal') {
            e.currentTarget.lastElementChild.innerHTML = 'In Cart';
            e.currentTarget.disabled = true;
            this.runCartProcedure(id);
          } else {
            // select all required class
            const step2 = [...form2.querySelectorAll('.required')];
            // validate personolized chocolate form
            const isValidForm = document
              .querySelector('#receiver')
              .checkValidity();
            // Add to cart button:
            const chocoletter = new Personolize();
            if (isValidForm) {
              chocoletter.hideError(step2);
              this.runCartProcedure(id);
            } else {
              chocoletter.showError(step2);
              return false;
            }
          }
        });
      });
    }

    runCartProcedure(id) {
      // get product from local storage
      let cartItem = { ...Storage.getProduct(id), amount: 1 };
      // add product to the cart
      cart = [...cart, cartItem];
      Storage.saveCart(cart);
      // run cart functionality
      const cartAdd = new Cart();
      cartAdd.setCartValues(cart);
      cartAdd.addCartItem(cartItem);
      cartAdd.showCart();
    }
  }

  /*----------------End--Display products-----------------*/

  /*----------------Cart--------------------*/

  class Cart {
    setup() {
      cart = Storage.getCart();
      this.setCartValues(cart);
      this.populate(cart);
      cartBtn.addEventListener('click', this.showCart);
      closeCartBtn.addEventListener('click', this.hideCart);
      dark.addEventListener('click', this.hideCart);
    }

    // showing overall amounts on cart <icon> & 'Your Total:' sum in cart
    setCartValues(cart) {
      let tempTotal = 0,
        itemTotal = 0;
      cart.map(item => {
        tempTotal += item.price * item.amount;
        itemTotal += item.amount;
      });
      cartTotal.innerText = `$${parseFloat(tempTotal.toFixed(2))}`;
      cartItems.innerText = itemTotal;
    }

    populate(cart) {
      cart.forEach(item => this.addCartItem(item));
    }

    // add items to the cart DOM
    addCartItem(item) {
      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
      <img src=${item.image} alt="product" />
      <h4>${item.title}</h4>
      <h5 class="price">$${item.price}</h5>
      <p class="quantity">Quantity</p>
      <p class="item-amount">${item.amount}</p>
      <i class="fas fa-plus fa-sm" data-id=${item.id}></i>
      <i class="fas fa-minus fa-xs" data-id=${item.id}></i>
      <span class="remove-item" data-id=${item.id}>remove</span>
    `;
      cartContent.appendChild(div);
    }

    showCart() {
      showDarkOverlay();
      dark.classList.add('cart-overlay');
      cartDOM.classList.add('showCart');
    }
    hideCart() {
      hideDarkOverlay();
      dark.classList.remove('cart-overlay');

      cartDOM.classList.remove('showCart');
    }

    // Cart functionality:
    cartLogic() {
      // empty the cart

      clearCartBtn.addEventListener('click', () => {
        let offset = 0;
        let offsetDelete = 300;
        const allCartItems = [...cartContent.children];

        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));

        allCartItems.filter(item => {
          setTimeout(() => {
            item.classList.add('remove');
          }, offset);
          offset += 300;
          setTimeout(() => {
            cartContent.removeChild(item);
          }, offsetDelete);
          offsetDelete += 300;
        });
      });

      cartContent.addEventListener('click', e => {
        let clickedBtn = e.target;
        let id = clickedBtn.dataset.id;
        // remove item
        if (clickedBtn.classList.contains('remove-item')) {
          clickedBtn.parentElement.classList.add('remove');
          setTimeout(() => {
            cartContent.removeChild(clickedBtn.parentElement);
          }, 400);
          this.removeItem(id);
          // increase quantity
        } else if (clickedBtn.classList.contains('fa-plus')) {
          let item = cart.find(item => item.id === id);
          item.amount += 1;
          Storage.saveCart(cart);
          this.setCartValues(cart);
          clickedBtn.previousElementSibling.innerText = item.amount;
          // decrease quantity
        } else if (clickedBtn.classList.contains('fa-minus')) {
          let item = cart.find(item => item.id === id);
          item.amount -= 1;
          if (item.amount > 0) {
            Storage.saveCart(cart);
            this.setCartValues(cart);
            clickedBtn.previousElementSibling.previousElementSibling.innerText =
              item.amount;
          } else {
            cartContent.removeChild(clickedBtn.parentElement);
            this.removeItem(id);
            this.hideCart();
          }
        }
      });
    }

    removeItem(id) {
      cart = cart.filter(item => item.id !== id);
      this.setCartValues(cart);
      Storage.saveCart(cart);
      let button = buttonsDOM.find(button => button.dataset.id === id);
      button.disabled = false;
      if (id !== 'personal') {
        button.firstElementChild.innerHTML = 'Buy now';
      }
    }
  }

  /*--------------End--Cart--------------------*/

  class Storage {
    // products
    static saveProducts(products) {
      localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id) {
      let selectedItem = JSON.parse(localStorage.getItem('products'));
      return selectedItem.find(product => product.id === id);
    }
    // cart
    static saveCart(cart) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart() {
      return localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [];
    }
  }

  /*-------------End--Cart & Products---------------*/

  /*-------------Dark overlay--------------*/
  const dark = document.querySelector('.dark-overlay');
  const body = document.body;
  const showDarkOverlay = () => {
    dark.classList.add('show');
    body.classList.add('modal-opened');
  };
  const hideDarkOverlay = () => {
    dark.classList.remove('show');
    body.classList.remove('modal-opened');
  };
  /*-----------End--Dark overlay--------------*/

  document.addEventListener('DOMContentLoaded', () => {
    const scroll = new PageScroll();
    const slider = new Slider();
    const search = new Search();
    const personalize = new Personolize();
    const ui = new UI();
    const products = new Products();
    const cart = new Cart();
    const menu = new Menu();
    const signin = new Signin();

    // get all products
    products
      .fetchProducts()
      .then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
        search.setup(products);
        updateSliderSize();
      })
      .then(() => {
        ui.getProductButtons();
        cart.cartLogic();
      });

    scroll.scrollControl();
    slider.runSlider();
    cart.setup();
    personalize.setupListeners();
    menu.setupMenuEvents();
    signin.setup();
  });
})(); // end of IIFE
