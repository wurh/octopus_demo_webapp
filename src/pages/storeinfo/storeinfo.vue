<template>
    <section class="container store-wrap">
        <store-header :headerData="headerData" />
        <div class="store-info-box">
            <h5 class="store-info-title">店铺自提地址</h5>
            <p class="store-info-desc">{{ headerData.address.address1 }}, {{ headerData.address.city }}, {{ headerData.address.state }} {{ headerData.address.postcode }} {{ headerData.address.countryName }}</p>
        </div>
        <div class="store-info-box">
            <h5 class="store-info-title">联系邮箱</h5>
            <p class="store-info-desc">{{ headerData.email }}</p>
        </div>
    </section>
</template>

<script>
import ajax from '../../lib/ajax';
import PageviewGA from '@/components/g-com/g-pageview.js'
import wxAction from '../../util/wx-action';
import cookie from '../../lib/cookie';
import storeHeader from '@/components/store-header/store-header.vue';


export default {
    name: 'storeinfo',
    components: {
        storeHeader
    },
    data() {
        return {
            headerData: {
                address: {}
            }
        }
    },
    methods: {

    },
    mounted() {
        let _this = this;
        ajax.get('/api/store/info', {
            storeId: _this.$route.params.storeid,
            userId: ''
        }, res => {
            _this.headerData = res;
        })
    }
}
</script>
<style src="./storeinfo.css" scoped></style>