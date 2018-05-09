<template>
	<!-- 组件功能：团购列表显示列表 -->
	<div class="detail-join-list" :style="boxStyle">
		<ul>
			<li v-for="(item,index) in joinList" :key="index">
				<div class="detail-join-list-img"><img :src="userImg(item.users[0] && item.users[0].headImgUrl)" /></div>
				<div class="detail-join-list-con">
					<p class="detail-join-list-title">{{ item.users[0] && item.users[0].nickName }}</p>
					<p class="detail-join-list-desc">{{ item.desc }}</p>
				</div>
				<!-- <router-link ref="btn-detail-join" class="btn-detail-join-list" :to="'/group/' + item.groupId">{{ btnTxt[item.groupStatus] }}</router-link> -->
				<a ref="btn-detail-join" class="btn-detail-join-list" :href="'/group/' + item.groupId">{{ btnTxt[item.groupStatus] }}</a>
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	name: 'detail-join-list',
	data () {
        return {
			btnTxt: {
				1: 'Join'
			}
		}
    },
    props: {
    	boxStyle: {},
    	joinList: {
    		type: Array,
    		default: []
    	}
	},
	methods:{
		userImg(url){
			if(url){
				return url
			}else {
				return '/static/img/pages/default_avatar@2x.png'
			}
		}
	}
}
</script>
<style scoped>
    @import './detail-join-list.css';
</style>
