<template>
    <aside class="main-sidebar">
        <section class="sidebar">
            <!-- Sidebar user panel -->
            <div class="user-panel">
                <div class="pull-left image">
                    <img :src="profile.avatar" class="img-circle" alt="User Image">
                </div>
                <div class="pull-left info">
                    <p v-text="profile.username"></p>
                    <a href="#" v-if="profile.status==1"><i class="fa fa-circle text-success"></i> 在线</a>
                </div>
            </div>

            <!-- search form -->
            <div class="sidebar-form">
                <div class="input-group">
                    <input type="text" class="form-control" style="font-size: 13px;" placeholder="搜索感兴趣的人" v-model="searchKey" @keyup.enter="search">
                    <span class="input-group-btn">
                        <button class="btn btn-flat" @click="search"><i class="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            </div>
            <!-- /.search form -->

            <ul class="sidebar-menu">
                <li class="header">导航栏</li>

                <li v-for="(item, index) in menuList"  class="treeview" :class="{'active': currentMenu==item.view}">
                    <router-link :to="{name: item.view}">
                        <i v-bind:class="item.icon"></i> <span v-text="item.name"></span>

                        <span v-if="item.new>0" class="pull-right-container">
                           <small class="label pull-right bg-green" v-text="item.new"></small>
                        </span>
                    </router-link>
                </li>
            </ul>
        </section>
    </aside>
</template>

<script>
import {getCookie} from '../common/cookie'

export default {
    mounted () {
        this.$nextTick(() => {
            $("aside").height($(document).height()-$("header").height());
        });
    },
    data () {
        return {
            menuList: [{
                "id" : 1,
                "name": "新发现",
                "view" : "discover",
                "icon" : "fa fa-eye",
                "new": 0
            }, {
                "id" : 2,
                "name": "写东西",
                "view" : "publish",
                "icon" : "fa fa-edit",
                "new": 0
            }, {
                "id" : 3,
                "name": "收藏夹",
                "view" : "collection",
                "icon" : "fa fa-bookmark",
                "new": 0
            }, {
                "id" : 4,
                "name": "我的文章",
                "view" : "myPost",
                "icon" : "fa fa-newspaper-o",
                "new": 0
            }],

            searchKey: ''
        }
    },
    computed: {
        currentMenu () {
            var path = this.$route.path.split('/');
            while(!isNaN(Number(path[path.length-1]))){
                path.splice(path.length-1,1);
            }
            return path[path.length-1]
        },

        profile () {
            return this.$store.state.user.profile;
        }
    },
    methods: {
        search () {
            const _self = this;

            if(_self.searchKey.trim()){
                _self.$router.push({ name: 'seacrhUserListByName', params: { searchkey: _self.searchKey }})
            }else{
                layer.msg("搜索关键字不能为空", {
                    time: 1800
                });
                return;
            }
        }
    }
}
</script>
