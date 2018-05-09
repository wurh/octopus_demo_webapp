<template>
    <section class="tagchoice-wrap">
        <div class="tag-header">Choose what you like to get personalized ideas</div>
        <ul class="tag-ul">
            <li v-for="(item, index) in items" :key="index" :data-id="item.tagId" @click="updateSelect(index)">
                <div class="tag-wrap" :data-id="item.tagId" :class="{'on': item.selected, 'off': !item.selected}" >
                    <img :data-id="item.tagId" style="width: 100%; height: 100%" :src="item.imgUrl" />
                    <div :data-id="item.tagId" class="tag-select-mask"></div>
                    <i v-show="item.selected" class="iconfont-right" :data-id="item.tagId">&#xe69d;</i>
                    <div class="tag-line" :data-id="item.tagId">{{item.tagName}}</div>
                </div>
            </li>
            <!-- <mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/> -->
        </ul>
        <div class="bottom-btn">
            <mu-raised-button :label="btnText" class="next-btn" @click="handleSubmit" />
        </div>
        <mu-toast v-if="toast" :message="message" @close="hideToast"/>
    </section>
</template>
<script>
import ajax from '../../lib/ajax'
import wxAction from '../../util/wx-action';
import PageviewGA from '@/components/g-com/g-pageview.js'
import poclog from '../../util/poclog';
export default {
    data() {
        return {
        	message: '',
            toast: false,
            //numsPerPage: 20,
            //currentPage: 1,
            //scroller: null,
            //loading: false,
            isEnd: false,
            items: [],
            fromLogin: false,
            btnText: 'Done',
            start_time: ''
        }
    },
    components: {},
    methods: {
    	hideToast() {
    		this.toast = false;
    	},
        updateSelect(index) {
            this.items[index].selected = !this.items[index].selected;
        },
        handleSubmit() {
            let that = this,
            sendData = {
                tagList: [],
                platform:'wap'
            };
        	for (var i = that.items.length - 1; i >= 0; i--) {
        		if(that.items[i].selected) {
        			sendData.tagList.push(that.items[i].tagId);
        		}
            }
        	if(sendData.tagList.length > 0) {
                ajax.post('/api/tag/update_tags_by_user', sendData, function (data) {
                    that.fromLogin && (that.$router.push('/'));
                    !that.fromLogin && (that.$router.push('/account'));
                }, function (data) {
                    if(data.msg){
                        that.showLog(data.msg)
                    }
                })
                
        	} else {
                that.showLog('Please select at least one')
        	}
        },
        showLog(text) {
            this.message = text;
            this.toast = true;
            let timer = setTimeout(this.hideToast, 2000);
        },
        getListData() {
			var that = this;
            that.loading = true;
            let senddata = {
                // currentPage: that.currentPage,
                // numsPerPage: that.numsPerPage,
                platform:'wap'
            }
			ajax.get('/api/tag/get_tags_by_user', senddata, function (data) {
                if(data.items && data.items.length > 0){
                    that.items.push(...data.items);
                    //that.currentPage += 1;
                    that.loading = false;
                } else {
                    that.isEnd = true; 
                }
			}, function (data) {
				if(data.msg){
                    that.showLog(data.msg)
                }
			})
        },
        onunload_handler(e) {
            let end_time = new Date().getTime();
            let cost_time = end_time - this.start_time;
            let _me = this;
			poclog.sendPageData({
                page: 'page_octopus_tagchoice',
                businessId: '',
                page_cost_time: cost_time,
            })
		}
		// loadMore(){
        //     if(!that.isEnd){
        //         this.getListData()
        //     }
        // }
    },
	mounted() {
        let h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
		this.$el.style.minHeight = h + 'px';
        //this.scroller = this.$el
        console.log(this.$route)
        this.fromLogin = this.$route.name == 'tagchoice';
        this.fromLogin && (this.btnText = 'Next');
        this.getListData();
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
<style scoped>
.tag-select-mask {
    background-color: rgba(205, 14, 0, 0.7);
    width: 11.25rem;
    height: 11.25rem;
    position: absolute;
    top: 0;
}

.on .tag-select-mask{
	background: rgba(255,0,0,.4);
}
.off .tag-select-mask{
	background: rgba(0,0,0,.3);
}
.tagchoice-wrap{
    min-height: 100%;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
}
.tagchoice-wrap .tag-header {
    width: 20.15rem;
    text-align: center;
    height: 8rem;
    margin: 1.8rem auto 0;
    font-size: 1.29rem;
    font-weight: bold;
    color: #333;
}

.tagchoice-wrap .tag-ul {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 5.79rem;
    width: 100%;
    clear: both;
}

.tagchoice-wrap .tag-ul li {
    margin-bottom: 1.39rem;
    box-sizing: border-box;
    display: inline-block;
    width: 50%;
}

.tagchoice-wrap .tag-ul .tag-wrap {
    width: 11.25rem;
    height: 11.25rem;
    line-height: 11.25rem;
    margin: 0 auto;
    background-color: #666;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
}

.tagchoice-wrap .tag-ul .tag-line {
    position: absolute;
    width: 100%;
    height: 4rem;
    line-height: 4rem;
    font-size: 1.21rem;
    color: #fff;
    text-align: center;
    bottom: 0;
    display: -webkit-box;
    /* display: box; */
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.tagchoice-wrap .bottom-btn {
    height: 5.79rem;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    width: 100%;
}

.tagchoice-wrap .next-btn {
    margin-top: 1.14rem;
    width: 22rem;
    height: 3.5rem;
    border-radius: 50px;
    background-color: #CD0E00;
    color: #fff;
    font-size: 1.14rem;
}

@font-face {
    font-family: 'iconfont-right';
    src: url('font/iconfont.eot');
    src: url('font/iconfont.eot?#iefix') format('embedded-opentype'), url('font/iconfont.woff') format('woff'), url('font/iconfont.ttf') format('truetype'), url('font/iconfont.svg#iconfont') format('svg');
}

.tagchoice-wrap .iconfont-right {
    font-family: "iconfont-right" !important;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
    font-size: 2.17rem;
    color: #fff;
    position: absolute;
    top: 0;
    left: 50%;
    margin-left: -1rem;
}
</style>