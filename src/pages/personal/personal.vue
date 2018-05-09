<template>
	<section class="personal-home-wrap">
        <div style="display:none" v-title>个人中心</div>
        <account-header title="个人中心" linkTo="/"></account-header>
        <div class="personal-white">
         <mu-list-item :title="accountInfo.nickname" :describeText="accountInfo.email" to="/store/personalinfo">
            <mu-avatar :src="accountInfo.headImgUrl" slot="leftAvatar"/>
           <mu-icon  class="arrow-right-btn"  slot="right" value=" " />
        </mu-list-item>
        <div class="personal-sell-section">
            <ul class="personal-tab-ul">
                <li>
                    <span v-if="selected == 'day'" class="tab-item selected" @click="selectSales('day')">今日</span>
                    <span v-if="selected != 'day'" class="tab-item" @click="selectSales('day')">今日</span>
                </li>
                 <li>
                    <span v-if="selected == 'week'" class="tab-item selected" @click="selectSales('week')">本周</span>
                    <span v-if="selected != 'week'" class="tab-item" @click="selectSales('week')">本周</span>
                 <li>
                    <span  v-if="selected == 'month'" class="tab-item selected" @click="selectSales('month')">本月</span>
                    <span  v-if="selected != 'month'" class="tab-item" @click="selectSales('month')">本月</span>
                </li>
            </ul>
            <div class="personal-sm-title">收益 ( {{accountInfo.saleData.total.unit}} )</div>
           
            <div class="personal-get-mounts">
                 <animate-number ref="saleamount"  :from="from" :to="saleAmount"  mode="manual"  :animate-end="accumulateEnd"></animate-number>
            </div>
            <ul class="personal-sell-ul">
                <li>
                    <div class="personal-mount-sm">总订单数</div>
                    <div class="personal-mount-num">{{accountInfo.saleData.total.orders}}</div>
                </li>
                <li>
                    <div class="personal-mount-sm">总销售额</div>
                    <div class="personal-mount-num">{{totalAmountFliter(accountInfo.saleData.total.amount)}}</div>
                </li>
            </ul>
        </div>
         </div>
        <div class="personal-profit-list">
            <!-- <mu-list-item  title="收益明细" class="list-item-box" titleClass="store-title" to="/">
				<mu-icon  class="arrow-right-btn"  slot="right" value=" " />
			</mu-list-item> -->
            <!-- <div style="margin-top:.71rem"></div> -->
            <mu-list-item  title="常见问题" class="list-item-box" titleClass="store-title" to="/normalquestion">
				<mu-icon  class="arrow-right-btn"  slot="right" value=" " />
			</mu-list-item>
            <div style="margin-top:.71rem"></div>
            <!-- <mu-list-item  title="账号与安全" class="list-item-box" titleClass="store-title" to="/">
				<mu-icon  class="arrow-right-btn"  slot="right" value=" " />
			</mu-list-item> -->
            <!-- <mu-divider/> -->
            <mu-list-item  title="关于章鱼掌柜" class="list-item-box" titleClass="store-title" to="/">
				<mu-icon  class="arrow-right-btn"  slot="right" value=" " />
			</mu-list-item>
            <div style="margin-top:.71rem"></div>
        </div>
		<!-- 尾部 -->
        <my-footer ref="footer" :items="footerItems"/>
	</section>
</template>

