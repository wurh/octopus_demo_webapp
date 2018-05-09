<template>
<!-- 组件功能：商品详情页面的猜你喜欢 -->
	<div class="you-may-also-like-box">
        <div class="you-may-also-like-box-title">
            {{ title }}
        </div>
        <ul class="">
            <li v-for="(key, index) in items" :key="index">
                <a :href="`/detail/${key.id}`" class="you-may-also-like-link" >
                    <img :src="key.imgUrl" />
                    <p>{{ unit }}{{ key.groupPurchase.price }} <span v-if="key.groupPurchase.marketPrice > key.groupPurchase.price">{{ unit }}{{ key.groupPurchase.marketPrice }}</span></p>
                </a>
            </li>
        </ul>
	</div>
</template>
<script>
export default {
    name: 'you-may-also-like',
    data() {
    	return {
            title: 'You may also like',
    	}
    },
    methods: {
        // goDetail(id){
        //     this.$router.go('/detail/' + id)
        // }
    },
    props: {
    	items: {
			type: Array,
    		default: []
        },
        unit: {
            type: String
        }
    }
}
</script>
<style scoped>
    @import "./you-may-also-like.css";
</style>
