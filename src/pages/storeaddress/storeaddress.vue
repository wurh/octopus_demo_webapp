<template>
    <section class="container address-wrap">
        <div style="display:none" v-title>编辑地址</div>
        <account-header title="店铺地址" linkTo="/store/account"></account-header>
        <div class="address-form">
            <step-select v-if="countryData.length > 0 && countryIsReady" selectBoxClass="selectBoxState" refName="countrySelect" :items="countryData" :selectVal="addressInfo.countryName" :label="addressInfo.countryCode" @selectChange="countryChange" />
            <mu-text-field inputClass="address-input" hintText="联系人" @focus="hideText('linkman')" v-model="addressInfo.linkman" :errorText="errorTxt.linkman" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="地址1" @focus="hideText('address1')" v-model="addressInfo.address1" :errorText="errorTxt.address1" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="地址2 (选填)" v-model="addressInfo.address2" :errorText="errorTxt.address2" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="城市" @focus="hideText('city')" v-model="addressInfo.city" :errorText="errorTxt.city" />
            <br/>
            <step-select v-if="stateData.length > 0 && stateIsReady" selectBoxClass="selectBoxState" refName="stateSelect" :items="stateData" :selectVal="addressInfo.stateCode" :label="addressInfo.state" @selectChange="stateChange" />
            <mu-text-field inputClass="address-input" hintText="邮编" @focus="hideText('postcode')" v-model="addressInfo.postcode" :errorText="errorTxt.postcode" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="联系电话" @focus="hideText('phone')" v-model="addressInfo.phone" :errorText="errorTxt.phone" />
            <br/>
        </div>
        <mu-raised-button label="确认" class="address-submit-btn" @click="handleSubmit" />
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast" />
    </section>
