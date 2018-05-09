<template>
    <section class="order-wrap order-wrap-checkout container">    
        <div style="display:none" v-title>确认订单</div> 
        <my-header :headData="headData"></my-header>
        <div v-if="!isAddress" style="width: 100%;height: .36rem;background-color: #ccc"></div>
        <div class="order-wrap-head">
            <router-link class="order-add-address" v-if="!isAddress" to="/address">
                <img src="./img/huoche.png">
                <p>请输入收货地址</p>
                <mu-icon class="arrow-right-btn" slot="right" value="-" />
            </router-link>
            <div class="order-wrap-text" v-if="isAddress">
                <mu-list>
                    <mu-list-item title="" @click="jumpAddress">
                        <span slot="describe">
                            <div class="show-address-title">{{ shoppingAddress.linkman }}</div>
                            <div class="show-address-name">{{ shoppingAddress.phone }}</div>
                            <div class="show-address-info">{{ contactShoppingAddress(shoppingAddress.address1, shoppingAddress.address2, shoppingAddress.city, shoppingAddress.state, shoppingAddress.postcode, shoppingAddress.countryName) }}</div>
                        </span>
                        <mu-icon class="arrow-right-btn" slot="right" value="-" />
                    </mu-list-item>
                </mu-list>
            </div>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
		<div class="orders-wrap orders-card">
            <div class="orders-title">
                <span v-if="orderType == 1 && storeId"><i class="icon-group-shop"></i>解忧杂货铺</span>
                <span v-else><i class="icon-group-shop"></i>商品杂货铺</span>
            </div>
            <div v-for="(product,productIndex) in products" :key="productIndex">
                <order-item :product="product" :unit="unit" :orderType="orderType"/>
            </div>
        </div>
        <h-line height="1" bgColor="#F2F2F2"/>
        <div class="check-pay-total-box">
            <div class="check-pay-total">
                <span>商品总价</span>
                <span class="total-text">{{ unit }}{{ total }}</span>
            </div>
            <div class="check-pay-total">
                <span>运费</span>
                <span class="total-text">{{ shippingCost == 0 ? "免邮" : (unit + shippingCost) }}</span>
            </div>
            <div class="check-pay-total">
                <span>订单总价</span>
                <span class="sub-total total-text">{{unit}}{{ total }}</span>
            </div>
        </div>
        <h-line height="10" bgColor="#F2F2F2"/>
        <div class="check-pay-title">
            Payment Method
        </div>
        <div class="check-pay-btn">
            <!-- <mu-list> -->
                <div class="payment-box">
                    <!-- <mu-checkbox slot="left" v-model="payWechat" uncheckIcon="radio_button_unchecked" checkedIcon="check_circle" iconClass="checkbox-icon-class" /> -->
                    <div class="check_unactive" v-bind:class="{check_active:payTypeText == 'wechat'}" @click="changePayType('wechat')"></div>
                    <i class="wechatpay"></i>
                </div>

                <div class="payment-box paypal-box">
                    <div class="check_unactive paypal-check" v-bind:class="{check_active:payTypeText == 'paypal'}" @click="changePayType('paypal')"></div>
                    <i class="paypal"></i>
                </div>
            <!-- </mu-list> -->
        </div>
        <div class="pay-btn">
            <a href="javascript:;" class="pay-btn-info" :class="{'pay-btn-noactive':isOnLoad}" @click="unifiedOrder">
				支付 <span v-if="!(payTypeText == 'paypal')">¥{{ totalCNY }}<i>({{ unit }}{{ total }})</i></span>
				<span v-else>{{ unit }}{{ total }}</span>
				</a>
        </div>
        <!-- 遮罩层 -->
        <div class="over-layer" v-show="onSubmitLoading"></div>
        <!-- 等待loading -->
        <mu-circular-progress v-show="onSubmitLoading"  class="loading fix-loading" :size="40" />
        <mu-toast class="over-toast" v-if="toast" :message="showMsg" @close="hideToast" />
       
    </section>
    
