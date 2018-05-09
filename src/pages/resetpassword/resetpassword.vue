<template>
    <section class="reset-wrap">
        <p class="reset-header">Reset Your Password!</p>
        <p class="reset-description">Dear Octopus member, please reset your password below.</p>
        <div class="reset-form-box">

            <div class="reset-new-password">
                <p class="input-text">New Password</p>
                <div class="reset-input">
                    <mu-text-field v-model="newPassword" type='password'
                    hintText='at least 6 characters'
                    hintTextClass="input-hint-text"
                    inputClass='input-class'
                    underlineClass = 'input-underline'
                    underlineFocusClass = 'input-underlinefocus'
                    :errorText='newPasswordText'
                     helpTextClass = 'input-helptext'
                    ></mu-text-field>
                </div>
            </div>
            <div class="reset-confirm-password">
                <p class="input-text">Confirm New Password</p>
                <div class="reset-input">
                    <mu-text-field v-model="confirmPassword" type='password'
                    hintTextClass="input-hint-text"
                    inputClass='input-class'
                    underlineClass = 'input-underline'
                    underlineFocusClass = 'input-underlinefocus'
                    :errorText='confirmPasswordText'
                     helpTextClass = 'input-helptext'
                    ></mu-text-field>
                </div>
            </div>
        </div>

        <div class="reset-btn" @click="resetPassword">Reset</div>
             
        <!-- 弹窗 -->
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
        <!-- 遮罩 -->
      <over-layer :isLoading="Loading"></over-layer>
    </section>
</template>

<script>
import ajax from '../../lib/ajax'
import check from '../../util/check-action'
import overLayer from '../../components/over-layer/over-layer.vue'
export default {
  data(){
      return {
          newPassword:'',
          confirmPassword:'',
         //   错误提示
          newPasswordText:'',
          confirmPasswordText:'',
          toast:false,
          Loading:false
      }
  },
  components:{
        overLayer
    },
  mounted(){
        // 获取设备高度
        let client_height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
        this.$el.style.height = client_height + 'px';
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
      resetPassword(){
          let that = this;
          this.newPasswordText = '';
          this.confirmPasswordText = '';
        //   验证密码
          if(check.isEmpty(this.newPassword) ){
              this.newPasswordText = 'Please enter your password.';
              return;
          }
          if(!check.password(this.newPassword)){
              this.newPasswordText = 'Required password length is 6-20 symbols.';
              return;
          }
          if(check.isTowSideBlank(this.newPassword)){
                this.newPasswordText = 'Space is not supported before and after the password.';
                return;
            }
        // 二次密码确认验证
          if( check.isEmpty(this.confirmPassword) ){
              this.confirmPasswordText = 'Please re-enter your password.';
              return;
          }
          else if(!check.isSamePassword(this.newPassword,this.confirmPassword)){
              this.confirmPasswordText = 'Your new password comfirmation is incorrect.';
              return;
          }
          this.Loading = true;
        //   发送重置密码请求
          ajax.post('/api/user/reset_passwd',{
              email:that.$route.query.email,
              passwd:that.newPassword,
              token:that.$route.query.verify
          },function(data){
              that.Loading = false;
              that.showLog('Password has been updated.');
              // 验证成功2s后转到login页面
              setTimeout(function(){
                that.$router.push({path:'/login',query:{redirect: that.$route.query.redirect || ''}});
              },2000);
          },function(err){
              let err_msg = err.msg || 'Network Error';
              that.Loading = false;
              that.showLog(err_msg);
          })
      }
  }
}
</script>


<style scoped>
/* 外层 */
.reset-wrap{
    position: absolute;
    top:0;
    width:100%;
    height:100%;
}
/* 头部文字 */
.reset-header{
    position: absolute;
    top:5.43rem;
    padding: 0 2.14rem;
    width:100%;
    text-align:left;
    font-size:1.86rem;
    color:#333;
    font-family: HelveticaNeue-Bold;
}
/* 描述文字 */
.reset-description{
    position: absolute;
    top:9.5rem;
    padding:0 2.14rem;
    width:100%;
    text-align:left;
    color:#666;
    font-family: HelveticaNeue;
    /* font-size:1rem; */
}
/* 输入框 */
.reset-new-password{
    position:absolute;
    top:14.64rem;
    padding: 0 2.14rem;
    text-align:left;
}
.reset-form-box .input-text{
    font-size:0.86rem;
    font-family: HelveticaNeue;
}
.reset-form-box .reset-input{
    margin-top:0.5rem;
    /* margin-bottom:0.5rem; */
}

.reset-confirm-password{
    position:absolute;
    top:21.07rem;
    padding: 0 2.14rem;
    text-align:left;
}

/* 重置按钮 */
.reset-btn{
    position: absolute;
    top: 28.93rem;
    left:50%;
    margin-left:-11.25rem;
    width:22.5rem;
    height:3.57rem;
    line-height:3.57rem;
    text-align:center;
    font-size:1.14rem;
    font-family: HelveticaNeue-Bold;
    color:#fff;
    border-radius: 100px;
    background-color:#cd0e00;
}
</style>

<style>
.reset-form-box .input-class{
    margin-bottom:.6rem;
}
.reset-form-box .input-hint-text{
    font-size:1rem;
    font-family: HelveticaNeue;
    color:#999;

}
.reset-form-box .input-underline,
.reset-form-box .input-underlinefocus{
    width:22.5rem;
}

.reset-form-box .reset-new-password .input-helptext
,.reset-form-box .reset-confirm-password .input-helptext{
    width:22.5rem;
    color:#cd0e00;
    font-size:0.86rem;
}
</style>

