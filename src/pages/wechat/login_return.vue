<template>
 <mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
</template>
<script>
import ajax from '../../lib/ajax'

export default {
    components: {},
    data(){
        return {
            showMsg: '',
			toast: false,
			toastTimer:''
        }
    },
    methods: {
        hideToast () {
			this.toast = false
			if (this.toastTimer) clearTimeout(this.toastTimer)
		},
		showToast (callback) {
			this.toast = true
			if (this.toastTimer) clearTimeout(this.toastTimer)
			this.toastTimer = setTimeout(() => { 
                this.toast = false
                callback && callback()
            }, 1000)
        }
    },
    mounted() {
        let that= this,
            code = that.$route.query.code,
            sendData = {
                code: code,
                platform: 'wap'
            }
        ajax.post('/api/wechat/auth', sendData, function(data){
            if(!data.sex){
                //location.href = '/sexchoice'
                that.$router.push('/sexchoice')
            }else if(!data.hasUserTag){
                //location.href = '/tagchoice'
                that.$router.push('/tagchoice')
            }else{
                //location.href = '/'
                that.$router.push('/')
            }
        },function(data){
            that.showMsg = data.msg
            that.showToast(function(){
                //location.href = '/login'
                that.$router.push('/login')
            })
        })
    }
}
</script>