<template>
<!-- 组件功能：定时器 -->
	<p>{{time}}</p>
</template>

<script>
import moment from 'moment';
export default {
	data() {
		return {
			time: '',
			flag: false,
			setEndTime: new Date()
		}

	},
	mounted() {
		this.setEndTime = new Date(new Date().getTime() + this.remainTime)
		let time = setInterval(() => {
			if (this.flag == true) {
				clearInterval(time)
			}
			this.timeDown()
		}, 500)
	},
	props: {
		remainTime: {
			type: Number
		}
	},
	methods: {
		timeDown() {
			var leftTime = parseInt((moment(this.setEndTime).diff(moment())) / 1000);
			let d = parseInt(leftTime / (24 * 60 * 60))
			let h = this.formate(parseInt(leftTime / (60 * 60) % 24))
			let m = this.formate(parseInt(leftTime / 60 % 60))
			let s = this.formate(parseInt(leftTime % 60))
			if (leftTime <= 0) {
				this.flag = true
				this.$emit('time-end')
			}
			if (d > 0) {
				this.time = `${d} day(s) ${h}:${m}:${s}`
			} else {
				this.time = `${h}:${m}:${s}`
			}
		},
		formate(time) {
			if (time >= 10) {
				return time
			} else if (time < 0) {
				return '00'
			} else {
				return `0${time}`
			}
		},

		judeBrowsers() {
			var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
			var isOpera = userAgent.indexOf("Opera") > -1;
			if (isOpera) {
				return "Opera"
			}
			; //判断是否Opera浏览器
			if (userAgent.indexOf("Firefox") > -1) {
				return "FF";
			} //判断是否Firefox浏览器
			if (userAgent.indexOf("Chrome") > -1) {
				return "Chrome";
			}
			if (userAgent.indexOf("Safari") > -1) {
				return "Safari";
			} //判断是否Safari浏览器
			if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
				return "IE";
			}
		}
	}
}
</script>


