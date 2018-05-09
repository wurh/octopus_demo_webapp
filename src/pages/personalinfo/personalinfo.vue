<template>
	<section class="personal-info-wrap">
        <div style="display:none" v-title>个人资料</div>
        <account-header title="个人资料" linkTo="/store/personal"></account-header>
         <div class="store-account-avator">
            <div class="store-account-avator-title">我的头像</div>
            <div class="store-account-avator-icon">
                <img :src="accountInfo.headImgUrl" />
            </div>
         </div>
         <div class="store-account-cell">
        	<mu-list-item  title="用户名" class="list-item-box" titleClass="store-title" :afterText="accountInfo.email">
			</mu-list-item>
            <mu-divider/>
            <mu-list-item  title="昵称" class="list-item-box" titleClass="store-title" :afterText="accountInfo.nickname">
			</mu-list-item>
         </div>
	</section>
</template>

<script>
require("./personalinfo.css");
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
      accountInfo: {
        headImgUrl:
          "https://octopus.com/static/img/pages/default_avatar@2x.png",
        email: "",
        nickname: ""
      }
    };
  },
  components: {
    accountHeader
  },
  methods: {
    updateData(accountInfo) {
      this.accountInfo.headImgUrl = accountInfo.headImgUrl || 'https://octopus.com/static/img/pages/default_avatar@2x.png';
      this.accountInfo.email = accountInfo.email;
      this.accountInfo.nickname = accountInfo.nickname;
    }
  },
  created() {
    let _me = this;
    ajax.get(
      "/api/store/get_info",
      { platform: "wap" },
      function(data) {
        if (data) {
          //请求成功
          _me.updateData(data);
        }
      },
      function(data) {
        console.log("done!");
      }
    );
  },
  mounted() {}
};
</script>

