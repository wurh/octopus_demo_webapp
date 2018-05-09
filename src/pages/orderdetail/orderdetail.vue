<template>
    <section class="order-wrap order-wrap-detail container">
        <my-header :headData="headData"></my-header>
        <div class="order-state-box">
            <p class="order-state-title">订单状态</p>
            <p class="order-state-text">{{ returnOrderStatus(orderDetailInfo.orderStatus, orderDetailInfo.groupStatus, orderDetailInfo.orderType) }}</p>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="order-wrap-head">
            <div class="order-wrap-text" v-show="orderDetailInfo.shoppingAddress.hasAddress">
                <mu-list>
                    <mu-list-item title="">
                        <div class="show-address-title">自提地址</div>
                        <!-- <div class="show-address-name">{{ orderDetailInfo.shoppingAddress.address.linkman }} {{ orderDetailInfo.shoppingAddress.address.phone }}</div> -->
                        <div class="show-address-info">{{ contactShoppingAddress(orderDetailInfo.shoppingAddress.address)}}</div>
                    </mu-list-item>
                </mu-list>
            </div>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="orders-wrap orders-card">
            <div class="orders-title">
                <span v-if="orderDetailInfo.orderType == 1"><i class="icon-group-shop"></i>解忧杂货铺<i class="arrow-right-btn"></i></span>
                <span v-else>商品信息</span>
            </div>
            <a v-for="(product,productIndex) in orderDetailInfo.products" :key="productIndex" :href="`/detail/${product.skaId}`">
                <order-item :product="product" :unit="orderDetailInfo.unit" :orderType="orderDetailInfo.orderType"/>
            </a>
        </div>
        <h-line height="1" bgColor="#F2F2F2"/>
        <div class="check-pay-total-box">
            <div class="check-pay-total">
                <span>商品总价</span>
                <span class="total-text">{{orderDetailInfo.unit}}{{ orderDetailInfo.total }}</span>
            </div>
            <div class="check-pay-total">
                <span>运费</span>
                <span class="total-text">{{ orderDetailInfo.shippingCost == 0 ? "免邮" : (orderDetailInfo.unit + orderDetailInfo.shippingCost) }}</span>
            </div>
            <div class="check-pay-total">
                <span>订单总价</span>
                <span class="sub-total total-text">{{orderDetailInfo.unit}}{{ orderDetailInfo.shippingCost }}</span>
            </div>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="order-track-box">
            <p v-if="orderDetailInfo.orderNum" class="order-track-desc"><span>订单号</span><span>Order No.:{{ orderDetailInfo.orderNum }}</span></p>
            <p v-if="orderDetailInfo.orderTime" class="order-track-desc"><span>下单时间</span><span>{{ orderDetailInfo.orderTime }}</span></p>
            <p class="order-track-desc"><span>支付方式</span><span>{{payTypeText[orderDetailInfo.payType || 0 ]}}</span></p>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div v-if="orderDetailInfo.orderType == 1" class="btn-fixed-bottom">
            <a href="javascript:;" @click="pay">马上支付</a>
            <!-- <router-link :to="`/checkout/${orderDetailInfo.groupId}`">马上支付</router-link> -->
        </div>
        <div v-if="orderDetailInfo.orderType == 2 && orderDetailInfo.groupStatus == 2" class="btn-fixed-bottom">
            <!-- <a href="javascript:;">邀请好友</a> -->
            <router-link :to="`/group/${orderDetailInfo.groupId}`">邀请好友</router-link>
        </div>
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast"/>
    </section>
