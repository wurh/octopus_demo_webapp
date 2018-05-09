<template>
    <section class="container apply-wrap">
        <div style="display:none" v-title>合伙人申请</div>
        <my-header :headData="headData"></my-header>
        <div class="apply-tips">
            <p>如何申请：</p>
            <ul>
                <li>完成以下资料填写；</li>
                <li>提交申请，审核成功后 ，会通过邮件以及公众号进行提醒，立刻为您开通店铺。</li>
                <li>通过公众号入口即可进入您的店铺</li>
            </ul>
        </div>
        <div class="form-head"></div>
        <div class="apply-form">
            <step-select v-if="countryData.length > 0 && countryIsReady" selectBoxClass="selectBoxState" refName="countrySelect" :items="countryData" :selectVal="addressInfo.countryCode" :label="addressInfo.countryName" @selectChange="countryChange" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="名称" @focus="hideText('linkman')" v-model="addressInfo.linkman" :errorText="errorTxt.linkman" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="邮箱（可接收审核状态信息及通知信息）" @focus="hideText('email')" v-model="addressInfo.email" :errorText="errorTxt.email" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="地址1（店铺收货地址）" @focus="hideText('address1')" v-model="addressInfo.address1" :errorText="errorTxt.address1" />
            <br/>
            <mu-text-field class="dis-nust" inputClass="address-input" hintText="地址2 (选填)" v-model="addressInfo.address2" :errorText="errorTxt.address2" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="城市" @focus="hideText('city')" v-model="addressInfo.city" :errorText="errorTxt.city" />
            <br/>
            <step-select v-if="stateData.length > 0 && stateIsReady" selectBoxClass="selectBoxState" refName="stateSelect" :items="stateData" :selectVal="addressInfo.stateCode" :label="addressInfo.state" @selectChange="stateChange" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="邮编" @focus="hideText('postcode')" v-model="addressInfo.postcode" :errorText="errorTxt.postcode" />
            <br/>
            <mu-text-field inputClass="address-input" hintText="联系电话" @focus="hideText('phone')" v-model="addressInfo.phone" :errorText="errorTxt.phone" />
            <br/>
            <mu-raised-button label="提交" class="address-submit-btn" @click="handleSubmit" />
        </div>
        <!-- <mu-raised-button label="提交" class="address-submit-btn" @click="handleSubmit" /> -->
        <mu-toast v-if="toast" :message="showMsg" @close="hideToast" />
    </section>
</template>
<script>
import MyHeader from '../../components/l-header/l-header.vue';
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
                email: "",
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
        StepSelect
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
        handleSubmit() {
            var that = this;
            if (!that.canPost() || that.loading) return
            that.loading = true;
            ajax.post('/api/store/apply', { address: that.addressInfo }, function(data) {
                that.$router.push('/applysuccess');
                that.loading = false;
            }, function(data) {
                if(data.code == 10001){
                    that.showMsg = data.msg;
                    that.showToast(function(){
                        that.$router.replace('/store/account');
                    })
                }else if (data.msg) {
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
                this.errorTxt.linkman = '请输入你的名字'
                return false
            }else if (this.addressInfo.linkman.length > 45) {
                this.errorTxt.linkman = '你的名字长度需要少于45个字'
                return false
            }
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if (!this.addressInfo.email) {
                this.errorTxt.email = '请输入你的邮箱'
                return false
            }else if (!filter.test(this.addressInfo.email)) {
                this.errorTxt.email = '请输入正确的邮箱'
                return false
            }

            if (!this.addressInfo.address1) {
                this.errorTxt.address1 = '请输入你的地址'
                return false
            }else if (this.addressInfo.address1.length > 200) {
                this.errorTxt.address1 = '你的地址长度应当小于200个字'
                return false
            }

            if (this.addressInfo.address2 && this.addressInfo.address2.length > 200) {
                this.errorTxt.address2 = '你的第二地址长度应当小于200个字'
                return false
            }

            if (!this.addressInfo.city) {
                this.errorTxt.city = '请输入你的城市'
                return false
            }else if (this.addressInfo.city.length > 100) {
                this.errorTxt.city = '你的城市长度应当小于100个字'
                return false
            }

            if (!this.addressInfo.postcode) {
                this.errorTxt.postcode = '请输入你的邮政编码'
                return false
            }else if (this.addressInfo.postcode.length > 45) {
                this.errorTxt.postcode = '邮政编码的长度应当小于45个数字'
                return false
            }

            if (!this.addressInfo.phone) {
                this.errorTxt.phone = '请输入你的手机号码'
                return false
            }else if (this.addressInfo.phone.length > 45) {
                this.errorTxt.phone = '你的手机号码应当保持在45个数字以内'
                return false
            }

            return true
        },
        countryChange(opt) {
            if (this.addressInfo.countryCode == opt.key) return
            this.addressInfo.countryCode = opt.key;
            this.addressInfo.countryName = opt.val;
        },
        stateChange(opt) {
            this.addressInfo.stateCode = opt.val;
            this.addressInfo.state = opt.key;
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
            ajax.get('api/address/get_state_list', sendData, function(data) {
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
                that.showMsg = data.msg
                that.showToast()
            })
        }
    },
    mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        this.$el.style.minHeight = h + 'px';
        this.countryIsReady = true;
        this.getStateData(this.countryData[0].value);
        this.start_time = new Date().getTime();
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
<style lang="less">
.apply-form .selectBoxState {
    color: #999;
    margin-left: 0;
}
.apply-form .mu-text-field {
    width: auto;
    height: 3.86rem;
    display: block;
}
.apply-form .mu-text-field:before {
    content: "*";
    color: #CD0E00;
    position: absolute;
    left: -.7rem;
    top: 38%;
}
.apply-form .mu-text-field.dis-nust:before {
    display: none;
}
.apply-form .mu-text-field-line.disabled {
    border-bottom: 1px solid #e5e5e5;
}
.apply-form .mu-text-field-help {
    right: 1.2rem;
}
.apply-form .mu-text-field-hint {
    text-align: left;
    height: 3.86rem;
    line-height: 3.86rem;
    margin-left: .86rem;
}
.apply-form .address-input {
    height: 3.86rem;
}
</style>
<style lang="less" scoped>
.apply-wrap{
    background: #000;
}
.form-head{
    position: relative;
    width: 100%;
    height: 6.36rem;
    background-image: url(/static/img/pages/apply-form-top@2x.png);
    background-size: 100% 100%;
    top: 1px;
}
.apply-form {
    background: #fff;
    padding: 0 1.36rem 1rem;
}
.apply-wrap .address-submit-btn {
    width: 22rem;
    height: 3.5rem;
    border-radius: 50px;
    background-color: #CD0E00;
    color: #fff;
    font-size: 1.14rem;
    position: relative;
    margin: 0 auto;
}

.apply-tips{
    text-align: left;
    color: #fff;
    padding: 0 1.14rem;
    p {
        font-size: 1rem;
        line-height: 2.4rem;
    }
    li {
        font-size: .86rem;
        margin-bottom: .76rem;
        &:before {
            content: "";
            width: .71rem;
            height: .71rem;
            display: inline-block;
            border-radius: 50%;
            border: #fff 1px solid;
            margin-right: .71rem;
        }
    }
}
</style>
