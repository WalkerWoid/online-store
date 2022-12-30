const API = 'https://raw.githubusercontent.com/WalkerWoid/online-store-api/main'

class ProductItem {
    constructor(product, imgSrc = 'https://imgholder.ru/600x300') {
        this.id = product.id
        this.title = product.title
        this.price = product.price
        this.imgSrc = imgSrc
        this.count = 0
    }
    render() {
        return `<div class="product-item" data-id="${this.id}"> 
                    <h3>${this.title}</h3>
                    <img class="img-src" src="${this.imgSrc}"  alt="${this.title}">
                    <p>${this.price} рублей</p>
                    <buttton class="buy-btn purp-btn" data-id="${this.id}">Купить</buttton>
                </div>`
    }
}
class Catalog {
    constructor(catalogSelector = '.products__container',
                allPriceSelector = '.allPrice-btn',
                addButtonSelector = 'buy-btn') {
        this.catalogSelector = catalogSelector
        this.productsFetch = []
        this.products = []
        this.allPriceSelector = allPriceSelector
        this.startedPrice = 0
        this.addButtonSelector = addButtonSelector
        this.cart = cart
        this.filteredItems = []

        this.#init()
    }

    #init() {
        this.#fetchProducts()
            .then(() => {
                this.#renderPage()
            })
        this.#eventsHandler()
        document.querySelector('.filter-catalog').addEventListener('input', (event) => this.#filter(event))
    }
    #eventsHandler() {
        const allPriceButton = document.querySelector(`${this.allPriceSelector}`)

        const catalog = document.querySelector(`${this.catalogSelector}`)
        catalog.addEventListener('click', (event) => this.#addToCart(event))
    }
    #countPrice(allPriceButton) {
        this.startedPrice = 0
        
        for (const product of this.products) {
            this.startedPrice += product.price
        }

        allPriceButton.innerText = this.startedPrice
    }
    #fetchProducts() {
        return fetch(`${API}/catalog.json`)
            .then(result => result.json())
            .then(data => {
                this.productsFetch = [...data]
            })
            .catch(error => {
                console.log(error)
            })
    }
    #renderPage() {
        const productContainer = document.querySelector(`${this.catalogSelector}`)

        for (const product of this.productsFetch) {
            const productObj = new ProductItem(product)
            this.products.push(productObj)
            this.filteredItems.push(productObj)

            productContainer.insertAdjacentHTML('beforeend', productObj.render())
        }
    }
    #addToCart(event) {
        const target = event.target

        if (!target.classList.contains(`${this.addButtonSelector}`)) {
            return
        }

        console.clear()

        const id = +target.dataset.id

        let neededItem, changedItem
        for (const item of this.products) {
            if (item.id === id) {
                neededItem = Object.assign({}, item)
            }
        }
        neededItem.count++

        this.cart.cartObjArr.filter(item => {
            if (item.id === neededItem.id) {
                changedItem = item
            }
        })

        if (changedItem) {
            changedItem.count += 1
            this.cart.reRenderCount(changedItem)
        } else {
            this.cart.setRawCartItemsArr(neededItem)
            this.cart.render()
        }
    }
    #filter(event) {
        const name = document.querySelector('.filter-catalog').value
        if (name.length <= 2 && name.length > 0) {
            return
        }
        const regExp = new RegExp(name, 'i')

        this.filteredItems = this.products.filter(item => regExp.test(item.title))
        this.products.forEach(item => {
            const block = document.querySelector(`.product-item[data-id="${item.id}"]`)

            if (!this.filteredItems.includes(item)) {
                block.classList.add('hidden')
            } else {
                block.classList.remove('hidden')
            }
        })
    }
}


class ItemCart extends ProductItem {
    constructor(product) {
        super(product)
        this.count = product.count
    }
    render() {
        return `
            <div class="cart-item" data-id="${this.id}"> 
                <h3>${this.title}</h3>
                <img class="img-src" src="${this.imgSrc}"  alt="${this.title}">
                <p>${this.price} рублей</p>
                <p>Количество: <span class="cart-item__count">${this.count}</span></p>
                <buttton class="del-btn purp-btn" data-id="${this.id}">Убрать</buttton>
            </div>
        `
    }
}
class Cart {
    constructor(cartBtnSelector = '.cart-btn',
                cartSelector = '.cart',
                delSelector = 'del-btn') {
        this.cartBtnSelector = cartBtnSelector
        this.cartBtn = '' // button to show and hide the cart

        this.cartSelector = cartSelector
        this.cart = '' // cart by itself

        this.delSelector = delSelector // to delete an item from the cart

        this.rawCartProducts = [] // render products in the cart by this raw array
        this.cartObjArr = [] // array with generated objects from ItemCart class

        this.#init()
    }
    setRawCartItemsArr(arr) {
        this.rawCartProducts = [arr]
    }


    #init() {
        this.#cartInit()

        this.cartBtn.addEventListener('click', () => this.#toggleCart())
    }
    #toggleCart() {
        this.cart.classList.toggle('cart_hidden')
    } // show/hide the cart


    #cartInit() {
        this.cartBtn = document.querySelector(`${this.cartBtnSelector}`)
        this.cart = document.querySelector(`${this.cartSelector}`)
        this.cart.innerHTML = ''

        this.#fetchCart()
            .then(() => {
                this.render(this.rawCartProducts)

                this.cart.addEventListener('click', (event) => this.#delFromBasket(event))
            })
    }
    #resetCart() {
        this.cart.innerText = 'Корзина пуста...'
    } // set an inscription in the empty cart
    #fetchCart() {
        return fetch(`cart.json`)
            .then(result => {
                return result.json()
            })
            .then(data => {
                this.rawCartProducts = [...data]
            })
            .catch(error => {
                console.log(error)
            })
        // return fetch(`${API}/cart.json`)
        //     .then(result => {
        //         return result.json()
        //     })
        //     .then(data => {
        //         this.rawCartProducts = [...data]
        //         console.log(this.rawCartProducts)
        //     })
        //     .catch(error => {
        //         console.log(error)
        //     })
    } // get raw products from the git api
    render(rawArr = this.rawCartProducts) {
        // this.cartObjArr = []

        for (const cartItem of rawArr) {
            const newGeneratedItem = new ItemCart(cartItem)
            this.cartObjArr.push(newGeneratedItem)
            this.cart.insertAdjacentHTML('beforeend', newGeneratedItem.render())
        }
    } // render the cart
    #delFromBasket(event) {
        const target = event.target
        if (!target.classList.contains(`${this.delSelector}`)) {
            return
        }
        console.clear()

        const id = +target.dataset.id

        let clickedItem
        for (const item of this.cartObjArr) {
            if (item.id === id) {
                clickedItem = item
            }
        }

        if (clickedItem.count > 1) {
            this.cartObjArr[this.cartObjArr.indexOf(clickedItem)].count -= 1

            this.reRenderCount(clickedItem)
        } else {
            this.cartObjArr.splice(this.cartObjArr.indexOf(clickedItem), 1)
            this.cart.querySelector(`.cart-item[data-id="${id}"]`).remove();
        }

        if (this.cart.childElementCount === 0) {
            this.#resetCart()
        }
    } // delete an item from the cart
    reRenderCount(clickedItem) {
        const block = this.cart.querySelector(`.cart-item[data-id="${clickedItem.id}"]`)
        block.querySelector('.cart-item__count').textContent = clickedItem.count
    } // rerender solo cart element
}

const cart = new Cart()
const catalog = new Catalog()