</template>
<script>
import MyHeader from '../../components/l-header/l-header.vue';
import accountHeader from "../../components/account-header/account-header";
import StepSelect from '../../components/step-select/step-select.vue';
import ajax from '../../lib/ajax'
import poclog from '../../util/poclog'
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
export default {
    data() {
        return {
            headData: {
                title: 'Shipping Address',
                rightBtn: {
                    isShow: false
                }
            },
            showMsg: '',
            toast: false,
            toastTimer: '',
            countryIsReady: false,
            stateIsReady: false,
            storeId:'',
            countryData: [
                {
                    key: 'US',
                    value: '美国',
                }
            ],
            stateData: [],
            addressInfo: {},
            loading: false,
            errorTxt: {
                address1: "",
                address2: "",
                city: "",
                linkman: "",
                phone: "",
                postcode: "",
                countryCode: "",
                stateCode: ""
            },
            start_time: ''
        }
    },
    components: {
        MyHeader,
        StepSelect,
        accountHeader
    },
    methods: {
        hideToast() {
            this.toast = false
            if (this.toastTimer) clearTimeout(this.toastTimer)
        },
        showToast() {
            this.toast = true
            if (this.toastTimer) clearTimeout(this.toastTimer)
            this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
        },
        handleSubmit() {
            var that = this;
            if (!that.canPost() || that.loading) return
            that.loading = true;
            let params = that.addressInfo;
            params.storeId = that.storeId;
            ajax.post('/api/address/update', that.addressInfo, function(data) {
                that.$router.push('/store/account');
                that.loading = false;
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
                that.loading = false;
            })
        },
        hideText(nod) {
            this.errorTxt[nod] = '';
        },
        canPost() {
            if (!this.addressInfo.linkman) {
                this.errorTxt.linkman = 'Please enter your name.'
                return false
            }else if (this.addressInfo.linkman.length > 45) {
                this.errorTxt.linkman = 'your name need length is min than 45.'
                return false
            }

            if (!this.addressInfo.address1) {
                this.errorTxt.address1 = 'Please enter your address.'
                return false
            }else if (this.addressInfo.address1.length > 200) {
                this.errorTxt.address1 = 'your address need length is min than 200.'
                return false
            }

            if (this.addressInfo.address2 && this.addressInfo.address2.length > 200) {
                this.errorTxt.address2 = 'your address2 need length is min than 200.'
                return false
            }

            if (!this.addressInfo.city) {
                this.errorTxt.city = 'Please enter your city.'
                return false
            }else if (this.addressInfo.city.length > 100) {
                this.errorTxt.city = 'your city need length is min than 100.'
                return false
            }

            if (!this.addressInfo.postcode) {
                this.errorTxt.postcode = 'Please enter your Zip Code.'
                return false
            }else if (this.addressInfo.postcode.length > 45) {
                this.errorTxt.postcode = 'Zip Code need length is min than 45.'
                return false
            }

            if (!this.addressInfo.phone) {
                this.errorTxt.phone = 'Please enter your phone.'
                return false
            }else if (this.addressInfo.phone.length > 45) {
                this.errorTxt.phone = 'your phone need length is min than 45.'
                return false
            }

            return true
        },
        countryChange(opt) {
            if (this.addressInfo.countryCode == opt.key) return
            this.addressInfo.countryCode = opt.key;
            this.addressInfo.countryName = opt.val;
            // Todo 拿回当前国家的州数据，并设置第一个为默认值
            // this.stateData = stateDataOther;
            // this.stateVal = stateDataOther[0].value;
            // this.stateKey = stateDataOther[0].key;
        },
        stateChange(opt) {
            this.addressInfo.stateCode = opt.val;
            this.addressInfo.state = opt.key;
            console.log(this.addressInfo.stateCode)
        },
        getAddressData() {
            var that = this;
            ajax.get('/api/address/get', {
                storeId: this.$route.params.storeid || ""
            }, function(data) {
                data && (that.addressInfo = data);
                that.countryIsReady = true;
                that.getStateData(data.countryCode || that.countryData[0].key);
            }, function(data) {
                if (data.code == 4001) {
                    that.countryIsReady = true;
                    that.getStateData(that.countryData[0].key);
                } else if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_address',
                businessId: '',
                page_cost_time: cost_time,
            })
		},
        getStateData(countryCode) {
            var that = this,
                sendData = {
                    countryCode: countryCode
                }
            ajax.get('/api/address/get_state_list', sendData, function(data) {
                let stateItems = [];
                data.items.map(item => {
                    stateItems.push({
                        key: item.state,
                        value: item.stateCode
                    })
                })
                that.stateData = stateItems;
                that.stateIsReady = true
            }, function(data) {
                if (data.msg) {
                    that.showMsg = data.msg
                    that.showToast()
                }
            })
        }
    },
    mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$el.style.minHeight = h + 'px';
        this.getAddressData();
        this.start_time = new Date().getTime();
        this.storeId = this.$route.params.storeid

		window.onbeforeunload = this.onunload_handler;
		if(!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
            window.addEventListener("pagehide", this.onunload_handler, false);
        };
        wxAction.init({
            hideAllMenuItem: true
        });
        PageviewGA.onPageViewFired(this.$route.path)
    }
}
</script>
<style lang="css">
.address-form .selectBoxState {
    color: #999;
}

.address-form {
    margin-bottom: 6rem;
}

.address-form .mu-text-field {
    width: auto;
    height: 3.86rem;
    margin-left: .86rem;
    display: block;
}

.address-form .address-input {
    height: 3.86rem;
}

.address-form .mu-text-field-line.disabled {
    border-bottom: 1px solid #e5e5e5;
}

.address-form .mu-text-field-hint {
    text-align: left;
    height: 3.86rem;
    line-height: 3.86rem;
    margin-left: .86rem;
}

.address-wrap .address-submit-btn {
    width: 22rem;
    height: 3.5rem;
    border-radius: 50px;
    background-color: #CD0E00;
    color: #fff;
    font-size: 1.14rem;
    position: fixed;
    bottom: 1rem;
    left: 50%;
    margin-left: -11rem;
}
.address-form .mu-text-field-help {
    right: 1.2rem;
}
</style>
