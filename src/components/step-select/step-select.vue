<template>
<!-- 组件功能：用户地址的选择国家，地区的选项框 -->
	<div class="select-box" :class="selectBoxClass">
		<p :class="[`${labelClass}`, !!isfocus ? 'on': '']">{{ selectData.value }}</p>
		<select class="select-box-con" :disabled="disabled" :ref="refName" @change="handleChange">
			<option v-for="(item, index) in items" :key="index" :selected="item.value == selectData.value" :value="item.value" >{{ item.value }}</option>
		</select>
		<div><hr class="mu-text-field-line"> <hr class="mu-text-field-focus-line"></div>
	</div>
</template>
<script>
export default {
	name: 'step-select',
	props: ['selectBoxClass', 'label', 'labelClass', 'selectVal', 'disabled', 'items', 'refName'],
	data() {
		return {
			isfocus: false,
			selectData:{
				key: '',
				value: ''
			}
		}
	},
	methods: {
		handleChange() {
			let val = this.$refs[this.refName].value;
			let key = '';
			this.items.map((item) => {
				if(item.value == val) {
					key = item.key;
				}
			});
			this.selectData.value = val;
			this.selectData.key = key;
			this.$emit('selectChange', {
				val: val,
				key: key
			});
			this.isfocus = true;
		}
	},
	mounted() {
		this.items.map((item) => {
			if(item.value == this.selectVal) {
				this.isfocus = true;
				this.selectData.value = item.value;
				this.selectData.key = item.key;
			}
		});
		if(!this.isfocus){
			this.selectData.value = this.items[0].value;
			this.selectData.key = this.items[0].key;
			this.$emit('selectChange', {
				val: this.selectData.value,
				key: this.selectData.key
			});
			this.isfocus = true;
		}
	}
}
</script>
<style scoped>
@import "./step-select.css";
</style>