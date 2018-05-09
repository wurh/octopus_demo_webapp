<template>
    <section class="container store-wrap">
        <store-header :headerData="headerData">
            <template slot-scope="props">
                <!-- <div class="selfAddr">
                    <i class="icon-map-point"></i>
                    <span class="self-addr-desc">自提地址：79 Morris Ridges Suite 599</span>
                </div> -->
                <router-link to="/store/info" class="btn-store-info">店铺信息</router-link>
            </template>
        </store-header>
        <h4 class="store-manage-list-title">
            我的商品
            <!-- <span>20</span>     -->
        </h4>
        <!-- 列表 -->
        <store-items 
            v-if="goodsItems.items.length > 0"
            wrapClass="store-manage-list" 
            :btnType="btnType" 
            :unit="goodsItems.unit" 
            :itemsData="goodsItems.items" 
            @handleDecrease="handleDecrease" 
            @handleShare="handleShare">
        </store-items>
        <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
        <!-- 尾部 -->
        <my-footer :items="footerItems" @handleClick="handleFooterClick" />
       <!-- 提示框 -->
        <mu-toast  v-if="toast" :message="message" @close="hideToast" />
        <!-- 分享弹窗 -->
        <my-share :show="showShare" @show-Share="onShowShare"></my-share>
    </section>
</template>

<script>
import myFooter from '@/components/footer-defined/footer-defined.vue';
import ajax from '../../lib/ajax';
import storeItems from '@/components/store-choose-items/store-choose-items.vue';
import storeHeader from '@/components/store-header/store-header.vue';
import wxAction from '../../util/wx-action';
import MyShare from '../../components/sharemask/sharemask.vue';

export default {
    name: 'store',
    components: {
        myFooter,
        storeItems,
        storeHeader,
        MyShare
    },
    data() {
        return {
            toast: false,
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
                action: true
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
                action: false
            }],
            goodsItems: {
                unit: '$',
                pageNum: 1,
                pageSize: 10,
                items: []
            },
            btnType: ['dec', 'share'],
            headerData: {},
            scroller: null,
            loading: false,
            showShare: false
        }
    },
    methods: {
        handleFooterClick(item, index) {
            // console.log(item, index);
        },
        handleDecrease(floorIndex, index, item) {
            let _this = this;
            ajax.post('/api/store/take_off_shelves', {
                skaIds: [item.skaId],
                storeId: 9
            }, _ => {
                _this.goodsItems.items.splice(index, 1);
            })
        },
        handleShare(floorIndex, index, item) {
            var shareInfo = {
                title: "【章鱼店铺大发现】" + this.store.storeName + "掌柜从全球挑选出的所有好货都在这里，快来看看吧！ ", // 分享标题
                desc: "全球精选尖货，包邮到北美，正品保证，尽在【章鱼掌柜】", // 分享描述
                imgUrl: item.productImg, // 分享图标
                link: location.host + '/detail/'+ item.storeId + '/' + item.skaId,
                url: location.host + '/detail/'+ item.storeId + '/' + item.skaId
            };
            wxAction.init({
                shareInfo: shareInfo
            });
            this.onShowShare(true);
        },
        onShowShare(boolean = true) {                  
            this.showShare = !!boolean
        },
        
        getGoodsItems(bool) {
            let _this = this;

            let pageNum = !bool ? _this.goodsItems.pageNum + 1 : _this.goodsItems.pageNum;
            
            ajax.get('/api/store/selected_product', {
                storeId: 9,
                page: pageNum,
                pageSize: _this.goodsItems.pageSize
            }, function(res) {
                let arr = _this.goodsItems.items.concat(res.items || []);
                _this.goodsItems.pageNum = pageNum;
                _this.goodsItems.items = [...arr];
                _this.loading = false;
            });
        },
        loadMore() {
            this.loading = true;
            this.getGoodsItems(false);
        }
    },
    mounted() {
        let _this = this;
        this.scroller = window;
        ajax.get('/api/store/info', {
            storeId: '',
            userId: ''
        }, res => {
            _this.headerData = res;
        })
        this.getGoodsItems(true);
    }
}
</script>
<style src="./storemanage.css" scoped></style>