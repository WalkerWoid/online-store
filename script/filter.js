Vue.component('search-field', {
    data() {
        return {
            searchText: ''
        }
    },
    template: `
        <div class="filter__container">
            <form action="#">
                <input class="filter-catalog" type="text" placeholder="Поиск по каталогу..."
                       v-model="searchText" @input="$root.$refs.catalog.filterItems(searchText)">
            </form>
        </div>
    `,
})