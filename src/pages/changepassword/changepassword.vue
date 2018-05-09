<template>
    <section class="change-wrap">
          <div style="display:none" v-title>修改密码</div>

        <!-- 头部 -->
        <account-header title="Change Password" linkTo="/setting"></account-header>

        <div class="change-form-box">
            <div class="change-current-password">
                <p class="input-text">原密码</p>
                <div class="change-input">
                    <mu-text-field v-model="currentPassword" type='password'
                    hintText = 'enter your current password'
                    hintTextClass="input-hint-text"
                    inputClass='input-class'
                    underlineClass = 'input-underline'
                    underlineFocusClass = 'input-underlinefocus'
                    :errorText='currentPasswordText'
                     helpTextClass = 'input-helptext'
                    ></mu-text-field>
                </div>
            </div>

            <div class="change-new-password">
                <p class="input-text">新密码</p>
                <div class="change-input">
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
            <div class="change-confirm-password">
                <p class="input-text">确认新密码</p>
                <div class="change-input">
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

        <div class="change-btn" @click="changePassword">确认修改</div>
          <!-- 弹窗 -->
		<mu-toast v-if="toast" :message="message" @close="hideToast"/>
          <!-- 遮罩 -->
      <over-layer :isLoading="Loading"></over-layer>
    </section>
</template>

<script>

import overLayer from '../../components/over-layer/over-layer.vue'
import accountHeader from '../../components/account-header/account-header'
import ajax from '../../lib/ajax'
import check from '../../util/check-action'
export default {
  data(){
      return {
          currentPassword:'',
          newPassword:'',
          confirmPassword:'',
         //   错误提示
          currentPasswordText:'',
          newPasswordText:'',
          confirmPasswordText:'',
          toast:false,
          Loading:false
      }
  },
  mounted(){
        // 获取设备高度
        let client_height = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
        this.$el.style.height = client_height + 'px';
  },
  components:{
      overLayer,
      accountHeader
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
          let that  = this;
          this.currentPasswordText = '';
          this.newPasswordText = '';
          this.confirmPasswordText = '';
        // 验证原密码
        if(check.isEmpty(this.currentPassword)){
            this.currentPasswordText = 'Please enter your password.';
            return;
        }
        // 验证新密码
          if(check.isEmpty(this.newPassword)){
              this.newPasswordText = 'Please enter your new password.';
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
          if(check.isEmpty(this.confirmPassword)){
              this.confirmPasswordText = 'Please re-enter your password.';
              return;
          }
          else if(!check.isSamePassword(this.newPassword ,this.confirmPassword)){
              this.confirmPasswordText = 'Your new password comfirmation is incorrect.';
              return;
          }

        that.Loading = true;
         //   发送重置密码请求
          ajax.post('/api/user/change_passwd',{
              new_passwd:that.newPassword,
              passwd:that.currentPassword
          },function(data){
              that.Loading = false;
              that.showLog('Password has been updated.');
              // 验证成功2s后转到login页面
              setTimeout(function(){
                that.$router.push('/account');
              },2000);
          },function(err){
              that.Loading = false;
              if(err.msg){
                  that.showLog(err.msg);
              }
          })
      }
  }
}
</script>


<style scoped>
/* 外层 */
.change-wrap{
    position: absolute;
    top:0;
    width:100%;
    height:100%;
}
/* 头部文字 */
.change-header{
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
.change-description{
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
.change-current-password{
    position: absolute;
    top:5.43rem;
    padding: 0 2.14rem;
    text-align:left;
}
.change-new-password{
    position:absolute;
    top:11.86rem;
    padding: 0 2.14rem;
    text-align:left;
}
.change-form-box .input-text{
    font-size:0.86rem;
    font-family: HelveticaNeue;
}
.change-form-box .change-input{
    margin-top:0.5rem;
    /* margin-bottom:0.5rem; */
}

.change-confirm-password{
    position:absolute;
    top:18.29rem;
    padding: 0 2.14rem;
    text-align:left;
}

/* 重置按钮 */
.change-btn{
    position: absolute;
    top: 26.14rem;
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
.change-form-box .input-class{
    margin-bottom:.6rem;
}
.change-form-box .input-hint-text{
    font-size:1rem;
    font-family: HelveticaNeue;
    color:#999;

}
.change-form-box .input-underline,
.change-form-box .input-underlinefocus{
    width:22.5rem;
}

.change-form-box .change-current-password .input-helptext
,.change-form-box .change-new-password .input-helptext
,.change-form-box .change-confirm-password .input-helptext{
    width:22.5rem;
    color:#cd0e00;
    font-size:0.86rem;
}

</style>

