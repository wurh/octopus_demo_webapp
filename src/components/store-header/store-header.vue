<template>
	<div :class="wrapClass">
		<div style="display:none" v-title>{{ headerData.storeName }}</div>
		<div class="store-header-wraper">
			<account-header
				wrapClass="store-header-op" 
				:isWhite="true"
				:title="headerData.storeName" 
				linkTo="/store/account">
			</account-header>
			<div class="headbackground" :style="`background-image: url('${headerData.headImgUrl}')`">
				<div class="store-account-bg"></div>
				<div class="store-account-bg-op"></div>
				<img class="store-account-userimage cut-circle" :src="headerData.headImgUrl">
			</div>
			<div class="store-header-info">
				<h5 class="store-header-info-name">{{ headerData.storeName }}</h5>
				<p class="store-header-info-desc">{{ headerData.note }}</p>
				<div class="store-header-info-slot">
					<slot :slot-scope="headerData"></slot>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import accountHeader from "../../components/account-header/account-header";
export default {
	name: 'store-choose-items',
	props: {
		wrapClass: {
			type: String,
			default: ''
		},
		headerData: {
			type: Object,
			default: function() {
				return {}
			}
		}
	},
	components: {
		accountHeader
	},
	data() {
		return {
			
		}
	},
	computed: {
		
	},
	methods: {
		
	},
	mounted() {
		
	}
}
</script>
<style scoped>
	@import "./store-header.css";
</style>