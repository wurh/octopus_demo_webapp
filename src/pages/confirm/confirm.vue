<template>
    <section class="confirm-wrap">
        <!-- 信封logo -->
        <div class='confirm-logo'></div>
        <!-- 说明文字 -->
        <div class='confirm-text'>
            We have sent the verification code to your registered mailbox: 
            <span class="confirm-eamil-address">{{emailAddress}}</span>, please enter the verification code to <span v-if="fromType == 2">reset your password.</span> <span v-if="fromType == 1">complete the registration.</span><br>
            <p class="confirm-reset-text" v-if="fromType == 2">If you don’t receive the email, check your spam or click to reacquire.</p>
        </div>
        <!-- 表单 -->
        <div class="confirm-form">
            <div class="form-text">Verification Code</div>
            <div class="form-input-box">
                <mu-text-field 
                    v-model="verificationCode"  
                    :errorText="errorText" 
                    type="text" 
                    input-class="input-class" 
                    hintText="verification code" 
                    underlineClass='input-underline' 
                    underlineFocusClass='input-underline-focus' 
                    hintTextClass="confirm-hint" 
                    helpTextClass="input-helptext"
                    @input='inputChange(verificationCode)'>
                </mu-text-field>
                <span class="confirm-time-btn" :class="{conirm_timeout_btn:isTimeout}" @click="ResentCode">{{countDownText}}</span>
            </div>
        </div>
        <!-- 确定按钮 -->
        <div class="confirm-submit-btn" :class="{confirm_btn_active:isCorrectNum}" @click="submitCode()">Confirm</div>
        
        <!-- 弹窗 -->
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
        <over-layer :isLoading="Loading"></over-layer>
    </section>
</template>

<script>
import ajax from '../../lib/ajax'
import overLayer from '../../components/over-layer/over-layer.vue'
export default {
    data(){
        return{
            errorText:'',
            emailAddress:'',
            // 按钮文字
            countDownText:'Reacquire',
            // 验证码
            verificationCode:'',
            // Please enter the correct verification code.
            // 输入数字数量
            isCorrectNum:false,
            // 超时
            isTimeout:true,
            // 认证请求来源，type：1来自注册，2来自忘记密码
            fromType:1,
            toast:false,
            Loading:false
        }
    },
    components:{
        overLayer
    },
    methods:{
        hideToast() {
    		this.toast = false;
    	},
		showLog(text) {
            let timer;
            clearTimeout(timer);
            this.message = text;
            this.toast = true;
            timer = setTimeout(this.hideToast, 2000);
		},
        // 验证输入
        inputChange(val){
            // 清空错误提示
            this.errorText = '';
            // 至少4个字符,不包括空格
            let patt = /^.{4}$/;
            if(patt.test(val.replace(/(^\s*)|(\s*$)/g, ""))){
                this.isCorrectNum = true;
            }
            else{
                this.isCorrectNum = false;
            }
        },
        // confirm提交
        submitCode(){
            if(!this.isCorrectNum){
                return;
            }
            let that = this;
            that.Loading = true;
            // 校验验证码
            ajax.post('/api/user/verify_code',{
                code:that.verificationCode,
                email:that.emailAddress,
                type:that.fromType
            },function(data){   
                that.Loading = false;
                // 注册时
                if(that.fromType == 1){
                    
                    that.showLog('You have successfully registered!');
                    // 验证成功2s后转到login页面
                    setTimeout(function(){
                        that.$router.push({
                            path: '/login',
                            query: {redirect: that.$route.query.redirect || ''}
                        });
                    },2000);
                }
                // 忘记密码时
                if(that.fromType == 2){
                    // console.log(data.token);
                    that.$router.push({path:'/resetpassword',query:{verify:data.token,email:that.emailAddress,redirect: that.$route.query.redirect || ''}});
                }
            },function(err){
                // 验证错误提示 
                if(err.msg){
                    that.errorText = err.msg;
                }
                else{
                    that.showLog('Network Error!')
                }
                that.Loading = false;
            })
        },
        ResentCode(){
            // 没超时 禁止执行
            if(!this.isTimeout){
                return;
            }
            let that = this;
            that.Loading = true;
            // 超时后发起请求
            ajax.post('/api/user/resend_code',{
                email:this.emailAddress,
                type:this.fromType
            },function(data){
                that.Loading = false;
                that.countDown();
            },function(err){
                if(err.msg){
                    that.errorText = err.msg;
                }
                else{
                    that.showLog('Network Error!')
                }
                that.Loading = false;
            })
        },
        // 重新获取验证码函数 倒计时
        countDown(){
            // todo：超时后 重新发送请求
            // 倒计时
            let that = this;
            that.isTimeout = false;
            that.countDownText = '';
            let countNum = 60;
            that.countDownText = countNum+'s';
            let set = setInterval(function(){
                if(countNum > 1){
                    countNum--;
                    that.countDownText = countNum+'s';
                }
                else{
                    that.countDownText = 'Reacquire';
                    that.isTimeout = true;
                    clearInterval(set);
                }
            },1000);
        }
    },
    mounted(){
        this.emailAddress = this.$route.query.email;
        this.fromType  = this.$route.query.type;
        // 当前设备可视区高度
        let client_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 初始化屏幕高度，适应不同的手机高度
        this.$el.style.height = client_height + 'px';
        // 倒计时
        this.countDown();
    }
}
</script>
<style scope>
.confirm-wrap{
    position:absolute;
    width:100%;
    height:100%;
}
.confirm-logo{
    /* position:absolute; */
    /* top:5.43rem; */
    margin-top:5.43rem;
    margin-left:auto;
    margin-right: auto;
    /* left:50%; */
    /* margin-left: -3.22rem; */
    width:6.43rem;
    height:3.07rem;
    background-image:url(/static/img/icons/email@2x.png);
    background-size:100% 100%;
    background-repeat:no-repeat;
}
.confirm-text{
    /* position:absolute; */
    /* top:22.6%; */
    /* top:10.79rem; */
    margin-top:2.29rem;
    padding:0 2.14rem;
    width:100%;
    text-align:left;
    line-height:1.43rem;
    font-size: HelveticaNeue;
    color:#333;
}
.confirm-eamil-address{
    font-weight:bold;
}
.confirm-reset-text{
    margin-top:0.86rem;
}
/* 表单 */
.confirm-form{
    /* position:absolute; */
    /* top:40.9%; */
    /* top:19.5rem; */
    margin-top:3rem;
    width:100%;
    padding:0 2.14rem;
    text-align:left;
    /* overflow: hidden; */
}

