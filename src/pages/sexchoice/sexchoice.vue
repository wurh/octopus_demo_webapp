<template>
	<div class="sex-container">
		<div class="sex-header">Choose your gender</div>
		<div style="margin-top: 3rem">
			<mu-flat-button class="demo-flat-button" :backgroundColor="female.bg" :color="female.color" v-on:click="selectFemale">
				<i class="iconfont">&#xe7e4;</i>
			</mu-flat-button>
			<div class="sex-name">Female</div>
		</div>
		<div>
			<mu-flat-button class="demo-flat-button below" :backgroundColor="male.bg" :color="male.color" v-on:click="selectMale">
				<i class="iconfont">&#xe619;</i>
			</mu-flat-button>
			<div class="sex-name">Male</div>
		</div>
		<mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
		<mu-raised-button label="Next" class="next-btn" v-on:click="sendSex" />
	</div>
</template>

<script>
import ajax from '../../lib/ajax'
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import poclog from '../../util/poclog';
export default {
	data() {
		return {
			toast: false,
			showMsg: '',
			sex: 0,
			toastTimer: '',
			female: {
				bg: '#D8D8D8',
				color: '#666'
			},
			male: {
				bg: '#D8D8D8',
				color: '#666'
			},
            start_time: ''
		}
	},
	methods: {
		hideToast () {
			this.toast = false
			if (this.toastTimer) clearTimeout(this.toastTimer)
		},
		showToast () {
			this.toast = true
			if (this.toastTimer) clearTimeout(this.toastTimer)
			this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
		},
		sendSex() {
			var that = this;
			if(that.sex == 0){
				that.showMsg = 'select your sex';
				that.showToast ();
				return
			}
			ajax.post('/api/user/update_user_sex',{sex: that.sex}, function (data) {
				//location.href = '/tagchoice'
				that.$router.push('/tagchoice')
			}, function (data) {
				if(data.msg){
					that.showMsg = data.msg;
					that.showToast ();
				}
			})
		},
		selectFemale() {
			this.female.bg = '#CD0E00';
			this.female.color = '#fff';
			this.male.bg = '#D8D8D8';
			this.male.color = '#666';
			this.sex = 1;
		},
		selectMale() {
			this.female.bg = '#D8D8D8';
			this.female.color = '#666';
			this.male.bg = '#CD0E00';
			this.male.color = '#fff';
			this.sex = 2;
		},
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_checkout',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
	},
	mounted() {
		let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.height = h + 'px';
		this.start_time = new Date().getTime();
		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
		wxAction.init({
			hideAllMenuItem: true
		});
		PageviewGA.onPageViewFired(this.$route.path)
	}

}
</script>

<style scoped>
.sex-header {
	height: 5rem;
	line-height: 5rem;
	font-size: 1.29rem;
	font-weight: bold;
	color: #333;
}

.demo-flat-button {
	width: 7.86rem;
	height: 7.86rem;
	border-radius: 50%;
	background-color: #eaeaea;
	text-align: center;
	margin: 0 auto;
	position: relative;
}

.demo-flat-button img {
	width: 2.49rem;
	height: 2.49rem;
	display: block;
	position: absolute;
	top: 2.72rem;
}

.sex-container .below {
	margin-top: 2.4rem;
}

.sex-name {
	font-size: 1.14rem;
	color: #333;
}

.next-btn {
	width: 22rem;
	height: 3.5rem;
	border-radius: 50px;
	background-color: #CD0E00;
	color: #fff;
	font-size: 1.14rem;
	position: fixed;
	bottom: 3rem;
	left: 50%;
	margin-left: -11rem;
}

@font-face {
	font-family: 'iconfont';
	src: url('font/iconfont.eot');
	src: url('font/iconfont.eot?#iefix') format('embedded-opentype'),
	url('font/iconfont.woff') format('woff'),
	url('font/iconfont.ttf') format('truetype'),
	url('font/iconfont.svg#iconfont') format('svg');
}

.iconfont {
	font-family: "iconfont" !important;
	font-size: 16px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-webkit-text-stroke-width: 0.2px;
	-moz-osx-font-smoothing: grayscale;
	font-size: 2.49rem;
}
</style>
