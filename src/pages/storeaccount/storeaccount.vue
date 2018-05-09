<template>
	<section class="store-account-wrap">
         <div style="display:none" v-title>店铺信息</div>

         <account-header title="店铺信息" linkTo="/"></account-header>
         <div class="store-account-avator">
            <div class="store-account-avator-title">店铺头像</div>
            <div class="store-account-avator-icon">
                <img :src="headImgUrl" />
            </div>
            <!-- <div class="store-account-right mu-item-right">
                <i class="arrow-right-btn mu-icon material-icons"></i>
            </div> -->
         </div>
         <div class="store-account-cell">
        	<mu-list-item  title="店铺名称" class="list-item-box" titleClass="store-title" :afterText="storeName" :to="`/store/name/${ storeId }`">
            <mu-icon  class="arrow-right-btn"  slot="right" value=" " />
          </mu-list-item>
          <mu-divider/>
          <mu-list-item  title="店铺公告" class="list-item-box" titleClass="store-title" :afterText="note" :to="`/store/notice/${ storeId }`">
            <mu-icon  class="arrow-right-btn"  slot="right" value=" " />
          </mu-list-item>
          <mu-divider/>
          <mu-list-item  title="店铺地址" class="list-item-box" titleClass="store-title" :to="`/store/address/${ storeId }`">
            <mu-icon  class="arrow-right-btn"  slot="right" value=" " />
          </mu-list-item>
          <mu-divider/>
          <mu-list-item  title="联系邮箱" class="list-item-box" titleClass="store-title" :afterText="email" :to="`/store/email/${storeId}`">
            <mu-icon  class="arrow-right-btn"  slot="right" value=" " />
          </mu-list-item>
         </div>
	</section>
</template>

<script>
require("./storeaccount.css");
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
      headImgUrl:
        "https://octopus.com/static/img/pages/default_avatar@2x.png",
      phone: "",
      storeName: "",
      note: "",
      storeId: "",
      email: ""
    };
  },
  components: {
    accountHeader
  },
  created() {
    var that = this;
    ajax.get(
		"/api/store/info",
		{},
	function(data) {
		if(JSON.stringify(data) == "{}"){
			that.$router.replace('/applystore');
		}else if(data.status == 0){
			that.$router.replace('/applystore');
		}else if(data.status == 9){
			that.$router.replace('/applyreviewing');
		}else {
			that.updateData(data);
		}
	},
    function(data) {
        if(data.code == 10001){
			that.$router.replace('/applystore');
		}
      }
    );
  },
  methods: {
    updateData(data) {
      this.storeId = data.storeId;
      this.headImgUrl = data.headImgUrl || this.headImgUrl;
      this.phone = data.phone;
      this.storeName = data.storeName;
      this.note = data.note;
      this.email = data.email;
    }
  },
  mounted() {}
};
</script>