</template>
<script>
import MyHeader from "../../components/l-header/l-header.vue";
import HLine from "../../components/line/line.vue";
import ajax from "../../lib/ajax";
import applog from "../../util/applog";
import Tools from "../../util/tools";
import wxAction from "../../util/wx-action";
import PageviewGA from "@/components/g-com/g-pageview.js";
import CheckoutGA from "@/components/g-com/g-checkout.js";
import PayGA from "@/components/g-com/g-paysuccess.js";
import poclog from '../../util/poclog';
import OrderItem from "../../components/order-item/order-item.vue";
export default {
  components: {
    MyHeader,
	HLine,
	OrderItem
  },
    data() {
        return {
            showMsg: '',
            toast: false,
            toastTimer: '',
            headData: {
                title: '我的地址',
                rightBtn: {
                    isShow: false
                }
            },
            isAddress: false,
            shoppingAddress: {},
            products: [],
            total: '',
            totalCNY: '',
            shippingCost: '',
            unit: '$',
            orderType: 1,
            loading: false,
            payData: null,
            start_time: '',
            // pay 等待loading
            onSubmitLoading:false,
            // 支付类型默认wechat
            payTypeText: 'wechat',
            orderId:0,
			groupId:0,
			store: {},
			storeId: "",
            isOnLoad: true
        }
  },
  methods: {
    // 支付选择
    // 改变支付方式
    changePayType(type){
		this.payTypeText = this.payTypeText == type ? '' : type;
    },
    hideToast() {
      this.toast = false;
      if (this.toastTimer) clearTimeout(this.toastTimer);
    },
    showToast(callback) {
      this.toast = true;
      if (this.toastTimer) clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        callback && callback();
        this.toast = false;
      }, 3000);
    },
    getData() {
      var that = this;
      that.loading = true;
      ajax.get(
        "/api/order/checkout",
        { 
          platform: "wap",
		  storeId: that.storeId,
		  orderType: that.orderType
        },
        function(data) {
          //CheckoutGA.onCheckoutFired(data.products);
			that.shoppingAddress = data.shoppingAddress;
			that.isAddress = data.hasAddress;
			that.products = data.products;
			that.total = data.total;
			that.totalCNY = data.totalCNY;
			that.shippingCost = data.shippingCost;
			that.unit = data.unit || "";
			that.orderType = parseInt(data.orderType) || that.orderType;
			that.storeId = data.storeId || that.storeId;
			that.loading = false;
			that.isOnLoad = false;
        },
        function(data) {
          if (data.code == 5001) {
            that.showMsg = data.msg;
            that.showToast(function() {
              //location.href = "/";
              that.$router.push('/');
            });
          } else {
            if (data.msg) {
              that.showMsg = data.msg;
              that.showToast();
            applog.sendEventData({
                page: 'page_octopus_checkout',
                activity: 'active_octopus_http_pay',
                businessType: 1,
                businessId: this.products && this.products[0] ? this.products[0].skaId : ''
            });
            that.loading = true;
            if(that.payData){
                that.wxPay();
                return
            }
          }
          that.loading = false;
          }
        }
      );
    },
    jumpAddress() {
      if (this.payData || (this.orderType == 1 && this.storeId)) return;
      //location.href = "/address";
      this.$router.push('/address?orderType=' + this.orderType );
    },
    // 创建订单
    unifiedOrder() {
      if(this.isOnLoad){
        return;
      }
      // 保存支付类型
      localStorage.setItem('payType',this.payTypeText);

      PayGA.onPayFired(this.products);
      var that = this;
      if (that.loading) return;
      if (!that.payTypeText) {
        that.showMsg = "请选择支付方式!";
        that.showToast();
        return;
      }
      if (!that.isAddress) {
        that.showMsg = "请输入收货地址!";
        that.showToast();
        return;
      }
      const device = Tools.judeBrowsers();
      if (device === "Octopus-app") {
        //location.href = "/wxpay";
        this.$router.push('/wxpay');
        return;
      }
      applog.sendEventData({
        activity: "active_octopus_http_pay",
        businessType: 1,
        businessId:
          this.products && this.products[0] ? this.products[0].skaId : ""
      });
      that.loading = true;

      // if (that.payData && that.payWechat) {
      //   that.wxPay();
      //   return;
      // }
      // if(!!that.requestId){
      //   that.paypalPay();
      //   return;
      // }
      that.onSubmitLoading = true;
      document.body.style.overflow='hidden';
      if (that.orderId) {
        // 已创建订单
        that.pay();
      } else {
		// 未创建过订单
        ajax.post("/api/order/unified_order_v2",{ 
            platform: "wap",
            payType: that.payTypeText,
            storeId: that.storeId,
            addressId: that.shoppingAddress.addressId,
            orderType: that.orderType
          },
          function(Orderdata) {
            if(Orderdata.groupId){
              that.groupId = Orderdata.groupId;
            }
            that.orderId = Orderdata.orderId;
            that.pay();
          },
          function(data) {
            if (data.msg) {
              that.showMsg = data.msg;
              that.showToast();
            }
            that.loading = false;
            that.onSubmitLoading = false;
          }
        );
      }
    },
    pay() {
      var that = this;
      ajax.post("/api/order/pay",{ 
        platform: "wap",
        payType: that.payTypeText,
        orderId: that.orderId
      },
      function(data) {
        // that.onSubmitLoading = false;
        that.loading = false;
        that.payData = data;        
        // PayPal支付
        if(!!data.paypal){
          // 预支付
          that.paypalPay();
          // that.onSubmitLoading = false;
        }
        // 微信支付
        else{
          that.wxPay();
          that.onSubmitLoading = false;
        }
      }, function(data) {
        if (data.msg) {
          that.showMsg = data.msg;
          that.showToast();
        }
        else{
          that.showMsg = "网络错误!"
          that.showToast();
        }
        that.loading = false;
        that.onSubmitLoading = false;
      });
    },
    paypalPay(){
      let that = this;
      // 预支付
      let payInfo = JSON.parse(that.payData.paypal.payInfo);
      location.href = payInfo.redirectUrl;
      // that.onSubmitLoading = false;
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
            // that.$router.push("/group/" + data.groupId);
          } else {
            //location.href = "/paysuccess/" + that.orderId;
            that.$router.push("/paysuccess/" + that.orderId);
          }
        }
      });
      that.loading = false;
    },
    contactShoppingAddress(...data) {
      var temp = [];
      data.map(key => {
        if (!!key) {
          temp.push(key);
        }
      });
      return temp.join(", ");
    },
    contactProductAttr(data1, data2) {
            let list = [];
            [...data1, ...data2].map(data => {
                list.push(data.name)
            });
            return list.join(' \| ')
        },
    onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_checkout',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
    },
  mounted() {
		this.storeId = this.$route.params.storeid || "",
		this.orderType =  this.$route.query.orderType || 1;
        this.getData();
        // paypal支付错误返回
        if(this.$route.query.errorMsg){
          this.showMsg = this.$route.query.errorMsg;
          this.showToast();
        }
		// 拿到本地的支付类型
		console.log(localStorage.getItem('payType'))
        this.payTypeText = !localStorage.getItem('payType') ? "wechat" : localStorage.getItem('payType');
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$el.style.minHeight = h + 'px';
       
        this.start_time = new Date().getTime();
        this.orderId = this.$route.query.orderid;
        wxAction.init({
            hideAllMenuItem: true,
            jsApiList: ['chooseWXPay']
        });
        window.onbeforeunload = this.onunload_handler;
        if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                window.addEventListener("pagehide", this.onunload_handler, false);
        };
        PageviewGA.onPageViewFired(this.$route.path);
      },
  created() {
    this.onSubmitLoading = false;
  }
};
</script>
<style lang="css">
/* 隐藏mu-icon默认字体 */
.mu-icon{
  display:block;
  width: 24px;
  overflow: hidden;
}
.order-wrap .order-wrap-head .mu-item-title {
  position: absolute;
  top: 5.2rem;
  left: 50%;
  margin-left: -6rem;
}