<script>
require("./personal.css");
import accountHeader from "../../components/account-header/account-header";
import myFooter from '@/components/footer-defined/footer-defined.vue';
import ajax from "../../lib/ajax";
import wxAction from "../../util/wx-action";
import PageviewGA from "@/components/g-com/g-pageview.js";
import poclog from "../../util/poclog";
import Tools from "../../util/tools";
import overLayer from "../../components/over-layer/over-layer.vue";
export default {
  data() {
    return {
      from: 0,
      selected: "day",
      saleAmount: 0,
      footerItems: [{         // 尾部配置
			title: '选货',      // 描述s
			detailUrl: `/store/choosegoods`,        // 跳转链接
			iconUrl_on: '/static/img/icon-footer-store/icon-find-on.png',   // 选中图标路径
			iconUrl_off: '/static/img/icon-footer-store/icon-find.png',     // 未选中图标路径
			action: false    // 切换选中状态（true 选中 false 未选中）
		},{
			title: '店铺管理',
			detailUrl: `/store/manage`,
			iconUrl_on: '/static/img/icon-footer-store/icon-store-on.png',
			iconUrl_off: '/static/img/icon-footer-store/icon-store.png',
			action: false
		},{
			title: '销售明细',
			detailUrl: '/store/orders',
			iconUrl_on: '/static/img/icon-footer-store/icon-store-sells-on.png',
			iconUrl_off: '/static/img/icon-footer-store/icon-store-sells.png',
			action: false
		},{
			title: '个人中心',
			detailUrl: `/store/personal`,
			iconUrl_on: '/static/img/icon-footer-store/icon-self-on.png',
			iconUrl_off: '/static/img/icon-footer-store/icon-self.png',
			action: true
		}],
      accountInfo: {
        headImgUrl:
          "https://avatars2.githubusercontent.com/u/5243522?s=460&v=4",
        email: "rahul.wu@126.com",
        saleData: {
          total: {
            orders: 0,
            amount: 0,
            unit: "$",
            visits: 0
          },
          week: {
            amount: 0
          },
          month: {
            amount: 0
          },
          day: {
            amount: 0
          }
        },
        nickname: "rahul.wu"
      }
    };
  },
  components: {
	accountHeader,
	myFooter
  },
  methods: {
    totalAmountFliter(number) {
      let res = "";
      number = parseInt(number);
      if (number > 1000) {
        res = (number / 1000).toFixed(0) + "k";
      } else {
        res = number;
      }
      return res;
    },
    selectSales(type) {
      this.selected = type;
      this.from = this.saleAmount;
      if (type === "day") {
        let day =
          localStorage.getItem("dayAmount") ||
          this.accountInfo.saleData.day.amount;
        this.saleAmount = day;
      }
      if (type === "week") {
        let week =
          localStorage.getItem("weekAmount") ||
          this.accountInfo.saleData.week.amount;
        this.saleAmount = week;
      }
      if (type === "month") {
        let month =
          localStorage.getItem("monthAmount") ||
          this.accountInfo.saleData.month.amount;
        this.saleAmount = month;
      }
      this.accumulateEnd(this.from, this.saleAmount);
      this.$refs.saleamount.start();
    },
    accumulateEnd(pre, now) {
      this.$refs.saleamount.reset(pre, now);
    },
    updateData(accountInfo) {
      this.accountInfo.headImgUrl = accountInfo.headImgUrl;
      this.accountInfo.email = accountInfo.email;
      this.accountInfo.saleData.total.orders =
        accountInfo.saleData.total.orders;
      this.accountInfo.saleData.total.amount =
        accountInfo.saleData.total.amount;
      this.accountInfo.saleData.total.unit = accountInfo.saleData.total.unit;
      this.accountInfo.saleData.week.amount = accountInfo.saleData.week.amount;
      this.accountInfo.saleData.month.amount =
        accountInfo.saleData.month.amount;
      this.accountInfo.saleData.day.amount = accountInfo.saleData.day.amount;
      this.accountInfo.nickname = accountInfo.nickname;
      localStorage.setItem("dayAmount", accountInfo.saleData.day.amount);
      localStorage.setItem("weekAmount", accountInfo.saleData.week.amount);
      localStorage.setItem("monthAmount", accountInfo.saleData.month.amount);
    }
  },
  created() {
    this.from = localStorage.getItem("saleAmount") || 0;
    var _me = this;
    ajax.get(
      "/api/store/get_info",
      { platform: "wap" },
      function(data) {
        if (data) {
          //请求成功
          _me.updateData(data);
          _me.saleAmount = parseInt(data.saleData.day.amount);
          _me.accumulateEnd(_me.from, _me.saleAmount);
          _me.$refs.saleamount.start();
          localStorage.setItem("saleAmount", _me.saleAmount);
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

