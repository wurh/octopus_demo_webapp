<template>
    <section class="login-background">
        <!-- 背景色 -->
        <div class="login-background-cover"> </div> 
        <div class="login-wrap">
           <!--头部文字 -->
        <div class="login-header">
             <div class="login-logo"></div>
            <div class="login-welcome">Welcome to Octopus</div>
            <div class="login-signtext">Sign Up</div>
        </div>

        <!-- 表单部分 -->
        <form class="login-form-box">
            <div class="form-input-1">
                 <mu-text-field 
                    type="text" 
                    :errorText ='userErrorText'
                    inputClass="login-input" 
                    hintText="Email Address" 
                    underlineClass="input-underline" 
                    hintTextClass="input-hint"
                    helpTextClass = 'input-helptext'
                    underlineFocusClass="underline-focus"
                    v-model="username"/>   
            </div>
            <div class="form-input-2">
                <mu-text-field 
                    :type="inputType" 
                    :errorText='passwordErrorText' 
                    inputClass="login-input" 
                    hintText="Password (at least 6 characters)" 
                    underlineClass="input-underline" 
                    hintTextClass="input-hint"
                    helpTextClass = 'input-helptext'
                    underlineFocusClass="underline-focus" 
                    v-model="password"/>
                    <i class="show_password" @click="changePassword()" :class="{hide_password:isHidePassword}"></i>
            </div>
            <div class="login-sign-btn" @click="submmitInfo()">Sign Up</div>
            <!-- <a href="" class="login-forgot-password">Forgot Password?</a> -->
        </form>

        <!-- 脚部 联登 -->
        <div class="login-footer" id="footer">
            <!-- <div class="more-login-method" >
                <div class="method-icon method-instagram"></div>
                <div class="method-icon method-wechat"></div>
            </div> -->
            <div class="to-sign-up">
                <span class="normal-text">Already a member?</span>
                <router-link class="sign-up-text" :to="returnSignIn()">Sign In</router-link>
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
import ajax from '../../lib/ajax';
import check from '../../util/check-action';
import overLayer from '../../components/over-layer/over-layer.vue'
export default {
    data(){
        return{
            username:'',
            password:'',
            userErrorText:'',
            passwordErrorText:'',
            inputType:'password',
            // 显示密码
            isHidePassword:true,
            toast:false,
            message:'',
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
        changePassword(){
            this.isHidePassword = !this.isHidePassword;
            if(this.isHidePassword){
                this.inputType = 'password';
            }
            else{
                this.inputType = 'text';
            }
        },
        submmitInfo(){
            let that = this;
            this.userErrorText = '';
            this.passwordErrorText = '';
            // 验证用户名，邮箱
            if(check.isEmpty(this.username)){
                this.userErrorText = 'Please enter your email address.';
                return;
            }
            if(!check.isEmail(this.username)){
                this.userErrorText = 'Please enter valid email address.';
                return;
            }

            // 验证密码格式
            if(check.isEmpty(this.password)){
                this.passwordErrorText = 'Please enter your password.';
                return;
            }
            if(!(check.password(this.password))){
                this.passwordErrorText = 'Required password length is 6-20 symbols.';
                return;
            }
            if(check.isTowSideBlank(this.password)){
                this.passwordErrorText = 'Space is not supported before and after the password.';
                return;
            }

            // 遮罩loading
            that.Loading = true;
            // 发送请求
            ajax.post('/api/user/signup',{
                email:this.username,
                passwd:this.password},
                function(data){
                    that.Loading = false;
                    // 成功后跳转验证页面
                    that.$router.push({path:'/confirm', query:{ email:that.username, type:1, redirect: that.$route.query.redirect || '' }});
            },function(err){
                that.Loading = false;
                if(err.msg){
                    that.showLog(err.msg);
                }
                else{
                    that.showLog('Network Error!');
                }
            })
             // 发送请求
            // console.log('sent..');
            // todo:请求验证邮箱是否注册
            // yes:弹窗
            // this.showLog('Email address has been registed.');
            // no:跳转
            // this.$router.push({path:'/confirm', query:{ email:this.username, type:1 }});
        },
        returnSignIn(){
            return this.$route.query.redirect ? '/login?redirect=' + this.$route.query.redirect : '/login';
        }
    },
    mounted(){
        var that = this;
        // 当前设备可视区高度
        let client_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        // 初始化屏幕高度，适应不同的手机高度
        this.$el.style.height = client_height + 'px';
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
        font-size: 1.428rem;
        font-weight: 100;
        letter-spacing: 0.67px;
}
.login-header .login-signtext{
        position: absolute;
        top:26.1%;
        padding-left: 2.68rem;
        color:#fff;
        text-align:left;
        font-size: 2.286rem;
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

<style>
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
    background-color:#cd0e00;
}

/* 错误提示文字 */
.login-form-box .form-input-1 .input-helptext,
.login-form-box .form-input-2 .input-helptext{
    width:22.5rem;
    color:#cd0e00;
    font-size:0.86rem;
}
</style>

