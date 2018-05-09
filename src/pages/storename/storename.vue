<template>
	<section class="store-name-wrap">
        <div style="display:none" v-title>店铺名称</div>
         <account-header title="店铺名称" linkTo="/store/account"></account-header>
         <div class="store-name-cell">
             <div class="store-name-input">
            <mu-text-field 
            type="text" fullWidth
            inputClass = "store-input" 
            hintText = '请输入店铺名称'
            v-model="storeName"
            ></mu-text-field>
          </div>
         </div>
         <div class="store-name-btn" @click="onConfirm">确认</div>
          <mu-toast  v-if="toast" :message="showMsg" @close="hideToast" />
	</section>
</template>

<script>
require("./storename.css");
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
		storeName: "",
		showMsg: '',
		toast: false,
		toastTimer:'',
    };
  },
  components: {
    accountHeader
  },
  created() {},
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
        storeName: this.storeName
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

