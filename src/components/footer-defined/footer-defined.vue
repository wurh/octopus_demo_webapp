<template>
    <div class="footer-defined-wrap">
        <ul class="footer-defined-ul">
            <li v-for="(item, index) in items" :key="`footer-defined-li-${index}`" class="footer-defined-li" @click="handleClick(index)">
                <router-link :to="item.detailUrl" :class="item.action ? 'on' : ''">
                    <img v-if="item.action" class="icon-footer-defined-item" :src="item.iconUrl_on" />
                    <img v-else class="icon-footer-defined-item" :src="item.iconUrl_off" />
                    <p>{{ item.title }}</p>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                
            }
        },
        props: {
            items: {
                type: Array,
                default: []
            }
        },
        methods: {
            setImgUrl(bool) {
                return bool ? item.iconUrl_on : iconUrl_off
            },
            handleClick(index) {
                // this.items[index].action = !this.items[index].action;
                this.$emit('handleClick', this.items[index], index);
            }
        },
        created(){

        }
    }
</script>

<style type="css" scoped>
    .footer-defined-wrap {
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 1;
        width: 100%;
        height: 3.19rem;
        border-top: 1px solid #f2f2f2;
        color: #8E8E93;
        background: white;
    }
    .footer-defined-ul {
        display: flex;
        align-items: center;
    }
    .footer-defined-li {
        flex: 1;
        overflow: hidden;
    }
    a {
        display: block;
        color: initial;
    }
    a.on {
        color: #CD0E00;
    }
    p {
        font-size: .63rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .icon-footer-defined-item {
        width: 3rem;
        height: 2rem;
    }
</style>