.confirm-form .form-text{
    width:100%;
    text-align:left;
    color:#333;
    font-size:0.86rem;
    font-family: HelveticaNeue;
}

.confirm-form .input-class{
    width:15rem;
    /* padding-bottom:10px; */
    margin-bottom:0.8rem;
}
.confirm-form .form-input-box{
    position: relative;
    margin-bottom:1rem;
    overflow: hidden;
}

/* 倒计时按钮 */
.confirm-form .confirm-time-btn{
    position:absolute;
    top:0;
    right:0;
    width:5.79rem;
    height:2.29rem;
    border: 1px solid #e5e5e5;
    border-radius: 100px;
    text-align:center;
    line-height:2.29rem;
}

/* 倒计时超时按钮 */
.confirm-form .conirm_timeout_btn{
    border :1px solid #CD0E00;
    color:#CD0E00;
}

/* confirm按钮 */
.confirm-submit-btn{
    /* position:absolute; */
    /* top:58%; */
    /* top:27.36rem; */
    /* margin-top:2.86rem; */
    /* left:50%; */
    margin: 0 auto 0 auto;
    width:22.5rem;
    height:3.57rem;
    line-height:3.57rem;
    background-color:#ccc;
    border-radius:100px;
    text-align:center;
    font-size:1.14rem;
    font-family:HelveticaNeue-Bold;
    font-weight:bold;
    color:#fff;
}
/* confirm按钮激活 */
.confirm_btn_active{
    background-color:#CD0E00;
}
</style>

<style>

.confirm-form .confirm-hint{
    font-size:1rem;
    color:#999;
    font-family:HelveticaNeue;
    text-align:left;
}

/* 下划线 */
.confirm-form .input-underline{
    width:22.5rem;
}

/* 选中时的underline */
.confirm-form .input-underline-focus{
    width:22.5rem;
}

.confirm-form .input-helptext{
    width:22.5rem;
    font-size:0.86rem;
}
/* 增加显示错误信息高度 */
.confirm-form .mu-text-field-content{
    padding-bottom:2.56rem;
}
</style>