</template>
<script>
import MyHeader from "../../components/l-header/l-header.vue";
import HLine from "../../components/line/line.vue";
import ajax from "../../lib/ajax";
import poclog from "../../util/poclog";
import wxAction from "../../util/wx-action";
import PageviewGA from "@/components/g-com/g-pageview.js";
import OrderItem from "../../components/order-item/order-item.vue";
export default {
  components: {
    MyHeader,
    HLine,
    OrderItem
  },
  data() {
    return {
      headData: {
        title: "Order Details",
        rightBtn: {
          isShow: false
        }
      },
      payTypeText: {
        0: "微信支付",
        1: "paypal支付",
        2: "worldpay支付"
      },
      payData: null,
      showMsg: "",
      toast: false,
      toastTimer: "",
      orderDetailInfo: {
        shoppingAddress: {
          address: {}
        },
        products: []
      },
      start_time: ""
    };
  },
  methods: {
    hideToast() {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    },
    showToast(callback) {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast = false;
        callback && callback();
      }, 2000);
    },
    getDetailData(uid) {
      var that = this;
      let senddata = {
        orderId: uid,
        platform: "wap"
      };
      ajax.get(
        "/api/order/get_order_detail",
        senddata,
        function(data) {
          that.orderDetailInfo = data;
        },
        function(data) {
          if (data.msg) {
            that.showMsg = data.msg;
            that.showToast();
          }
        }
      );
    },
    contactShoppingAddress(data) {
      let addr = [
          data.address1,
          data.address2 || "",
          data.city,
          data.state,
          data.postcode,
          data.countryName
        ],
        adr = [];
      for (var i = 0, len = addr.length; i < len; i++) {
        if (addr[i]) {
          adr.push(addr[i]);
        }
      }
      return adr.join(", ");
    },
    returnOrderStatus(orderState, groupState, orderType) {
      let orderStatus = {
          "1": "已支付",
          "2": "处理中",
          "3": "已发货",
          "4": "退款中",
          "5": "已退款"
        },
        groupStatus = {
          "1": "未支付",
          "2": "未成团",
          "3": "已成团",
          "4": "已散团"
        };
      if (
        orderType == 1 ||
        orderState == 2 ||
        orderState == 3 ||
        orderState == 5
      ) {
        return orderStatus[orderState];
      } else if (orderState == 1) {
        return groupStatus[groupState];
      } else if (orderState == 4) {
        if (groupState == 3 || groupState == 4) {
          return groupStatus[groupState] + "(" + orderStatus[orderState] + ")";
        } else {
          return orderStatus[orderState];
        }
      }
    },
    pay() {
        var that = this;
        ajax.post(
        "/api/order/pay",
        {
            platform: "wap",
            payType: that.orderDetailInfo.payType || 0,
            orderId: that.orderDetailInfo.orderId
        },
        function(data) {
            that.loading = false;
            that.payData = data;
            // PayPal支付
            if (!!data.paypal) {
                // 预支付
                that.paypalPay();
            } else {
                // 微信支付
                that.wxPay();
                that.onSubmitLoading = false;
            }
        },
        function(data) {
            if (data.msg) {
                that.showMsg = data.msg;
                that.showToast();
            } else {
                that.showMsg = "Network Error!";
                that.showToast();
            }
            that.loading = false;
            that.onSubmitLoading = false;
        });
    },
    paypalPay() {
        let that = this;
        // 预支付
        let payInfo = JSON.parse(that.payData.paypal.payInfo);
        location.href = payInfo.redirectUrl;
    },
    wxPay() {
        var that = this;
        let data = this.payData;
        let wechat = data.wechat;
        wx.chooseWXPay({
            timestamp: wechat.timestamp,
            nonceStr: wechat.nonceStr,
            package: wechat.package,
            signType: wechat.signType,
            paySign: wechat.paySign,
            success: function(res) {
                let total = that.total;
                let purchase = {
                    payment: "wechat",
                    purchaseTimes: 1, //总购买次数,
                    purchaseAmount: total //历史订单总金额
                };
                PayGA.onPaySuccess(purchase, that.products);
                if (that.orderType == 2) {
                    location.href = "/group/" + that.groupId;
                } else {
                    that.$router.push("/paysuccess/" + that.orderId);
                }
            }
        });
      that.loading = false;
    },
    onunload_handler(e) {
      let end_time = new Date().getTime();
      let cost_time = end_time - this.start_time;
      let _me = this;
      poclog.sendPageData({
        page: "page_octopus_orderdetail",
        businessId: "",
        page_cost_time: cost_time
      });
    }
  },
  mounted() {
    if (this.$route.query.orderId) {
      this.getDetailData(this.$route.query.orderId);
    } else {
      this.showMsg = "orderId does not found";
      this.showToast(function() {
        //location.href = '/orders'
        this.$router.push("/orders/order");
      });
    }
    this.start_time = new Date().getTime();
    window.onbeforeunload = this.onunload_handler;
    if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
      window.addEventListener("pagehide", this.onunload_handler, false);
    }
    wxAction.init({
      hideAllMenuItem: true
    });
    PageviewGA.onPageViewFired(this.$route.path);
  }
};
</script>
<style lang="css">
.order-wrap .order-wrap-head .mu-item-title {
  position: absolute;
  top: 5.2rem;
  left: 50%;
  margin-left: -6rem;
}
/* .order-wrap {
    padding-top: 3.14rem;
} */
.order-wrap .mu-item-right {
  position: absolute;
  top: 1rem;
}

.check-pay-btn .mu-item-title {
  text-align: left;
  margin-left: 2rem;
}

.order-wrap .mu-item-title {
  display: inline-block;
}

