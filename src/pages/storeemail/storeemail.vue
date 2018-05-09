<template>
	<section class="store-email-wrap">
        <div style="display:none" v-title>店铺邮箱</div>
         <account-header title="店铺邮箱" linkTo="/store/account"></account-header>
         <div class="store-email-cell">
             <div class="store-email-input">
            <mu-text-field 
            type="text" fullWidth
            inputClass = "store-input" 
            hintText = '请输入店铺邮箱'
            v-model="storeEmail"
            ></mu-text-field>
          </div>
         </div>
         <div class="store-email-btn" @click="onConfirm">确认</div>
		  <mu-toast  v-if="toast" :message="showMsg" @close="hideToast" />
	</section>
</template>

<script>
require("./storeemail.css");
import accountHeader from "../../components/account-header/account-header";
import ajax from "../../lib/ajax";
import wxAction from "../../util/wx-action";
import PageviewGA from "@/components/g-com/g-pageview.js";
import poclog from "../../util/poclog";
import Tools from "../../util/tools";
import overLayer from "../../components/over-layer/over-layer.vue";
export default {
  data() {
    return {
      storeID: "",
      storeEmail: "",
		showMsg: '',
		toast: false,
		toastTimer:'',
    };
  },
  components: {
    accountHeader
  },
  methods: {
	hideToast() {
		this.toast = false
		if (this.toastTimer) clearTimeout(this.toastTimer)
	},
	showToast(callback) {
		this.toast = true
		if (this.toastTimer) clearTimeout(this.toastTimer)
		this.toastTimer = setTimeout(() => { 
			this.toast = false;
			callback && callback()
			}, 2000)
	},
    onConfirm() {
      var that = this;
      this.storeID = this.$route.params.storeid; //店铺ID
      let params = {
        email: this.storeEmail
      };
      ajax.post(
        "/api/store/updateInfo",
        params,
        function(data) {
          	that.showMsg = "更新成功!"
			that.showToast()
        },
        function(data) {
			that.showMsg = data.msg
			that.showToast()
        }
      );
    }
  },
  mounted() {}
};
</script>

