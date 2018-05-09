<template>
	<div class="facebook-comunity-list" :style="boxStyle">
		<ul>
			<li v-for="item in list">
				<div class="facebook-comunity-list-top">
					<img :src="item.imgUrl" />
					<span class="facebook-comunity-username">{{ item.username }}</span>
					<span class="facebook-comunity-time">{{ item.time }}</span>
				</div>
				<div class="facebook-comunity-list-mid">{{ item.desc }}</div>
				<div class="facebook-comunity-list-bottom">{{ item.skuArr }}</div>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
    name: 'facebook-list',
    props: ['boxStyle', 'list']
}
</script>
<style scoped>
    @import './facebook-comunity-list.css'
</style>
