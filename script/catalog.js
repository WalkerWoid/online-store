Vue.component('catalog', {
    data() {
        return {
            catalogApi: 'catalog.json',
            catalogProducts: [],
            filteredProducts: [],
            isError: false,
            img: 'https://imgholder.ru/600x300',
        }
    },
    template: `
        <div class="products__container">
            <error-catalog v-if="isError" ref="errorCatalog"></error-catalog>

            <product-item
                v-for="product of this.filteredProducts"
                :product="product"
                :data-id="product.id"
                :key="product.id"
                :img="img">
            </product-item>
        </div>
    `,
    methods: {
        filterItems(searchText = '') {
            console.log(searchText)
            if (searchText.length >= 0 && searchText.length === 2) {
                return
            }

            const regexp = new RegExp(searchText, 'i')
            this.filteredProducts = this.catalogProducts.filter(item => regexp.test(item.title))
        }
    },
    mounted() {
        this.$root.fetchProducts(this.catalogApi)
            .then(data => {
                for (const el of data) {
                    this.catalogProducts.push(el)
                    this.filteredProducts.push(el)
                }
            })
            .catch(error => {
                this.isError = true
                console.log(error)
            })
    }
})
Vue.component('product-item', {
    props: ['product', 'img'],
    template: `
        <div class="product-item"
             :data-id="product.id">
            <h3>{{product.title}}</h3>
            <img class="img-src" :src="img" :alt="product.title">
            <p>{{product.price}} рублей</p>
            <button class="buy-btn purp-btn"
                    :data-id="product.id"
                    @click="$root.$refs.cart.addToCart(product)">Купить</button>
        </div>
    `
})