<template>
    <section class="login-background">
        <!-- 背景色 -->
        <div class="login-background-cover"> </div> 
        <div class="login-wrap" id="wrap">
           <!--头部文字 -->
        <div class="login-header">
             <div class="login-logo"></div>
            <div class="login-welcome">Welcome to Octopus</div>
            <div class="login-signtext" >Sign In</div>
        </div>

        <!-- 表单部分 -->
        <form class="login-form-box">
            <div class="form-input-1">
                 <mu-text-field 
                    v-model="username"
                    :errorText ='userErrorText'
                    type="text" 
                    inputClass="login-input" 
                    hintText="Email Address" 
                    underlineClass="input-underline" 
                    hintTextClass="input-hint" 
                    underlineFocusClass="underline-focus" />   
            </div>
            <div class="form-input-2">
                <mu-text-field 
                    v-model="password" 
                    :errorText ='passwordErrorText'
                    :type="inputType" 
                    inputClass="login-input" 
                    hintText="Password" 
                    underlineClass="input-underline"
                    hintTextClass="input-hint"
                    helpTextClass = 'input-helptext'
                    underlineFocusClass="underline-focus" />
                <i class="show_password" @click="changePassword()" :class="{hide_password:isHidePassword}"></i>
            </div>
            <div class="login-sign-btn" @click="submitInfo()">Sign In</div>
            <!-- <a href="" class="login-forgot-password">Forgot Password?</a> -->
            <router-link class="login-forgot-password" :to="returnForgetPw()">Forgot Password?</router-link>
        </form>

        <!-- 脚部 联登 -->
        <div class="login-footer" id="footer">
            <div class="more-login-method" >
                <!-- Instagram登录入口 -->
                <!-- <div class="method-icon method-instagram" @click="instagramLoagin"></div> -->
                <!-- 微信登录入口 -->
                <!-- <div v-if='isWechatBrowser()' class="method-icon method-wechat" @click="onLogin"></div> -->
            </div>
            <div class="to-sign-up">
                <span class="normal-text">Not a member?</span>
                <router-link class="sign-up-text" :to="returnSignUp()">Sign Up</router-link>
            </div>
        </div>
        </div>
        <!-- 弹窗 -->
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
        <!-- 遮罩 -->
        <over-layer :isLoading="Loading"></over-layer>
    </section>
</template>

