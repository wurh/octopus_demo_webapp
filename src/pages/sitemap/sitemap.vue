<template> 
    <div>
        <p class="title">站点导航</p>
        <mu-list>
            <mu-list-item v-for="(item,index) in mapList" :key="index" v-if="!item.hide" :title="item.desc" :to="item.path" class="text-left"></mu-list-item>
        </mu-list>
    </div>
  
</template>
<script>
import routerList from '@/router/router-list.js'
export default {
    data(){
        return {
            mapList:routerList
        }
    }
}
</script>
<style scoped>
.title{
    font-size: 1.3rem;
    line-height: 2.5rem;
}
.text-left {
    text-align: left;
}
</style>
