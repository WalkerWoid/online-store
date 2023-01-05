const app = new Vue({
    el: '#app',
    data: {
        api: 'https://raw.githubusercontent.com/WalkerWoid/online-store-api/main',
    },
    methods: {
        fetchProducts(url) {
            return fetch(`${this.api}/${url}`)
                .then(data => data.json())
                .catch(error => console.log(error))
        }
    }
})



// const API = 'https://raw.githubusercontent.com/WalkerWoid/online-store-api/main'
//
// const app = new Vue({
//     el: '#app',
//     data: {
//         products: [],
//         cartProducts: [],
//         filteredItems: [],
//         imgSrc: 'https://imgholder.ru/600x300',
//         cartVisibility: false,
//         isCartEmpty: false,
//         allPriceCart: 0,
//         inputText: ''
//     },
//     methods: {
//         fetchProducts(url) {
//             return fetch(url)
//                 .then(data => data.json())
//                 .catch(error => console.log(error))
//         },
//         addToCart(product) {
//             console.clear()
//             console.log(`добавляем в корзину товар`)
//
//             const clickedItem = this.cartProducts.find(item => item.id === product.id)
//
//             if (clickedItem) {
//                 clickedItem.count++
//             } else {
//                 const prod = Object.assign({count: 1}, product)
//                 this.cartProducts.push(prod)
//             }
//
//             this.allPriceCart += product.price
//
//             if (this.cartProducts.length > 0) {
//                 this.isCartEmpty = false
//             }
//         },
//         deleteFromCart(cartProduct) {
//             console.clear()
//             console.log(`удаляем из корзины товар`)
//
//             if (cartProduct.count > 1) {
//                 cartProduct.count -= 1
//             } else {
//                 this.cartProducts.splice(this.cartProducts.indexOf(cartProduct), 1)
//             }
//
//             this.allPriceCart -= cartProduct.price
//
//             if (this.cartProducts.length === 0) {
//                 this.isCartEmpty = true
//             }
//         },
//         changeCartVisibility() {
//             this.cartVisibility = !this.cartVisibility
//         },
//         cartFilter() {
//             const text = this.inputText
//
//             if (text.length <= 2 && text.length > 0) {
//                 return
//             }
//             const regExp = new RegExp(text, 'i')
//             this.filteredItems = this.products.filter(item => regExp.test(item.title))
//         }
//     },
//     mounted() {
//         this.fetchProducts(`${API}/catalog.json`)
//             .then(data => {
//                 for (const item of data) {
//                     this.products.push(item)
//                     this.filteredItems.push(item)
//                 }
//             })
//         this.fetchProducts(`${API}/cart.json`)
//             .then(data => {
//                 for (const item of data) {
//                     this.cartProducts.push(item)
//                     this.allPriceCart += item.price
//                 }
//             })
//     }
// })