<template>
	<div :class="wrapClass" @scroll="handlekInfiniteScroll">
		<ul class="store-choose-items-wrap">
			<li class="store-choose-item" v-for="(item, index) in itemsData" :key="`store-choose-item-${index}`">
				<div class="store-choose-item-left">
					<a :href="item.detailUrl"><img :src="item.productImg" /></a>
				</div>
				<div class="store-choose-item-right">
					<div class="store-choose-item-right-title">
						{{ item.productName }}
					</div>
					<div class="store-choose-item-right-info">
						<div class="store-choose-item-right-info-price">
							<p class="store-choose-product-price">{{ item.unit }}{{ item.sellPrice }}</p>
							<p class="store-choose-product-getprice">赚{{ item.unit }}{{ item.commission }}</p>
						</div>
						<div class="store-choose-item-btn">
							<i v-if="btnType.indexOf('add') > -1" @click="handleAdded(floorIndex, index, item)" class="store-choose-item-icon store-choose-item-add" :class="{'on': !item.hasAdded ? false : true}"></i>
							<i v-if="btnType.indexOf('dec') > -1" @click="handleDecrease(floorIndex, index, item)" class="store-choose-item-icon store-choose-item-dec"></i>
							<i v-if="btnType.indexOf('share') > -1" @click="handleShare(floorIndex, index, item)" class="store-choose-item-icon store-choose-item-share"></i>
						</div>
					</div>
				</div>
			</li>
		</ul>
		<mu-circular-progress class="items-circular-progress" v-show="loading" :size="30" color="red"/>
	</div>
</template>
<script>
export default {
	name: 'store-choose-items',
	props: {
		wrapClass: {
			type: String,
			default: ''
		},
		btnType: {
			type: [Object, Array],
			default: function() {
				return []
			}
		},
		itemsData: {
			type: [Object, Array],
			default: function() {
				return []
			}
		},
		floorIndex: {
			type: [String, Number],
			default: ''
		},
		unit: {
			type: String,
			default: ''
		},
		distance: {
			type: Number,
			default: 0
		},
		loading: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			
		}
	},
	computed: {
		
	},
	methods: {
		handleAdded(floorIndex, index, item) {
			this.$emit('handleAdded', floorIndex, index, item)
		},
		handleDecrease(floorIndex, index, item) {
			this.$emit('handleDecrease', floorIndex, index, item)
		},
		handleShare(floorIndex, index, item) {
			this.$emit('handleShare', floorIndex, index, item)
		},
		handlekInfiniteScroll(e) {
			if(this.loading) return;
			let target = e.target,
                scrollH = target.scrollHeight,
                targetH = target.offsetHeight,
                scrollT = target.scrollTop;
            if(targetH + scrollT + this.distance >= scrollH) {
				this.$emit('handlekInfiniteScroll', e, this.floorIndex);
			}
		}
	},
	mounted() {
		
	}
}
</script>
<style scoped>
	@import "./store-choose-items.css";
</style>