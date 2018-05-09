<template>
	<div class="cart-item-box">
		<div class="cart-item-wrap">
			<div class="cart-item-left">
				<router-link :to="`/detail/${itemdata.skuId}`">
					<img class="cart-product-img" :src="itemdata.imgUrl" alt="">
				</router-link>
			</div>
			<div class="cart-item-mid">
				<div class="cart-product-title">
					<router-link :to="`/detail/${itemdata.skuId}`"><p>{{ itemdata.productName }}</p></router-link>
					<span @click="handledel">X</span>
				</div>
				<div class="cart-product-info">
					<div class="cart-product-info-left">
						<p class="cart-product-info-attr"></p>
						<p class="cart-product-info-sellprice">{{ itemdata.unit }}{{ itemdata.sellPrice }}</p>
						<p v-if="itemdata.sellPrice < itemdata.marketPrice" class="cart-product-info-marketprice">{{ itemdata.unit }}{{ itemdata.marketPrice }}</p>
					</div>
					<div class="cart-product-info-right">
						<button ref="btndec" href="javascript:void(0)" @click="handledec" class="cart-product-dec" :class="{off: disableDec}">-</button>
						<span class="cart-product-quanty">{{ itemdata.quantity }}</span>
						<button ref="btnadd" href="javascript:void(0)" @click="handleadd" class="cart-product-add" :class="{off: disableAdd}">+</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "cart-item",
	props: {
		itemdata: {		// 列表数组
			type: Object,
			default: () => {
				return {}
			}
		},
		currindex: {	// 当前数组下标
			type: Number,
			default: ''
		},
		disableDec: {	// 是否允许点击减少
			type: Boolean,
			default: false
		},
		disableAdd: {	// 是否允许点击增加
			type: Boolean,
			default: false
		}
	},  
  	data() {
    	return {
			
    	}
	},
	watch: {
		disableDec(val) {
			this.setAttrDisableState(this.$refs.btndec, val);
		},
		disableAdd(val) {
			this.setAttrDisableState(this.$refs.btnadd, val);
		}
	},
  	methods: {
		handledec() {
			this.$emit('handledec', this.currindex, this.itemdata);
		},
		handleadd() {
			this.$emit('handleadd', this.currindex, this.itemdata);
		},
		handledel() {
			this.$emit('handledel', this.currindex, this.itemdata);
		},
		// 设置加购按钮状态
		setAttrDisableState($el, val) {
			if(val) {
				$el.setAttribute('disabled', 'disabled');
			} else {
				$el.removeAttribute('disabled');
			}
		}
  	},
  	mounted() {
		this.setAttrDisableState(this.$refs.btndec, this.disableDec);
		this.setAttrDisableState(this.$refs.btnadd, this.disableAdd);
  	}
}
</script>
<style src="./cart-item.css" scoped></style>