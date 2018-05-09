<template>
	<div class="group-success-wrap">
		<div style="padding: 1.36rem 0;">
			<div class="group-success-icon">
				<i class="iconfont-success">&#xe69d;</i>
			</div>
		</div>
		<div style="text-align: center;color: #35B132">{{ text }}</div>
		<div v-if="groupStatus == 1" class="group-person-desc">
			<span class="group-blod">{{ left }}</span> person(s) to go,ends in
			<span v-if="remainTime > 0" class="group-blod" style="display: inline-block">
				<my-timer :remainTime='remainTime' @time-end="timeEnd"></my-timer>
			</span>
		</div>
		<div class="group-success-btn-wrap">
			<mu-raised-button v-if="groupStatus == 1" label="Invite Friends" class="group-invite-btn" @click="onShare" />
			<mu-raised-button label="View Order" class="group-success-btn" :to="'/orderDetail?orderId=' + orderId" />
		</div>
		<div class="group-success-person-wrap">
			<img v-for='user in userList' :src="userImg(user.headImgUrl)" :alt="user.nickName" />
			<i v-for='index in left' class="group-person-icon"></i>
		</div>
	</div>
</template>
<script>
import MyTimer from '../../components/timer/timer.vue'
export default {
	data() {
		return {
			text: ''
		}
	},
	components: {
		MyTimer
	},
	props: ['userList', 'left', 'remainTime', 'orderId', 'groupStatus'],
	methods: {
		onShare() {
			this.$emit('show-Share')
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
		}
	},
	mounted() {
		this.left = parseInt(this.left);
		if (this.groupStatus == 1) {
			this.text = 'Start a group purchase complete!';
		}else {
			this.text = 'Group purchase complete!'
		}
	}
}
</script>
<style scoped>
.group-success-btn-wrap {
	position: relative;
	margin-top: 1.71rem;
}

.group-success-btn-wrap .group-success-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	border: 1px solid #CD0E00;
	font-size: 1.14rem;
	text-align: center;
	margin: 0 auto;
	color: #CD0E00;
}

.group-success-btn-wrap .group-invite-btn {
	width: 21.43rem;
	height: 3.5rem;
	border-radius: 30px;
	border: 1px solid #CD0E00;
	font-size: 1.14rem;
	text-align: center;
	margin: 0 auto;
	background-color: #CD0E00;
	color: #fff;
	margin-bottom: .86rem;
}
</style>
<style scoped>
.group-success-wrap {
	padding-bottom: 1.36rem;
}

@font-face {
	font-family: 'iconfont-success';
	src: url('font/iconfont.eot');
	src: url('font/iconfont.eot?#iefix') format('embedded-opentype'),
	url('font/iconfont.woff') format('woff'),
	url('font/iconfont.ttf') format('truetype'),
	url('font/iconfont.svg#iconfont') format('svg');
}

.group-success-icon {
	width: 3.57rem;
	height: 3.57rem;
	background-color: #35B132;
	border-radius: 50%;
	margin: 0 auto;
}

.group-success-icon .iconfont-success {
	font-family: "iconfont-success" !important;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
	font-size: 1.44rem;
	color: #fff;
	line-height: 3.57rem;
}

.group-success-person-wrap {
	display: table;
	height: 3.57rem;
	margin: 2rem auto 0;
}

.group-success-person-wrap img {
	width: 3.57rem;
	height: 3.57rem;
	margin: .43rem;
	float: left;
	border-radius: 50%;
}

.group-blod {
	display: inline-block;
	font-weight: bolder;
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

