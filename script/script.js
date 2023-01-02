const API = 'https://raw.githubusercontent.com/WalkerWoid/online-store-api/main'

const app = new Vue({
    el: '#app',
    data: {
        products: [],
        cartProducts: [],
        filteredItems: [],
        imgSrc: 'https://imgholder.ru/600x300',
        cartVisibility: false,
        isCartEmpty: false,
        allPriceCart: 0,
        inputText: ''
    },
    methods: {
        fetchProducts(url) {
            return fetch(url)
                .then(data => data.json())
                .catch(error => console.log(error))
        },
        addToCart(product) {
            console.clear()
            console.log(`добавляем в корзину товар`)

            const isItemExist = this.isCartItemExist(product.id)

            if (isItemExist) {
                this.cartProducts.forEach(item => {
                    if (item.id === product.id) {
                        item.count++
                    }
                })
            } else {
                this.cartProducts.push(product)
            }

            this.allPriceCart += product.price

            if (this.cartProducts.length > 0) {
                this.isCartEmpty = false
            }
        },
        isCartItemExist(id) {
            let isItemExist = false
            this.cartProducts.forEach(item => {
                if (item.id === id) {
                    isItemExist = true
                }
            })

            return isItemExist
        },
        deleteFromCart(cartProduct) {
            console.clear()
            console.log(`удаляем из корзины товар`)

            if (cartProduct.count > 1) {
                cartProduct.count -= 1
            } else {
                this.cartProducts.splice(this.cartProducts.indexOf(cartProduct), 1)
            }

            this.allPriceCart -= cartProduct.price

            if (this.cartProducts.length === 0) {
                this.isCartEmpty = true
            }
        },
        changeCartVisibility() {
            this.cartVisibility = !this.cartVisibility
        },
        cartFilter() {
            const text = this.inputText

            if (text.length <= 2 && text.length > 0) {
                return
            }
            const regExp = new RegExp(text, 'i')

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
    },
    mounted() {
        this.fetchProducts(`catalog.json`)
            .then(data => {
                for (const item of data) {
                    this.products.push(item)
                }
            })
        this.fetchProducts(`${API}/cart.json`)
            .then(data => {
                for (const item of data) {
                    this.cartProducts.push(item)
                    this.allPriceCart += item.price
                }
            })
    }
})