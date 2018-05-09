<template>
	<ul class="store-card-ul">
		<li v-for="(item, index) in items" :key="`store-card-item-${index}`" >
			<div class="store-card">
				<router-link :to="`/detail/${item.productId}`">
					<img class="store-card-img" :src="item.productImg" />
				</router-link>
				<div class="store-card-info">
					<div class="store-card-info-left">
						<p v-show="item.discount">
							<span>{{ item.discount }}</span>折
						</p>
					</div>
					<div class="store-card-info-mid">
						<p class="store-card-info-mid-sellprice">{{ item.unit }}{{ item.sellPrice }}</p>
						<p v-if="item.sellPrice < item.marketPrice" class="store-card-info-mid-marketprice">{{ item.unit }}{{ item.marketPrice }}</p>
					</div>
					<i class="icon-store-card icon-buy" @click="handleClick(index, item)"></i>
				</div>
			</div>
		</li>
	</ul>
</template>
<script>
export default {
	name: 'store-card',
	props: {
		items: {
			type: Array,
			default: () => {
				return []
			}
		}
	},
	data() {
		return {
			
		}
	},
	computed: {
		
	},
	methods: {
		handleClick(index, item) {
			this.$emit('handleClick', index, item);
		}
	},
	mounted() {
		
	}
}
</script>
<style scoped>
	@import "./store-card.css";
</style>