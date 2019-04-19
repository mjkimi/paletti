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

// cart
let cart = [];
let buttonsDOM = [];

// Retrieving products' data
class Products {
  async fetchProducts() {
    try {
      const res = await fetch('./products.json');
      const products = await res.json();
      // console.log(123);
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
      result += `
      <article class="product">
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
          <button type="button" class="btn btn-action buy-now" data-id=${
            product.id
          }>Buy now</button>
        </article>
      `;
    });

    productsDOM.innerHTML = result;
  }

  getProductButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      // disable if item WAS previously added to the cart
      let id = parseInt(button.dataset.id, 10);
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      }
      // disable if item IS added
      button.addEventListener('click', e => {
        e.target.innerText = 'In Cart';
        e.target.disabled = true;
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
      });
    });
  }
}

// class Cart {
//   setup() {
//     cart = Storage.getCart();
//     this.setCartValues(cart);
//     this.populate(cart);
//     cartBtn.addEventListener('click', this.showCart);
//     closeCartBtn.addEventListener('click', this.hideCart);
//   }

//   // showing overall amounts on cart <icon> & 'Your Total:' sum in cart
//   setCartValues(cart) {
//     let tempTotal = 0,
//       itemTotal = 0;
//     cart.map(item => {
//       tempTotal += item.price * item.amount;
//       itemTotal += item.amount;
//     });
//     cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
//     cartItems.innerText = itemTotal;
//   }

//   populate(cart) {
//     cart.forEach(item => this.addCartItem(item));
//   }

//   // add items to the cart DOM
//   addCartItem(item) {
//     const div = document.createElement('div');
//     div.classList.add('cart-item');
//     div.innerHTML = `
//           <img src=${item.image} alt="product" />
//             <div>
//               <h4>${item.title}</h4>
//               <h5>$${item.price}</h5>
//               <span class="remove-item" data-id=${item.id}>remove</span>
//             </div>
//             <div>
//               <i class="fas fa-chevron-up" data-id=${item.id}></i>
//               <p class="item-amount">${item.amount}</p>
//               <i class="fas fa-chevron-down" data-id=${item.id}></i>
//             </div>
//     `;
//     cartContent.appendChild(div);
//   }

//   showCart() {
//     cartOverlay.classList.add('transparentBcg');
//     cartDOM.classList.add('showCart');
//   }
//   hideCart() {
//     cartOverlay.classList.remove('transparentBcg');
//     cartDOM.classList.remove('showCart');
//   }

//   // Cart functionality:
//   cartLogic() {
//     // empty the cart
//     clearCartBtn.addEventListener('click', () => {
//       this.clearCart();
//     });
//     cartContent.addEventListener('click', e => {
//       let clickedBtn = e.target;
//       let id = parseInt(clickedBtn.dataset.id, 10);
//       // remove item
//       if (clickedBtn.classList.contains('remove-item')) {
//         cartContent.removeChild(clickedBtn.parentElement.parentElement);
//         this.removeItem(id);
//         // increase quantity
//       } else if (clickedBtn.classList.contains('fa-chevron-up')) {
//         let item = cart.find(item => item.id === id);
//         item.amount += 1;
//         Storage.saveCart(cart);
//         this.setCartValues(cart);
//         clickedBtn.nextElementSibling.innerText = item.amount;
//         // decrease quantity
//       } else if (clickedBtn.classList.contains('fa-chevron-down')) {
//         let item = cart.find(item => item.id === id);
//         item.amount -= 1;
//         if (item.amount > 0) {
//           Storage.saveCart(cart);
//           this.setCartValues(cart);
//           clickedBtn.previousElementSibling.innerText = item.amount;
//         } else {
//           cartContent.removeChild(clickedBtn.parentElement.parentElement);
//           this.removeItem(id);
//         }
//       }
//     });
//   }

//   clearCart() {
//     let cartItems = cart.map(item => item.id);
//     cartItems.forEach(id => this.removeItem(id));
//     while (cartContent.children.length > 0) {
//       cartContent.removeChild(cartContent.children[0]);
//     }
//     this.hideCart();
//   }

//   removeItem(id) {
//     console.log(id, typeof id);
//     cart = cart.filter(item => item.id !== id);
//     this.setCartValues(cart);
//     Storage.saveCart(cart);
//     let button = buttonsDOM.find(button => button.dataset.id === id);
//     button.disabled = false;
//     button.innerHTML = `<i class='fas fa-shopping-cart'></i>add to cart`;
//   }
// }

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
  // const cart = new Cart();

  // cart.setup();
  // get all products
  products
    .fetchProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getProductButtons();
      // cart.cartLogic();
    });
});