async function getProducts() {
    const data = await fetch('https://ecommercebackend.fundamentos-29.repl.co/');
    const res = await data.json();

    localStorage.setItem('products', JSON.stringify(res));

    return res;
}

function deleteProducts(dataBase, idProduct) {
    const res = confirm('¿Seguro quieres eliminar producto del carrito?')
    if (!res) return;

    delete dataBase.cart[idProduct];
}

function productFind(dataBase, idProduct) {
    return dataBase.products.find(function (product) {
        return product.id === idProduct;
    });
}

function addProduct(dataBase, productFound, idProduct) {
    if (productFound.quantity === dataBase.cart[productFound.id].amount)
        return alert('No hay más productos en stock');

    dataBase.cart[idProduct].amount++;
}

function printProducts(dataBase) {
    const productsHTML = document.querySelector('.products');

    let html = '';

    dataBase.products.forEach(({ id, image, name, price, quantity, category }) => {

        html += `
            <div class="product ${category}">
                <div class="product__img">
                    <img src="${image}" alt="">
                </div>
                <div class="product__data">
                    ${quantity ? `<i class='bx bx-plus' id='${id}'></i>` : ``}
                    <h3>$${price}.00<span>${quantity ? `Stock: ${quantity}`
                : `<span class='soldOut'>Sold Out</span>`}</span></h3>
                    <p>${name}</p>
                </div>
            </div>
        `
    });

    productsHTML.innerHTML = html;
}

function printProductsCart(dataBase) {
    const cartProductsHTML = document.querySelector('.cart__products');

    let html = '';

    for (const key in dataBase.cart) {

        const { id, image, price, quantity, name, amount } = dataBase.cart[key]

        html += `
            <div class="itemProduct">
                <div class="itemProduct__img">
                    <img src="${image}" alt="">
                </div>
                <div class="itemProduct__data">
                    <h4>${name}</h4>
                    <p><span>Stock: ${quantity} | </span>$${price}.00</p>
                    <p>Subtotal: $${price * amount}.00</p>
                    <div class="itemProduct__op">
                        <i class='bx bx-minus' id='${id}'></i> 
                        <span>${amount} unit</span>
                        <i class='bx bx-plus' id='${id}'></i>
                        <i class='bx bx-trash' id='${id}'></i>
                    </div>
                </div>
            </div>
        `
    }

    cartProductsHTML.innerHTML = html;
}

function handleShowCart() {
    const cartHTML = document.querySelector('.cart');
    const iconCartHTML = document.querySelector('.bx-shopping-bag');

    iconCartHTML.addEventListener('click', function () {
        cartHTML.classList.toggle('cart__show');
    });
}

function handleCloseCart() {
    const cartHTML = document.querySelector('.cart');
    const iconCartCloseHTML = document.querySelector('.bx-x');

    iconCartCloseHTML.addEventListener('click', function () {
        cartHTML.classList.toggle('cart__show');
    });
}

function addCartFromProducts(dataBase) {
    const productsHTML = document.querySelector('.products');

    productsHTML.addEventListener('click', function (btn) {
        if (btn.target.classList.contains('bx-plus')) {
            const productId = Number(btn.target.id);

            const productFound = productFind(dataBase, productId)
            if (dataBase.cart[productFound.id]) {
                addProduct(dataBase, productFound, productId)
            } else {
                const newProduct = structuredClone(productFound);
                newProduct.amount = 1;
                dataBase.cart[productFound.id] = newProduct;
            }
            localStorage.setItem('cart', JSON.stringify(dataBase.cart));
            printProductsCart(dataBase);
            printTotalCart(dataBase);
            handlePrintAmountProducts(dataBase);
        }
    });
}

function handleCart(dataBase) {
    const cartProducts = document.querySelector('.cart__products');
    cartProducts.addEventListener('click', function (btn) {
        if (btn.target.classList.contains('bx-minus')) {
            const idProduct = Number(btn.target.id);
            if (dataBase.cart[idProduct].amount === 1) {
                deleteProducts(dataBase, idProduct);
            } else {
                dataBase.cart[idProduct].amount--;
            }
        }

        if (btn.target.classList.contains('bx-plus')) {
            const idProduct = Number(btn.target.id);
            const productFound = productFind(dataBase, idProduct);
            addProduct(dataBase, productFound, idProduct)
        }

        if (btn.target.classList.contains('bx-trash')) {
            const idProduct = Number(btn.target.id);
            deleteProducts(dataBase, idProduct);
        }

        localStorage.setItem('cart', JSON.stringify(dataBase.cart));
        printProductsCart(dataBase);
        printTotalCart(dataBase);
        handlePrintAmountProducts(dataBase);
    });
}