.order-wrap .mu-item-right {
  position: absolute;
  top: 1rem;
}
.order-wrap .check-pay-btn {
	margin-bottom: 5rem;
}
.order-wrap .check-pay-btn .mu-item-title {
  text-align: left;
  margin-left: 2rem;
}

.order-wrap .mu-item-title {
  display: inline-block;
}

.order-wrap .order-wrap-text .mu-item-content {
  height: 7rem;
  text-align: left;
}

#app .order-wrap .order-wrap-text .mu-item-text {
  height: 7rem !important;
  max-height: 7rem !important;
  text-overflow: ellipsis;
  word-break: break-word;
}

.checkbox-icon-class {
  color: #cd0e00;
}

.check_unactive{
  margin-left:1.14rem;
  margin-right: 1.07rem;
  width:1.43rem;
  height:1.43rem;
  background-image:url(/static/img/icons/uncheck@2x.png);
  background-repeat:no-repeat;
  background-size:100% 100%;
}
.check_active{
  background-image:url(/static/img/icons/checked@2x.png);
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

.check-pay-title {
  height: 3.5rem;
  line-height: 3.5rem;
  font-size: 1rem;
  color: #333;
  margin-left: 0.86rem;
  text-align: left;
  font-weight: bold;
  /* border-bottom: 1px solid #e5e5e5; */
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
.payment-box{
  display:flex;
  display:-webkit-flex;
  margin-bottom:1.43rem;
}

.wechatpay {
  width: 8.09rem;
  height: 1.56rem;
  background-image: url(/static/img/pages/wechat-pay@2x.png);
  background-size: 100% 100%;
}
.paypal-box .paypal-check{
  margin-top:0.28rem;
}
.paypal-box .paypal{
  width: 8.57rem;
  height: 2rem;
  background-image: url(/static/img/icons/paypal@2x.png);
  background-size :100% 100%;
}
.show-address-title {
  font-size: 1rem;
  color: #333;
  font-weight: bolder;
  display: -webkit-box;
  /* display: box; */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.show-address-name {
  font-size: 1rem;
  color: #333;
  margin-top: 0.57rem;
  display: -webkit-box;
  /* display: box; */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.show-address-info {
  font-size: 1rem;
  color: #333;
  margin-top: 0.57rem;
  display: -webkit-box;
  /* display: box; */
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.order-wrap-text {
  background-color: #fff;
  background-image: url(/static/img/pages/mailer.png);
  background-repeat: no-repeat;
  background-size: 100%;
}
.order-add-address {
  padding: 2rem 0;
  text-align: center;
  position: relative;
  display: block;
}
.order-add-address img {
  width: 3.5rem;
  height: 2.07rem;
  margin-bottom: 0.75rem;
}
.order-add-address p {
  font-size: 1rem;
  color: #333;
}
.order-add-address i {
  position: absolute;
  right: 1.14rem;
  top: 50%;
  margin-top: -12px;
  color: #666;
}
.mu-item-right i {
  color: #666;
}
.pay-btn .mu-flat-button {
  text-transform: none;
  font-weight: bold;
}
.pay-btn-info {
  background-color: #cd0e00;
  color: #fff;
  text-align: center;
  font-weight: bold;
  display: block;
  line-height: 3.5rem;
}
.pay-btn-noactive{
  background-color:#666;
}
.pay-btn-info i {
  font-weight: normal;
  font-style: normal;
}
.free-ship-tips {
  margin-left: 12px;
  height: 50px;
  line-height: 50px;
  border-top: #e5e5e5 1px solid;
  text-align: left;
}
.free-ship-tips span {
  float: right;
  margin-right: 10px;
  color: #333333;
  font-weight: bold;
}
/* loading */
.loading {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  margin-left: -20px;
  transition: all 0.3s;
  transform: translate3d(0, 150%, 0);
  z-index: 99;
}
.fix-loading{ 
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -20px;
    margin-top: -120px;
}
/* 遮罩层 */
.over-layer{
  position:fixed;
  top:0;
  left: 0;
  width:120%;
  height: 120%;
  z-index: 98;
  background:#000;
  opacity: 0.2;
  /* overflow: hidden; */
}
/* 右箭头 */
.arrow-right-btn{
	width:1rem;
	height: 1rem;
	background-image:url(/static/img/icons/Indicato@2x.png);
	background-repeat:no-repeat;
	background-size:100% 100%;
}
/* 隐藏mu-icon默认字体 */
.mu-icon{
  font-size:0px;
}

.over-toast{
  position:fixed;
  top:50%;
  margin-top:-24px;

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
.check-pay-total-box {
  padding: 1.14rem;
}
</style>