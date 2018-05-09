<template>
<!-- 组件功能：详情页中的描述中，衣服的size展示 -->
    <div>
        <nav v-if="sizeGuideInfo.hasSizeTab && sizeGuideInfo.hasStandardTab" class="size-guide-nav">
            <p v-bind:class="{active: activeSizeChange == 'size-chart' }" class="size-guide-nav-left" @click="handleSizeChange('size-chart')">Size Chart</p>
            <p v-bind:class="{active: activeSizeChange == 'standard-sizing' }" class="size-guide-nav-right" @click="handleSizeChange('standard-sizing')">Standard Sizing</p>
        </nav>
        <div v-show="activeSizeChange === 'size-chart'">
            <div class="tabCon">
                <div class="size-guide-box size-guide-box2">
                    <p v-if="sizeGuideInfo.sizeChartInfo" v-html="sizeGuideInfo.sizeChartInfo" class="size-tips"></p>
                    <mu-radio v-if="canSwitch" name="verticalPosition" v-model="activeTableChange" label="Inch" nativeValue="Inch" @change="handleTableChange"/>
                    <mu-radio v-if="canSwitch" name="verticalPosition" v-model="activeTableChange" label="CM" nativeValue="CM" @change="handleTableChange"/>
                </div>
                <div v-if="sizeGuideInfo.sizeChart && sizeGuideInfo.sizeChart.length > 0" class="size-guide-box size-guide-table-box">
                    <div v-show="activeTableChange === 'Inch'">
                       <table v-if="sizeGuideInfo.sizeChart && sizeGuideInfo.sizeChart.length > 0" class="size-guide-table" :style="returnTableWidth(sizeGuideInfo.sizeChart)">
                            <tbody>
                                <tr v-for="item in sizeGuideInfo.sizeChart" class="size-guide-item" >
                                    <td v-for="(size, index) in item" v-bind:class="{firstTd:index == 0}" >{{ size }}</td>
                                </tr>
                            </tbody>
                        </table> 
                    </div>
                    <div v-show="activeTableChange === 'CM'">
                        <table v-if="sizeTableCm.sizeChart && sizeTableCm.sizeChart.length > 0" class="size-guide-table" :style="returnTableWidth(sizeTableCm.sizeChart)">
                            <tbody>
                                <tr v-for="item in sizeTableCm.sizeChart" class="size-guide-item" :key="item">
                                    <td v-for="(size, index) in item" v-bind:class="{firstTd:index == 0}" :key="size">{{ size }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div v-if="sizeGuideInfo.sizeChartImage" class="size-guide-img-box">
                    <img :src="sizeGuideInfo.sizeChartImage" alt="">
                </div>
            </div>
        </div>
        <div v-show="activeSizeChange === 'standard-sizing'">
            <div class="tabCon">
                <div class="size-guide-box size-guide-box2">
                    <p v-if="sizeGuideInfo.standardChartInfo" v-html="sizeGuideInfo.standardChartInfo" class="size-tips"></p>
                </div>
                <div v-if="sizeGuideInfo.standardChart && sizeGuideInfo.standardChart.length > 0" class="size-guide-box size-guide-table-box">
                    <table class="size-guide-table" :style="returnTableWidth(sizeGuideInfo.standardChart)">
                        <tbody>
                            <tr v-for="item in sizeGuideInfo.standardChart" class="size-guide-item">
                                <td v-for="(size, index) in item" v-bind:class="{firstTd:index == 0}">{{ size }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="sizeGuideInfo.standardChartImage" class="size-guide-img-box">
                    <img :src="sizeGuideInfo.standardChartImage" alt="">
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['sizeGuideInfo', 'sizeTableCm'],
        data(){
            return {
                activeSizeChange: '',
                activeTableChange: 'Inch',
                canSwitch: false,
                isFirstClickTable: true
            }
        },
        methods: {
            handleSizeChange(val){
                this.activeSizeChange = val;
            },
            handleTableChange(val){
                let that = this;
                if(this.isFirstClickTable){
                    this.$emit('getCMTable',function(){
                        that.isFirstClickTable = false;
                        that.activeTableChange = val;
                    })
                }else{
                    this.activeTableChange = val;
                }
            },
            returnTableWidth(tableList){
                if(tableList.length <= 0) return
                let num = tableList[0].length >= 1 ? tableList[0].length - 1 : 0,
                    tableWidth = num * 2.8 + 4.8;
                return {
                    width: tableWidth + "rem"
                }
            }
        },
        mounted() {
            this.sizeGuideInfo.hasStandardTab && (this.activeSizeChange = 'standard-sizing');
            this.sizeGuideInfo.hasSizeTab && (this.activeSizeChange = 'size-chart');
            this.canSwitch = this.sizeGuideInfo.canSwitchUnit || false;
        }
    }
</script>
<style lang="css">
.size-guide-box .mu-radio-icon {
    margin-right: .5rem;
}
.size-guide-box .mu-radio {
    margin-right: .8rem;
    margin-bottom: .86rem;
}
</style>

<style scoped>
.size-guide-nav {
    margin: 1.14rem 0;
    display: -webkit-box;
    display: -moz-box;
    display: -ms-box;
    display: -o-box;
    /* display: box; */
    -webkit-box-pack: center;
    -moz-box-pack: center;
    -o-box-pack: center;
    -ms-box-pack: center;
    box-pack: center;
    -webkit-box-align: center;
    -moz-box-align: center;
    -o-box-align: center;
    -ms-box-align: center;
    box-align: center;
}
.size-guide-nav p {
    text-align: center;
    height: 2.07rem;
    line-height: 2.07rem;
    font-size: .93rem;
    color: #333;
    border: 1px solid #333;
    width: 10rem;
    background: #fff;
}
.size-guide-nav .size-guide-nav-right {
    border-radius: 0 .3rem .3rem 0;
}
.size-guide-nav .size-guide-nav-left {
    border-radius: .3rem 0 0 .3rem;
}
.size-guide-nav p.active {
    background: #333;
    color: #fff;
}
.size-tips{
    margin-bottom: 1.43rem;
    font-size: .86rem;
    color: #666;
}
.size-guide-box {
    border-bottom: .5rem solid #e5e5e5;
}
.size-guide-box2{
    text-align: left;
    padding: 0 .86rem;
}
.size-guide-table-box {
    overflow-x: auto;
}
table {
    min-width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}
table td {
    min-width: 2.8rem;
    height: 3.25rem;
    padding: 0 1px;
    text-align: center;
    font-size: .75rem;
    vertical-align: middle;
    border: 1px solid #e5e5e5;
}
table .firstTd{
    width: 4.8rem;
    background: #333;
    border: 1px solid #666;
    color: #fff;
}
.size-guide-img-box, .size-guide-img-box img {
    width: 100%;
}
</style>