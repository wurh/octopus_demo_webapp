<template>
	<div class="cart-wrap">
		<!-- 头部 -->
		<div style="display:none" v-title>{{ pageTitle }}</div>
    	<account-header wrapClass="account-header-wrap" :title="pageTitle"></account-header>
		<!-- 列表 -->
		<div class="cart-items">
			<cart-item v-for="(item, index) in cartItems" 
				:key="`cart-items-${index}`" 
				:currindex="index"
				:itemdata="item"
				:disableDec="item.disableDec"
				:disableAdd="item.disableAdd"
				@handledec="handledec" 
				@handleadd="handleadd"
				@handledel="handledel"
			/>
		</div>
		<div class="total-count-fixed">
			<div class="total-count-info">
				共{{ productCount }}件商品  合计<span>{{ unit }}{{ total }}</span>
			</div>
			<router-link :to="`/checkout/${ storeId }?orderType=${ orderType }`">
				<mu-raised-button labelClass="btn-gotopay" label="去结算" backgroundColor="#CD0E00" class="demo-raised-button" secondary/>
			</router-link>
		</div>
		<mu-dialog dialogClass="dialog-box" :open="dialog" @close="close">
			是否确认删除该商品
			<mu-raised-button slot="actions" @click="close" label="取消"/>
			<mu-raised-button slot="actions" @click="handleDelSumbit" label="删除"/>
		</mu-dialog>
		<!-- 尾部 -->
		<store-footer ref="footer" :items="footerItems" />
	</div>
</template>
<script>
import ajax from '../../lib/ajax';
import accountHeader from "../../components/account-header/account-header";
import cartItem from "@/components/cart-item/cart-item.vue";
import storeFooter from "@/components/footer-defined/footer-defined.vue";

export default {
	name: "cart",
	components: {
		accountHeader,
		cartItem,
		storeFooter
	},
	data() {
		return {
			pageTitle: "购物车",
			cartItems: [],
			productCount: '',
			total: '',
			dialog: false,
			currIndex: null,
			storeId: "",
			orderType: 1,
			footerItems: [{
				// 尾部配置
				title: "店铺精选", // 描述
				detailUrl: `/store/salelist/${this.$route.params.storeid}`, // 跳转链接
				iconUrl_on: "/static/img/icon-footer-store/icon-store-on.png", // 选中图标路径
				iconUrl_off: "/static/img/icon-footer-store/icon-store.png", // 未选中图标路径
				action: false // 切换选中状态（true 选中 false 未选中）
				}, {
				title: "购物车",
				detailUrl: `/cart/${this.$route.params.storeid}`,
				iconUrl_on: "/static/img/icon-footer-store/icon-buy-on.png",
				iconUrl_off: "/static/img/icon-footer-store/icon-buy.png",
				action: true
				}, {
				title: "个人中心",
				detailUrl: `/account/${this.$route.params.storeid}`,
				iconUrl_on: "/static/img/icon-footer-store/icon-self-on.png",
				iconUrl_off: "/static/img/icon-footer-store/icon-self.png",
				action: false
			}],
			unit: ''
		}
	},
	methods: {
		handledec(index, item) {
			let _this = this;
			_this.handleProductModify({
				skuId: item.skuId,
				type: 2, // 1：加，2：减，3：删除
				storeId: _this.$route.params.storeid
			}, _this.updata);
			// console.log(index, item)
		},
		handleadd(index, item) {
			let _this = this;
			_this.handleProductModify({
				skuId: item.skuId,
				type: 1, // 1：加，2：减，3：删除
				storeId: _this.$route.params.storeid
			}, _this.updata);
			// console.log(index, item)
		},
		handledel(index, item) {
			this.currIndex = index;
			this.open();
		},
		handleDelSumbit() {
			let _this = this;
			// console.log(_this.currIndex)
			_this.handleProductModify({
				skuId: _this.cartItems[_this.currIndex].skuId,
				type: 3, // 1：加，2：减，3：删除
				storeId: _this.$route.params.storeid
			}, data => {
				_this.close();
				_this.updata(data);
			});
			
		},
		open () {
			this.dialog = true
		},
		close () {
			this.dialog = false
		},
		handleProductModify(param, callback) {
			ajax.post('/api/shoppingcart/modify', param, callback);
		},
		updata(data) {
			let _this = this;
			_this.productCount = data.productCount;
			_this.unit = data.unit;
			_this.total = data.total;
			if(!data.productList || data.productList.length <= 0) {
				_this.cartItems = [];
				return;
			}
			for(let i = 0, len = data.productList.length; i < len; i++) {
				_this.cartItems[i] = {
					unit : data.unit,
					quantity : data.productList[i].quantity,
					disableDec : data.productList[i].quantity <= 1 ? true : false,
					disableAdd : data.productList[i].quantity >= 10 ? true : false,
					productName : data.productList[i].productName,
					sellPrice : data.productList[i].sellPrice,
					marketPrice : data.productList[i].marketPrice,
					skuId: data.productList[i].skuId,
					imgUrl: data.productList[i].imgUrl
				}
			}
		}
	},
	mounted() {
		let _this = this;
		_this.storeId = _this.$route.params.storeid;
		ajax.get('/api/shoppingcart/get_cart', {
			storeId: _this.storeId,
			orderType: _this.orderType,
		}, _this.updata)
	}
};
</script>
<style src="./cart.css" scoped></style>
