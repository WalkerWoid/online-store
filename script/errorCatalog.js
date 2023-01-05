Vue.component('error-catalog', {
    data() {
        return {
            errorText: 'Товары не найдены'
        }
    },
    template: `
        <p>{{errorText}}</p>
    `,
    methods: {
        setErrorText(errorText) {
            this.errorText = errorText
        }
    }
})