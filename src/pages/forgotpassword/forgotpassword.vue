<template>
  <section class="forgot-wrap">
      <div class="forgot-header">Forgot Password?</div>
      <div class="forgot-description">Type in your email address below and we’ll send you an email with instructions on how to create a new password</div>
      <form action="" class="forgot-form-box">
          <div class="forgot-email-text">Email Address</div>
          <div class="forgot-email-input">
            <mu-text-field 
            type="text" fullWidth
            v-model="emailAddress"
            inputClass = "forgot-input" 
            underlineClass="forgot-underline" 
            underlineFocusClass="forgot-underlinefocus"
            hintText = 'please enter your emai address'
            hintTextClass = 'forgot-hint-text'
            helpTextClass = 'input-helptext'
            :errorText="errorText"></mu-text-field>
          </div>
      </form>

      <div class="forgot-submit-btn" @click="sentEmail">Sent Email</div>
      <!-- 遮罩 -->
      <over-layer :isLoading="Loading"></over-layer>
  </section>
</template>
<script>
import ajax from '../../lib/ajax'
import overLayer from '../../components/over-layer/over-layer.vue'
import check from '../../util/check-action'
export default {
    data(){
        return {
            emailAddress:'',
            // Invalid Email,please check your login information.
            errorText:'',
            Loading:false
        }
    },
    components:{
        overLayer
    },
    mounted(){  
        let client_height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
        this.$el.style.height = client_height + 'px';
    },
    methods:{
        sentEmail(){
            let that = this;
            this.errorText = '';
            if(check.isEmpty(that.emailAddress)){
                that.errorText = 'Please enter your email address';
                return;
            }
            // 邮箱格式
            if(!check.isEmail(that.emailAddress)){
                this.errorText = 'Invalid Email,please check your information.';
                return;
            }
           
            // todo:发送请求，验证邮箱，成功后跳转
            that.Loading = true;
            ajax.post('/api/user/forget_passwd',{
                    email:this.emailAddress
                },
                function(data){
                    that.Loading = false;
                    that.$router.push({path:'/confirm',query:{email:that.emailAddress,type:2,redirect: that.$route.query.redirect || ''}});
                },function(err){
                    that.Loading = false;
                    that.errorText = err.msg;
            });
        }
    }
}
</script>
 
<style scoped>
/* 外层 */
.forgot-wrap{
    position:absolute;
    top:0;
    width:100%;
    height:100%;
}
/* 头部文字 */
.forgot-wrap .forgot-header{
    position: absolute;
    /* top:9%; */
    top:4.29rem;
    padding:0 2.14rem;
    width:100%;
    color:#333;
    font-size:1.86rem;
    font-family: HelveticaNeue-Bold;
    text-align:left;
}
/* 描述文字 */
.forgot-wrap .forgot-description{
    position: absolute;
    /* top:17.1%; */
    top:8.14rem;
    padding:0 2.14rem;
    text-align:left;
    font-family: HelveticaNeue;
}
/* 输入框 */
.forgot-wrap .forgot-form-box{
    position: absolute;
    /* top:32.1%; */
    top:15.19rem;
    width:100%;
}

.forgot-form-box .forgot-email-text{
    padding:0 2.14rem;
    width:100%;
    text-align:left;
    font-size:0.86rem;
    font-family: HelveticaNeue;
}
.forgot-form-box .forgot-email-input{
    width:22.5rem;
    margin-top:0.5rem;
    padding:0 2.14rem;
    text-align: left;
}

/* 发送邮件按钮 */
.forgot-wrap .forgot-submit-btn{
    position: absolute;
    /* top: 50.6%; */
    top:23.14rem;
    left:50%;
    margin-left:-11.2rem;
    width:22.5rem;
    height:3.57rem;
    background-color:#cd0e00;
    border-radius: 100px;
    line-height:3.57rem;
    text-align:center;
    color:#fff;
    font-size:1.14rem;
    font-family:HelveticaNeue-Bold;
}
</style>

<style>
.forgot-form-box .forgot-hint-text{
    font-size:1rem;
    color:#999;
    font-family:HelveticaNeue;
}
.forgot-form-box .forgot-input{
    width:22.5rem;
    margin-bottom:0.86rem;
} 
/* 下划线 */
.forgot-form-box .forgot-underline
,.forgot-form-box .forgot-underlinefocus{
    width:22.5rem;
}

/* 错误提示文字 */
.forgot-form-box .forgot-email-input .input-helptext{
    width:22.5rem;
    color:#CD0E00;
    font-size:0.86rem;
}
</style>

