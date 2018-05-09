<template>
    <div class="footer-wrap">
        <mu-paper>
            <mu-bottom-nav :value="bottomNav" @change="handleChange">
                <mu-bottom-nav-item value="discover" title="Discover" icon="youtube_searched_for"></mu-bottom-nav-item>
                <mu-bottom-nav-item value="shopnow" title="Shop Now" icon="shop_two"></mu-bottom-nav-item>
                <mu-bottom-nav-item value="shoppingcart" title="Cart" icon="shopping_cart"></mu-bottom-nav-item>
                <mu-bottom-nav-item value="person" title="Me" icon="person_pin"></mu-bottom-nav-item>
            </mu-bottom-nav>
        </mu-paper>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                bottomNav: 'discover'
            }
        },
        methods: {
            handleChange (val) {
                this.bottomNav = val
                if(val !== 'discover'){
                    this.$router.push('/'+val)
                }else{
                    this.$router.push('/')
                }
            }
        },
        created(){
            const currentRoute = this.$router.currentRoute.name;
            if(currentRoute !== 'index'){
               this.bottomNav = currentRoute;
            }
        }
    }
</script>

<style scoped>
    @import "footer.css";
</style>
