Vue.component('cart', {
    data() {
        return {
            cartApi: 'cart.json',
            cartProducts: [],

            allPrice: 0,

            visibility: false,
            isCartEmpty: false,

            img: 'https://imgholder.ru/600x300'
        }
    },
    template: `
        <div class="cart__container">
            <button class="cart-btn purp-btn" type="button"
                    @click="visibility = !visibility">Корзина</button>

            <div class="cart" :class="{hidden: !visibility}">
                <p v-show="isCartEmpty">Корзина пуста...</p>
                
                <cart-item v-for="product of this.cartProducts" 
                           :key="product.id" 
                           :product="product"
                           :img="img"
                           :data-id="product.id"
                           @deleteFromCart="deleteFromCart"></cart-item>
                <p>Общая стоимость корзины: {{allPrice}}</p>
            </div>
        </div>
    `,
    methods: {
        deleteFromCart(product) {
            // console.clear()
            console.log(`удаляем из корзины товар`)

            if (product.count > 1) {
                product.count -= 1
            } else {
                this.cartProducts.splice(this.cartProducts.indexOf(product), 1)
            }

            this.allPrice -= product.price

            if (this.cartProducts.length === 0) {
                this.isCartEmpty = true
            }
        },
        addToCart(product) {
            // console.clear()
            console.log(`добавляем в корзину товар`)

            const clickedItem = this.cartProducts.find(item => item.id === product.id)

            if (clickedItem) {
                clickedItem.count++
            } else {
                const prod = Object.assign({count: 1}, product)
                this.cartProducts.push(prod)
            }

            this.allPrice += product.price

            if (this.cartProducts.length > 0) {
                this.isCartEmpty = false
            }
        }
    },
    mounted() {
        this.$root.fetchProducts(this.cartApi)
            .then(data => {
                for (const el of data) {
                    this.cartProducts.push(el)
                    this.allPrice += el.price
                }
                console.log(this.cartProducts)
            })
    }
})

Vue.component('cart-item', {
    props: ['product', 'img'],
    template: `
        <div class="cart-item">
            <h3>{{product.title}}</h3>
            <img class="img-src" :src="img" :alt="product.title">
            <p>{{product.price}} рублей</p>
            <p>Количество: <span class="cart-item__count">{{product.count}}</span></p>
            <button class="del-btn purp-btn"
                    :data-id="product.id" 
                    @click="$emit('deleteFromCart', product)">Убрать</button>
        </div>
    `
})