<script>
import Tools from '../../util/tools';
import ajax from '../../lib/ajax';
import check from '../../util/check-action';
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import overLayer from '../../components/over-layer/over-layer.vue'
export default {
    data(){
        return{
            username:'',
            password:'',
            inputType:'password',
            // 显示密码
            isHidePassword:true,
            // 错误提示
            userErrorText:'',
            passwordErrorText:'',
            toast:false,
            Loading:false,
            clientId:''
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
        changePassword(){
            this.isHidePassword = !this.isHidePassword;
            if(this.isHidePassword){
                this.inputType = 'password';
            }
            else{
                this.inputType = 'text';
            }
        },
        submitInfo(){
            let that = this;
            this.userErrorText = '';
            this.passwordErrorText = '';
            if(check.isEmpty(this.username)){
                this.userErrorText = 'Please enter your email address.';
                return;
            }
            
            if(!check.isEmail(this.username)){
                this.userErrorText = 'Please enter valid email address.';
                return;
            }
            // 验证密码格式
            if(check.isEmpty(that.password)){
                that.passwordErrorText = 'Please enter your password.';
                return;
            }

            if(!(check.password(that.password))){
                that.passwordErrorText = 'Required password length is 6-20 symbols.';
                return;
            }

            if(check.isTowSideBlank(this.password)){
                this.passwordErrorText = 'Space is not supported before and after the password.';
                return;
            }
            that.Loading = true;
            // todo:发送请求 验证用户密码是否正确
            ajax.post('/api/user/signin',{
                email:that.username,
                passwd:that.password
            },function(data){
                let red = that.$route.query.redirect;
                if(red == undefined){
                    if((data.sex === null)){
                        that.$router.push({
                            path: '/sexchoice'
                        })
                    }else if(!data.hasUserTag){
                        that.$router.push({
                            path: '/tagchoice'
                        })
                    }
                }
                else{
                    let redirect = decodeURIComponent(that.$route.query.redirect || '/');
                    redirect = (redirect.indexOf('confirm') > -1 || redirect.indexOf('register') > -1) ? '/' : redirect;
                    // that.$router.push({
                    //     path: redirect
                    // })
                    location.href = redirect;
                }
                
                that.Loading = false;
            },function(err){
                that.Loading = false;
                if(err.code == 2003 || err.code == 2007){
                    that.userErrorText = err.msg;
                }
                else if(err.code == 2009 || err.code == 2011){
                    that.passwordErrorText = err.msg;
                }
                else{
                    that.showLog('Network Error!');
                }
            });
        },
        // 微信登录
        onLogin() {
            let url = encodeURIComponent(location.origin + '/loginreturn');
            that.Loading = true;
			ajax.get('/api/wechat/get_app_id', senddata, function (data) {
                var appid = data.AppID,
                    state = encodeURIComponent(location.href);
                location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
            }, function (data) {
                that.Loading = false;
                if (data.msg) {
                    that.showLog(data.msg)
                }
            });
        },
        // instagram 登录
        instagramLoagin(){
            let that = this;
            let senddata = {
			    platform:'wap'
            }
            // 获取Instagram登录clientId 
            that.Loading = true;
            ajax.get('/api/instagram/get_client_id',senddata,function(data){
                that.clientId  = data.clientId;
                let redirect_url = encodeURIComponent(location.origin + (that.$route.query.redirect ? '/api/instagram/login_redirect?redirect=' + that.$route.query.redirect : '/api/instagram/login_redirect'));
                location.href = 'https://api.instagram.com/oauth/authorize/?client_id='+that.clientId+'&redirect_uri='+redirect_url+'&response_type=code';
                // that.Loading = false;
            },function(err){
                that.Loading = false;
                that.showLog('Network Error!')
            });
           
        },
        // 判断是否在微信浏览器
        // isWechatBrowser(){ 
        //     var ua = navigator.userAgent.toLowerCase(); 
        //     if(ua.match(/MicroMessenger/i)=="micromessenger") { 
        //         return true; 
        //     } else { 
        //         return false; 
        //     } 
        // },
        returnSignUp(){
            return this.$route.query.redirect ? '/register?redirect=' + this.$route.query.redirect : '/register';
        },
        returnForgetPw(){
            return this.$route.query.redirect ? '/forgotpassword?redirect=' + this.$route.query.redirect : '/forgotpassword';
        }
    },
    mounted(){
        var that = this;
        // 当前设备可视区高度
        let client_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 初始化屏幕高度，适应不同的手机高度
        this.$el.style.height = client_height + 'px';

        let senddata = {
			platform:'wap'
        }
		wxAction.init({
            hideAllMenuItem: true
        });
		PageviewGA.onPageViewFired(this.$route.path)
    },
    beforeRouteLeave (to, from, next) {
        // console.log(to.meta.requireAuth)
        if (to.meta.requireAuth && !Tools.getCookie('octopus_user_id')) {
            next({
                path: '/'
            })
        }else {
            next()
        }
    }
}
</script>
<style scope>
/* 背景动画 */
@-webkit-keyframes backgroundScroll{
    0%{background-position: 0px 0px}
    /* 50%{background-position: 0px 300px} */
    100%{background-position: 0px -100000px}
}
@keyframes backgroundScroll{
    0%{background-position: 0px 0px}
    /* 50%{background-position: 0px 300px} */
    100%{background-position: 0px -100000px}
}
/* 背景图 */
.login-background{
    width:100%;
    height: 100%;
    background-image:url(/static/img/pages/login-bg@2x.jpg);
    background-repeat: no-repeat;
    background-size:100% 100%;
    background-repeat: repeat-y;
    overflow:hidden;
    position: relative;
    animation: backgroundScroll 2000s linear infinite;
    animation-delay: 1s;
}
/* 主体内容 外层 */
/* .login-wrap{
    width: 100%;
    height: 100%;
    position: absolute;
    left:0;
    bottom:0;
} */

/* 头部 */
.login-header .login-logo{
        position: absolute;
        top:8.1%;
        margin-left:2.57rem;
        width:2.86rem;
        height:2.45rem;
        background-image:url(/static/img/icons/login-logo@2x.png);
        background-size: 100% 100%;
        background-repeat: no-repeat;
}
.login-header .login-welcome{
        position: absolute;
        top:17.1%;
        padding-left: 2.57rem;
        color:#fff;
        text-align:left;
        font-family: HelveticaNeue-Light;
        font-size: 1.43rem;
        font-weight: 100;
        letter-spacing: 0.67px;
}
.login-header .login-signtext{
        position: absolute;
        top:26.1%;
        padding-left: 2.68rem;
        color:#fff;
        text-align:left;
        font-size: 2.29rem;
        font-family:HelveticaNeue-Bold;
}

/* 表单样式 */
.login-form-box .login-input{
    width: 20.86rem;
    height: 2.62rem;
    line-height: 2.62rem;
    color:#fff;
}
.login-form-box .form-input-1{
    position: absolute;
    top:37.3%;
    left:50%;
    margin-left:-10.43rem;
    text-align:center;
}
.login-form-box .form-input-2{
    position: absolute;
    top:47.5%;
    left:50%;
    margin-left:-10.43rem;
}
/* 显示密码图标 */
.form-input-2 .show_password{
    display: block;
    position: absolute;
    top:50%;
    right:0;
    margin-top:-1rem;
    width:1.36rem;
    height:1.36rem;
    background:url(/static/img/icons/showPassword@2x.png) no-repeat;
    background-size:100% 100%;
    background-position:0px -2px;
}
/* 隐藏密码图标 */
.form-input-2 .hide_password{
    display: block;
    position: absolute;
    top:50%;
    right:0;
    margin-top:-1rem;
    width:1.36rem;
    height:1.36rem;
    background:url(/static/img/icons/hidePassword@2x.png) no-repeat;
    background-size:100% 100%;
    background-position:0px -2px;
}


.login-form-box .login-sign-btn{
    position:absolute;
    top:58.6%;
    left:50%;
    margin-left:-10.72rem;
    width:21.43rem;
    height:3.86rem;
    background-color:#cd0e00;
    border-radius:100px;
    color:#fff;
    font-size:1.14rem;
    text-align:center;
    line-height:3.86rem;
}
.login-form-box .login-forgot-password{
    display:block;
    width:100%;
    position:absolute;
    top:70.3%;
    text-align:center;
    text-decoration:underline;
    color:#fff;
    font-family: HelveticaNeue;
}

/* 脚部 联登 */
.login-footer .more-login-method{
    position:absolute;
    top:79.2%;
    width:100%;
    text-align:center;
}
.more-login-method .method-icon{
    margin:0 0.715rem;
    display:inline-block;
    width:2.86rem;
    height:2.86rem;
}
.more-login-method .method-instagram{
    background-image:url(/static/img/pages/instagram@2x.png); 
     background-size:100% 100%; 
     background-repeat:no-repeat;
}
.more-login-method .method-wechat{
    background-image:url(/static/img/pages/wechat@2x.png);
    background-size:100% 100%; 
    background-repeat:no-repeat;
}
.login-footer .to-sign-up{
    position:absolute;
    top:90.1%;
    width:100%;
    text-align:center;
}
.to-sign-up .normal-text{
    color:#fff;
}
.to-sign-up .sign-up-text{
    font-family: HelveticaNeue-Bold;
    color:#cd0e00;
}
.login-background-cover{
    width:100%;
    height:100%;
    background-color:rgba(0,0,0,0.8);
    z-index:-1;
}
.mu-text-field{
    margin:0;
    width:20.86rem;
}
.mu-text-field-content{
    padding:0;
}

</style>

<style >
.login-form-box .input-hint{
    text-align:left;
    color:rgba(255,255,255,0.50);
    font-size: 1.14rem;
    vertical-align: top;
    font-family: HelveticaNeue;
}
/* 下划线 */
.login-form-box .input-underline{
    width: 20.86rem;
    background-color:rgba(255,255,255,0.50);
}
.login-form-box .underline-focus{
    width: 20.86rem;
}

/* 错误提示文字 */
.login-form-box .form-input-2 .input-helptext{
    width:22.5rem;
    color:#cd0e00;
    font-size:0.86rem;
}
</style>

