<template>
	<!-- 组件功能：团购页面，团购状态显示情况组件 -->
	<div class="group-join">
		<div class="group-person">
			<div class="group-person-wrap">
				<img v-for='user in userList' :src="userImg(user.headImgUrl)" :alt="user.nickName" />
				<i v-for='index in left' class="group-person-icon" ></i>
			</div>
		</div>
		<div v-if="groupStatus == 1" class="group-person-desc">
			<span class="group-blod">{{ left }}</span> person(s) to go, ends in
			<span v-if="remainTime > 0" class="group-blod" style="display: inline-block">
				<my-timer :remainTime="remainTime" @time-end="timeEnd"></my-timer>
			</span>
		</div>
		<div v-if="groupStatus == 2" class="group-person-desc">
			<span>The group is full.</span>
		</div>
		<div class="group-join-btn-wrap">
			<mu-raised-button :label="returnText(groupStatus)" color="#fff" class="group-join-btn" @click="onJoinCheck" />
		</div>
	</div>
</template>
<script>
import MyTimer from '../../components/timer/timer.vue'
export default {
	data() {
		return {
			isFull: false
		}
	},
	components: {
		MyTimer
	},
	props: ['userList', 'left', 'remainTime', 'groupStatus'],
	methods: {
		onJoinCheck() {
			this.$emit('openPopAttr')
		},
		timeEnd() {
			this.$emit('time-end')
		},
		userImg(url) {
			if (url) {
				return url
			} else {
				return '/static/img/pages/default_avatar@2x.png'
			}
		},
		returnText(status){
			if(status == 1){
				return 'Join Group';
			}
			if(status == 2 || status == 3 ){
				return 'Start a Group';
			}
		}
	},
	mounted() {
		// console.log(this.groupStatus)
		this.left = parseInt(this.left);
	}
}
</script>
<style scoped>
.group-join {
	padding-bottom: 20px;
}

.group-person {
	padding: 1.36rem 0;
}

.group-person-wrap {
	display: table;
	height: 3.57rem;
	margin: 0 auto;
}

.group-person-wrap img {
	width: 3.57rem;
	height: 3.57rem;
	margin: .43rem;
	border-radius: 50%;
}

.group-blod {
	display: inline-block;
	font-weight: bolder;
}

.group-join-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	background-color: #CD0E00;
	text-align: center;
	color: #fff;
	margin-top: .86rem;
	font-weight: bold;
	color: #CD0E00;
}

.group-person-icon {
	display: inline-block;
	background-image: url(/static/img/icons/group-head@2x.png);
	background-size: 100% 100%;
	width: 3.57rem;
	height: 3.57rem;
	margin: .43rem;
	vertical-align: middle;
}
</style>

