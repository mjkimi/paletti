// Cart!!!!!!!!!!!!!!!!!!!!!!/
// vars
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
// const btnText = document.querySelector('.btn-text');

// cart
let cart = [];
let buttonsDOM = [];

// Retrieving products' data
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

// Display products
class UI {
  // populating DOM with products
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
      // chechking if the id is not of personalized item
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
          <h3>${product.title}</h3>
          </div>
          <div class="description-wrapper">
          <p>${product.description}</p>
          </div>
          <h4>$${product.price}</h4>
          <button type="button" class="btn btn-action buy-now bag-btn" data-id=${
            product.id
          }><span class="btn-text">Buy now</span></button>
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
          // validate personolized chocolate form
          const isValidForm = document
            .querySelector('#receiver')
            .checkValidity();
          isValidForm ? this.runCartProcedure(id) : ;

          // isValidForm.firstChild.addEventListener('invalid', e => {
          //   console.log(e);
          //   if (e.target.validity.valueMissing) {
          //     e.target.nextElementSibling.innerHTML = '123';
          //   }
          // });
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

class Cart {
  setup() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populate(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
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
    dark.classList.add('show', 'cart-overlay');
    cartDOM.classList.add('showCart');
  }
  hideCart() {
    dark.classList.remove('show', 'cart-overlay');
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
        }
      }
    });
  }

  // clearCart() {
  //   let cartItems = cart.map(item => item.id);
  //   cartItems.forEach(id => this.removeItem(id));
  //   while (cartContent.children.length > 0) {
  //     cartContent.removeChild(cartContent.children[0]);
  //   }
  //   this.hideCart();
  // }

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

class Storage {
  // Products
  static saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
  }
  static getProduct(id) {
    let selectedItem = JSON.parse(localStorage.getItem('products'));
    return selectedItem.find(product => product.id === id);
  }
  // Cart
  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem('cart')
      ? JSON.parse(localStorage.getItem('cart'))
      : [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();
  const cart = new Cart();

  cart.setup();
  // get all products
  products
    .fetchProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getProductButtons();
      cart.cartLogic();
    });
});