.order-wrap .order-wrap-text .mu-item-content {
  text-align: left;
}
</style>
<style scoped>
.order-top-content {
  height: 7rem;
}

.order-top-content-desc {
  height: 7rem;
}

.order-wrap .mu-list {
  padding: 0;
  position: relative;
}

.order-wrap .mu-item-wrapper {
  padding: 0 0 1.93rem 0;
}

.check-split {
  height: 0.71rem;
  background-color: #e4e4e4;
}

.goods-price {
  font-size: 1rem;
  text-align: left;
  color: #333;
  margin-top: 0.6rem;
}

.goods-price span {
  font-weight: bold;
}

.check-pay-title {
  height: 3.5rem;
  line-height: 3.5rem;
  font-size: 1rem;
  color: #333;
  margin-left: 0.86rem;
  text-align: left;
  font-weight: bold;
}

.check-pay-total {
  height: 2rem;
  line-height: 2rem;
  color: #666;
  text-align: left;
}

.pay-btn {
  width: 100%;
  height: 3.5rem;
  position: fixed;
  bottom: 0px;
}

.pay-btn-info {
  width: 100%;
  height: 3.5rem;
}

.wechatpay {
  width: 8.09rem;
  height: 1.56rem;
  background-image: url(/static/img/pages/wechat-pay@2x.png);
  background-size: 100% 100%;
  display: inline-block;
  float: left;
}
.paypalpay {
  width: 8.09rem;
  height: 2rem;
  background-image: url(/static/img/icons/paypal@2x.png);
  background-size: 100% 100%;
  display: inline-block;
  float: left;
}
.check-pay-total-box {
  padding: 1.14rem;
}

.order-state-box {
  padding: 1.14rem;
  text-align: left;
}
.order-state-title {
  font-size: 1rem;
  color: #666666;
}
.order-state-text {
  font-size: 1.86rem;
  font-weight: bold;
  color: #cd0e00;
}

.order-track-state {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
}
.show-address-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.show-address-name {
  font-size: 1rem;
  color: #666;
  display: -webkit-box;
  /* display: box; */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.show-address-info {
  font-size: 1rem;
  color: #666;
  margin-top: 0.57rem;
  display: -webkit-box;
  /* display: box; */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.orders-wrap .orders-title {
  height: 3.86rem;
  line-height: 3.86rem;
  text-align: left;
  margin-left: 0.86rem;
  font-size: 1rem;
  color: #333;
  /* border-bottom: 1px solid #e5e5e5; */
}
.orders-wrap .orders-title i {
  display: inline-block;
  vertical-align: middle;
  top: -0.2rem;
  position: relative;
}
.arrow-right-btn {
  margin-left: 0.5rem;
}
.icon-group-shop {
  width: 1.14rem;
  height: 1.14rem;
  background-image: url(/static/img/icons/group-shop@2x.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  margin-right: 0.5rem;
}
.orders-wrap .orders-title .right {
  float: right;
  margin-right: 0.86rem;
  color: #ce1305;
}

.orders-wrap .orders-content {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  padding: 0.86rem;
  background: #f8f8f8;
  margin-bottom: 0.07rem;
}
.orders-content img {
  width: 5.21rem;
  height: 6.58rem;
  margin-right: 0.86rem;
  display: block;
}
.orders-content .orders-content-info {
  -webkit-flex: 1;
  flex: 1;
}
.orders-wrap .orders-goods-name {
  max-width: 18rem;
  font-size: 0.93rem;
  color: #151515;
  text-align: left;
  display: -webkit-box;
  display: box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.orders-wrap .orders-goods-size {
  /* width: 15rem; */
  font-size: 0.93rem;
  color: #999;
  text-align: left;
  padding-top: 0.43rem;
  display: -webkit-box;
  display: box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.orders-wrap .orders-goods-price {
  width: 15rem;
  font-size: 0.93rem;
  color: #333;
  text-align: left;
  padding-top: 0.79rem;
}
.total-text {
  float: right;
  color: #333;
}
.sub-total {
  font-size: 1.29rem;
  font-weight: bold;
}
.order-track-box {
  padding: 1.14rem;
}
.order-track-box p {
  text-align: left;
  color: 0.86rem;
  color: #666;
  line-height: 2rem;
}
.order-track-box p span:last-child {
  float: right;
}
.btn-fixed-bottom {
  position: fixed;
  width: 100%;
  bottom: 0;
  left: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.1);
}
.btn-fixed-bottom a {
  height: 3.5rem;
  line-height: 3.5rem;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  color: #fff;
  background: #cd0e00;
  display: block;
}
</style>