function printTotalCart(dataBase) {
    const totalItem = document.querySelector('.total__item');
    const totalBuy = document.querySelector('.total__buy');

    let totalProducts = 0;
    let amountProduts = 0;

    for (const product in dataBase.cart) {
        const { amount, price } = dataBase.cart[product];
        amountProduts += amount * price;
        totalProducts += amount;
    }

    totalItem.textContent = totalProducts + ' item';
    totalBuy.textContent = '$' + amountProduts + '.00';
}

function handleTotal(dataBase) {
    const btnBuy = document.querySelector('.btn__buy');

    btnBuy.addEventListener('click', function () {

        if (!Object.values(dataBase.cart).length)
            return alert('No hay productos en el carrito');

        const response = confirm('¿Seguro que quieres hacer la compra?');
        if (!response) return;

        const currentProducts = [];

        for (const product of dataBase.products) {
            const productCart = dataBase.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            } else {
                currentProducts.push(product);
            }
        }

        dataBase.products = currentProducts;
        dataBase.cart = {};

        localStorage.setItem('products', JSON.stringify(dataBase.products));
        localStorage.setItem('cart', JSON.stringify(dataBase.cart));

        printTotalCart(dataBase);
        printProductsCart(dataBase);
        printProducts(dataBase);
        handlePrintAmountProducts(dataBase);
    });
}

function handlePrintAmountProducts(dataBase) {
    const productsAmount = document.querySelector('.products__amount');

    let amount = 0;

    for (const product in dataBase.cart) {
        amount += dataBase.cart[product].amount;
    }

    productsAmount.textContent = amount
}

function handleNavbar() {
    const iconMenu = document.querySelector(".bxs-dashboard");
    const menu = document.querySelector(".navbar__menu");

    iconMenu.addEventListener('click', function () {
        menu.classList.toggle('menu__show');
    });
}

function handleDarkMode() {
    const iconDarkMode = document.querySelector('.bx-moon');
    const iconLightMode = document.querySelector('.bx-sun');

    iconDarkMode.addEventListener('click', function () {
        if (document.body.classList.toggle('dark__mode')) {
            const iconAdd = document.getElementById("add");
            iconAdd.style.display = "none";

            const iconRemove = document.getElementById("remove");
            iconRemove.style.display = "inline-block";
        }

    })
    iconLightMode.addEventListener('click', function () {
        if (!document.body.classList.toggle('dark__mode')) {
            const iconRemove = document.getElementById("remove");
            iconRemove.style.display = "none";

            const iconAdd = document.getElementById("add");
            iconAdd.style.display = "inline-block";
        }
    })
}

function transitionNavbar() {
    const navbar = document.querySelector('.header__container')

    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar__active');
        } else {
            navbar.classList.remove('navbar__active');
        }
    });
}

function handleFilters() {
    const filtersHTML = document.querySelectorAll('.filters .btn__filter');

    filtersHTML.forEach((filter) => {
        filter.addEventListener('click', (e) => {
            filtersHTML.forEach(filter =>
                filter.classList.remove('btn__filter--active')
            );

            e.target.classList.add('btn__filter--active');
        });
    });

    mixitup(".products", {
        selectors: {
            target: ".product",
        },
        animation: {
            duration: 300
        }
    });
}

async function main() {
    const dataBase = {
        products: JSON.parse(localStorage.getItem('products')) || (await getProducts()),

        cart: JSON.parse(localStorage.getItem('cart')) || {},
    };

    printProducts(dataBase);
    handleShowCart();
    handleCloseCart();
    addCartFromProducts(dataBase);
    printProductsCart(dataBase);
    handleCart(dataBase);
    printTotalCart(dataBase);
    handleTotal(dataBase);
    handlePrintAmountProducts(dataBase);
    handleNavbar();
    transitionNavbar();
    handleDarkMode();
    handleFilters();
}

main()